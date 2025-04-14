import { Comparator } from '@ts-java/comparator';
import { Optional } from '@ts-java/optional';
import type { BaseStream } from './base.stream';

import { IllegalStateException } from '@ts-java/common/exception/illegal-state';
import { isNull, isUndefined } from '@ts-java/common/typeguards';
import { AutoClose } from './decorators/auto-close';
import { IsNotClosed } from './decorators/is-not-closed';

export abstract class Stream<T> implements BaseStream<T, Stream<T>> {
  public static concat<T>(a: Stream<T>, b: Stream<T>): Stream<T> {
    const aIterator = a.iterator();
    const bIterator = b.iterator();

    return new Stream.#Impl<T>({
      next() {
        const next = aIterator.next();

        if (!next.done) {
          return next;
        }

        return bIterator.next();
      },
    });
  }

  public static empty<T>(): Stream<T> {
    return new Stream.#Impl<T>({
      next() {
        return { done: true, value: undefined };
      },
    });
  }

  public static generate<T>(supplier: () => T): Stream<T> {
    return new Stream.#Impl<T>({
      next() {
        return { done: false, value: supplier() };
      },
    });
  }

  public static iterate<T>(seed: T, f: (value: T) => T): Stream<T> {
    let lastValue: T;

    return new Stream.#Impl<T>({
      next() {
        if (isUndefined(lastValue)) {
          lastValue = seed;
        } else {
          lastValue = f(lastValue);
        }

        return { done: false, value: lastValue };
      },
    });
  }

  public static of<T>(element: T): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T> {
    return new Stream.#Impl<T>(elements[Symbol.iterator]());
  }

  public static ofArray<T>(element: T[]): Stream<T> {
    return new Stream.#Impl<T>(element[Symbol.iterator]());
  }

  readonly #iterator: Iterator<T>;
  readonly #iterable: Iterable<T>;

  /**
   * Internal indicator if a stream has been consumed.
   */
  private isClosed: boolean;

  /**
   * A list of all provided closeHandlers.
   */
  private closeHandlers: Array<() => void>;

  protected constructor(iterator: Iterator<T>) {
    this.#iterator = iterator;

    this.#iterable = {
      [Symbol.iterator]: () => iterator,
    };

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
    constructor(iterator: Iterator<T>) {
      super(iterator);
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
    let allMatch = true;

    for (const value of this.#iterable) {
      if (!predicate(value)) {
        allMatch = false;
        break;
      }
    }

    return allMatch;
  }

  @IsNotClosed
  @AutoClose
  public anyMatch(predicate: (value: T) => boolean): boolean {
    let found = false;

    for (const value of this.#iterable) {
      if (predicate(value)) {
        found = true;
        break;
      }
    }

    return found;
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

    return new Stream.#Impl<R>({
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
          mappedIterator = mappedStream.iterator();
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
    });
  }

  // @todo: replace => Stream<number> with NumberStream
  public flatMapToNumber(mapper: (value: T) => Stream<number>): Stream<number> {
    throw new Error('Method not implemented.');
  }

  @IsNotClosed
  @AutoClose
  public forEach(action: (value: T) => void): void {
    if (this.isClosed) {
      throw new IllegalStateException('Stream was already closed.');
    }

    for (const elem of this.#iterable) {
      action(elem);
    }
  }

  public forEachOrdered(action: (value: T) => void): void {
    throw new Error('Method not implemented.');
  }

  public limit(maxSize: number): Stream<T> {
    if (Number.isNaN(maxSize) || !Number.isInteger(maxSize) || maxSize < 0) {
      throw new TypeError('maxSize must be a positive integer');
    }

    let passedElements = 0;
    return new Stream.#Impl({
      next: () => {
        if (passedElements >= maxSize) {
          return { done: true, value: undefined };
        }
        passedElements++;
        return this.#iterator.next();
      },
    });
  }

  public map<U>(mapper: (element: T) => U): Stream<U> {
    return new Stream.#Impl<U>({
      next: () => {
        for (const elem of this.#iterable) {
          return { value: mapper(elem), done: false };
        }

        return { value: undefined, done: true };
      },
    });
  }

  // @todo: replace Stream<number> with NumberString
  public mapToNumber(mapper: (value: T) => number): Stream<number> {
    throw new Error('Method not implemented.');
  }

  public max(comparator: Comparator<T>): Optional<T> {
    throw new Error('Method not implemented.');
  }

  public min(comparator: Comparator<T>): Optional<T> {
    throw new Error('Method not implemented.');
  }

  public noneMatch(predicate: (value: T) => boolean): boolean {
    throw new Error('Method not implemented.');
  }

  public peek(action: (value: T) => void): Stream<T> {
    return new Stream.#Impl<T>({
      next: () => {
        for (const elem of this.#iterable) {
          action(elem);
          return { value: elem, done: false };
        }

        return { value: undefined, done: true };
      },
    });
  }

  public reduce(accumulator: (value: T) => T): Optional<T>;
  public reduce(identity: T, accumulator: (value: T) => T): T;
  public reduce<U>(
    identity: U,
    accumulator: (identity: U, value: T) => U,
    combiner: (value: U) => U
  ): U;
  public reduce<U>(...args: unknown[]): Optional<T> | T | U {
    throw new Error('Method not implemented.');
  }

  public skip(n: number): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public sorted(): Stream<T>;
  public sorted(comparator: Comparator<T>): Stream<T>;
  public sorted(comparator?: Comparator<T>): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public toArray(): T[];
  public toArray<A>(generator: (number: number) => A[]): A[];
  public toArray<A>(generator?: (number: number) => A[]): T[] | A[] {
    throw new Error('Method not implemented.');
  }
}
