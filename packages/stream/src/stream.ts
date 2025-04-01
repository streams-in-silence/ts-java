import { Comparator } from '@ts-java/comparator';
import type { Optional } from '@ts-java/optional';
import type { BaseStream } from './base.stream';

export abstract class Stream<T> implements BaseStream<T, Stream<T>> {
  public static concat<T>(a: Stream<T>, b: Stream<T>): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public static empty<T>(): Stream<T> {
    return new Stream.#Impl<T>({
      next() {
        return { done: true, value: undefined };
      },
    });
  }

  public static generate<T>(supplier: () => T): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public static iterate<T>(seed: T, f: (value: T) => T): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public static of<T>(elements: T): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T> {
    return new Stream.#Impl<T>(elements[Symbol.iterator]());
  }

  public static ofArray<T>(element: T[]): Stream<T> {
    return new Stream.#Impl<T>(element[Symbol.iterator]());
  }

  readonly #iterator: Iterator<T>;
  readonly #iterable: Iterable<T>;

  protected constructor(iterator: Iterator<T>) {
    this.#iterator = iterator;

    this.#iterable = {
      [Symbol.iterator]: () => iterator,
    };
  }

  public close(): void {
    // the base stream doesn't need to be closed
  }

  public iterator(): Iterator<T> {
    return this.#iterator;
  }

  public onClose(/*closeHandler: () => void*/): Stream<T> {
    throw new Error('Method not implemented.');
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

  public allMatch(predicate: (value: T) => boolean): boolean {
    throw new Error('Method not implemented.');
  }

  public anyMatch(predicate: (value: T) => boolean): boolean {
    throw new Error('Method not implemented.');
  }

  // @todo: add Collector class/interface
  public collect(collector: unknown): never {
    throw new Error('Method not implemented.');
  }

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
    const iterable = this.#iterable;

    function* filterIterator() {
      for (const value of iterable) {
        if (predicate(value)) {
          yield value;
        }
      }
    }

    return new Stream.#Impl<T>(filterIterator());
  }

  public findAny(): Optional<T> {
    throw new Error('Method not implemented.');
  }

  public findFirst(): Optional<T> {
    throw new Error('Method not implemented.');
  }

  public flatMap<R>(mapper: (value: T) => Stream<R>): Stream<R> {
    throw new Error('Method not implemented.');
  }

  // @todo: replace => Stream<number> with NumberStream
  public flatMapToNumber(mapper: (value: T) => Stream<number>): Stream<number> {
    throw new Error('Method not implemented.');
  }

  public forEach(action: (value: T) => void): void {
    for (const elem of this.#iterable) {
      action(elem);
    }
  }

  public forEachOrdered(action: (value: T) => void): void {
    throw new Error('Method not implemented.');
  }

  public limit(maxSize: number): Stream<T> {
    throw new Error('Method not implemented.');
  }

  public map<U>(mapper: (element: T) => U): Stream<U> {
    return new Stream.#Impl<U>({
      next: () => {
        const next = this.#iterator.next();
        if (!next.done) {
          return { value: mapper(next.value), done: false };
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
    throw new Error('Method not implemented.');
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
