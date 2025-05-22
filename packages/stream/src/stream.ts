import { Comparator } from '@ts-java/comparator';
import { Optional } from '@ts-java/optional';
import type { BaseStream } from './base.stream';

import { IllegalStateException } from '@ts-java/common/exception/illegal-state';
import { NullPointerException } from '@ts-java/common/exception/null-pointer';
import {
  isFunction,
  isNone,
  isNull,
  isUndefined,
} from '@ts-java/common/typeguards';
import { AutoClose } from './decorators/auto-close';
import { IsNotClosed } from './decorators/is-not-closed';
import type { BiFunction, BinaryOperator } from './types';

export abstract class Stream<T> implements BaseStream<T, Stream<T>> {
  public static concat<T>(a: Stream<T>, b: Stream<T>): Stream<T> {
    const aIterator = a.iterator();
    const bIterator = b.iterator();

    return new Stream.#Impl<T>(
      {
        next() {
          const next = aIterator.next();

          if (!next.done) {
            return next;
          }

          return bIterator.next();
        },
      },
      a.expectedStreamSize + b.expectedStreamSize
    );
  }

  public static empty<T>(): Stream<T> {
    return new Stream.#Impl<T>(
      {
        next() {
          return { done: true, value: undefined };
        },
      },
      0
    );
  }

  public static generate<T>(supplier: () => T): Stream<T> {
    return new Stream.#Impl<T>(
      {
        next() {
          return { done: false, value: supplier() };
        },
      },
      Number.POSITIVE_INFINITY
    );
  }

  public static iterate<T>(seed: T, f: (value: T) => T): Stream<T> {
    let lastValue: T;

    return new Stream.#Impl<T>(
      {
        next() {
          if (isUndefined(lastValue)) {
            lastValue = seed;
          } else {
            lastValue = f(lastValue);
          }

          return { done: false, value: lastValue };
        },
      },
      Number.POSITIVE_INFINITY
    );
  }

  public static of<T>(element: T): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T> {
    return new Stream.#Impl<T>(elements[Symbol.iterator](), elements.length);
  }

  public static ofArray<T>(element: T[]): Stream<T> {
    return new Stream.#Impl<T>(element[Symbol.iterator](), element.length);
  }

  readonly #iterator: Iterator<T>;
  readonly #iterable: Iterable<T>;

  /**
   * Internal indicator if a stream has been consumed.
   * Used by the {@link IsNotClosed} decorator.
   */
  protected isClosed: boolean;

  /**
   * Internal counter to know how many elements the stream will produce.
   * Might be Infinity for generator streams.
   */
  private readonly expectedStreamSize: number;

  /**
   * A list of all provided closeHandlers.
   */
  private closeHandlers: Array<() => void>;

  protected constructor(iterator: Iterator<T>, streamSize: number) {
    this.#iterator = iterator;
    this.#iterable = {
      [Symbol.iterator]: () => iterator,
    };

    this.expectedStreamSize = streamSize;

    this.isClosed = false;
    this.closeHandlers = [];
  }

  public close(): void {
    this.isClosed = true;

    for (const closeHandler of this.closeHandlers) {
      closeHandler();
    }

    this.closeHandlers = [];
  }

  @IsNotClosed
  @AutoClose
  public iterator(): Iterator<T> {
    return this.#iterator;
  }

  public onClose(closeHandler: () => void): this {
    this.closeHandlers.push(closeHandler);
    return this;
  }

  public unordered(): Stream<T> {
    throw new Error('Method not implemented.');
  }

  static readonly #Impl = class StreamImpl<T> extends Stream<T> {
    constructor(iterator: Iterator<T>, streamSize = 0) {
      super(iterator, streamSize);
    }

    static {
      Object.defineProperty(this.prototype, Symbol.toStringTag, {
        value: 'Stream',
        configurable: true,
        enumerable: false,
        writable: false,
      });
    }
  };

  @IsNotClosed
  @AutoClose
  public allMatch(predicate: (value: T) => boolean): boolean {
    for (const value of this.#iterable) {
      if (!predicate(value)) {
        return false;
      }
    }

    return true;
  }

  @IsNotClosed
  @AutoClose
  public anyMatch(predicate: (value: T) => boolean): boolean {
    for (const value of this.#iterable) {
      if (predicate(value)) {
        return true;
      }
    }

    return false;
  }

  // @todo: add Collector class/interface
  public collect(collector: unknown): never {
    throw new Error('Method not implemented.');
  }

  @IsNotClosed
  @AutoClose
  public count(): number {
    let count = 0;

    while (!this.#iterator.next().done) {
      count++;
    }

    return count;
  }

  public distinct(): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public filter(predicate: (value: T) => boolean): Stream<T> {
    return new Stream.#Impl<T>({
      next: () => {
        let result: IteratorResult<T>;

        do {
          result = this.#iterator.next();

          if (result.done) {
            break;
          }
        } while (!predicate(result.value));

        return result;
      },
    });
  }

  @IsNotClosed
  @AutoClose
  public findAny(): Optional<T> {
    let next: IteratorResult<T>;

    // try to find any element
    do {
      next = this.#iterator.next();

      if (isUndefined(next.value)) {
        continue;
      }

      return Optional.of(next.value);
    } while (!next.done);

    return Optional.empty();
  }

  @IsNotClosed
  @AutoClose
  public findFirst(): Optional<T> {
    const next = this.#iterator.next();

    if (isUndefined(next.value)) {
      return Optional.empty();
    }

    return Optional.of(next.value);
  }

  public flatMap<R>(mapper: (value: T) => Stream<R>): Stream<R> {
    const iterator = this.#iterator;
    let mappedStream: Stream<R>;
    let mappedIterator: Iterator<R> | null = null;

    return new Stream.#Impl<R>(
      {
        next() {
          // go over to our next element in the stream
          if (isNull(mappedIterator)) {
            // the next element of the existing stream
            const outerNext = iterator.next();

            // if we're done, end the iteration
            if (outerNext.done) {
              return { done: true, value: undefined };
            }

            // get the next stream so we can iterate over it
            mappedStream = mapper(outerNext.value);
            mappedIterator = mappedStream.#iterator;
          }

          const innerNext = mappedIterator.next();

          // if the mapped stream is done, close it and go to our next element
          if (innerNext.done) {
            mappedStream.close();
            mappedIterator = null;

            // recurse to the our next element
            return this.next();
          }

          return innerNext;
        },
      },
      // assume that there will be at least the same amount of elements
      this.expectedStreamSize
    );
  }

  // @todo: replace => Stream<number> with NumberStream
  public flatMapToNumber(mapper: (value: T) => Stream<number>): Stream<number> {
    throw new Error('Method not implemented.');
  }

  @IsNotClosed
  @AutoClose
  public forEach(action: (value: T) => void): void {
    for (const elem of this.#iterable) {
      action(elem);
    }
  }

  public limit(maxSize: number): Stream<T> {
    if (Number.isNaN(maxSize) || !Number.isInteger(maxSize) || maxSize < 0) {
      throw new TypeError('maxSize must be a positive integer');
    }

    let passedElements = 0;
    return new Stream.#Impl(
      {
        next: () => {
          if (passedElements >= maxSize) {
            return { done: true, value: undefined };
          }
          passedElements++;
          return this.#iterator.next();
        },
      },
      // assume that there might be up to maxSize elements remaining in the stream
      maxSize
    );
  }

  public map<U>(mapper: (element: T) => U): Stream<U> {
    return new Stream.#Impl<U>(
      {
        next: () => {
          for (const elem of this.#iterable) {
            return { value: mapper(elem), done: false };
          }

          return { value: undefined, done: true };
        },
      },
      // just mapping the value does not alter the total amount of elements
      this.expectedStreamSize
    );
  }

  // @todo: replace Stream<number> with NumberString
  public mapToNumber(mapper: (value: T) => number): Stream<number> {
    throw new Error('Method not implemented.');
  }

  @IsNotClosed
  @AutoClose
  public max(comparator: Comparator<T>): Optional<T> {
    let element: T | null | undefined;
    for (const elem of this.#iterable) {
      if (
        isUndefined(element) ||
        isNull(element) ||
        comparator.compare(elem, element) > 0
      ) {
        element = elem;
      }
    }

    // stream was empty
    if (isUndefined(element)) {
      return Optional.empty();
    }

    if (isNull(element)) {
      throw new NullPointerException();
    }

    return Optional.of(element);
  }

  @IsNotClosed
  @AutoClose
  public min(comparator: Comparator<T>): Optional<T> {
    let element: T | null | undefined;
    for (const elem of this.#iterable) {
      if (
        isUndefined(element) ||
        isNull(element) ||
        comparator.compare(elem, element) < 0
      ) {
        element = elem;
      }
    }

    // stream was empty
    if (isUndefined(element)) {
      return Optional.empty();
    }

    if (isNull(element)) {
      throw new NullPointerException();
    }

    return Optional.of(element);
  }

  @IsNotClosed
  @AutoClose
  public noneMatch(predicate: (value: T) => boolean): boolean {
    for (const elem of this.#iterable) {
      if (predicate(elem)) {
        return false;
      }
    }

    return true;
  }

  public peek(action: (value: T) => void): Stream<T> {
    return new Stream.#Impl<T>(
      {
        next: () => {
          for (const elem of this.#iterable) {
            action(elem);
            return { value: elem, done: false };
          }

          return { value: undefined, done: true };
        },
      },
      // just executing a function on each value before passing it down does not alter the total elements
      this.expectedStreamSize
    );
  }

  public reduce(accumulator: BinaryOperator<T>): Optional<T>;
  public reduce(identity: T, accumulator: BinaryOperator<T>): T;
  public reduce<U>(identity: U, accumulator: BiFunction<U, T, U>): U;
  @IsNotClosed
  @AutoClose
  public reduce<U>(
    identityOrAccumulator: T | U | BinaryOperator<T>,
    accumulator?: BinaryOperator<T> | BiFunction<U, T, U>
  ): Optional<T> | T | U {
    if (isFunction(identityOrAccumulator)) {
      let result: T | null | undefined;
      for (const element of this.#iterable) {
        if (isNone(result)) {
          result = element;
          continue;
        }

        result = identityOrAccumulator(result, element);
      }

      // stream was empty
      if (isUndefined(result)) {
        return Optional.empty();
      }

      if (isNull(result)) {
        throw new NullPointerException();
      }

      return Optional.of(result);
    }

    if (isFunction(accumulator)) {
      let result: T | U = identityOrAccumulator;

      for (const element of this.#iterable) {
        // we need to assume that the user has provided the correct accumulator function to handle the result
        result = accumulator(result as T & U, element);
      }

      return result;
    }

    throw new IllegalStateException('Improper arguments provided.');
  }

  public skip(n: number): Stream<T> {
    if (Number.isNaN(n) || !Number.isInteger(n) || n < 0) {
      throw new TypeError('n must be a positive integer');
    }

    let skipped = 0;
    return new Stream.#Impl<T>(
      {
        next: () => {
          // when first executed, iterate over as many elements without using them as told
          while (skipped < n) {
            this.#iterator.next();
            skipped++;
          }

          // continue iterating as usual
          for (const elem of this.#iterable) {
            return { value: elem, done: false };
          }

          return { value: undefined, done: true };
        },
      },
      // assume that there will be n elements fewer than before
      this.expectedStreamSize - n
    );
  }

  public sorted(): Stream<T>;
  public sorted(comparator: Comparator<T>): Stream<T>;
  public sorted(
    // @ts-expect-error - T might not be sortable by natural order but the comparator will throw an error, which is expected
    comparator: Comparator<T> = Comparator.naturalOrder()
  ): Stream<T> {
    // the iterator that will hold all elements in sorted order once the terminal operation has been executed.
    let sortedIterator: Iterable<T>;

    return new Stream.#Impl<T>(
      {
        next: () => {
          // only sort all elements when the terminal operation has been executed
          if (isUndefined(sortedIterator)) {
            const sorted = Array.from(this.#iterable).sort(comparator.compare);
            sortedIterator = sorted[Symbol.iterator]();
          }

          for (const elem of sortedIterator) {
            return { value: elem, done: false };
          }

          return { value: undefined, done: true };
        },
      },
      // we only sort but not modify the elements in the stream
      this.expectedStreamSize
    );
  }

  @IsNotClosed
  @AutoClose
  public toArray(): T[] {
    const array = new Array(this.expectedStreamSize);
    let idx = 0;

    for (const elem of this.#iterable) {
      array[idx] = elem;
      idx++;
    }

    // trim potentially too long array
    array.length = idx;

    return array;
  }
}
