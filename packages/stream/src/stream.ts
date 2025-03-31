import type { BaseStream } from './base.stream';

export abstract class Stream<T> implements BaseStream<T, Stream<T>> {
  public static of<T>(elements: T): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T>;
  public static of<T>(...elements: T[]): Stream<T> {
    return new Stream.#Impl<T>(elements[Symbol.iterator]());
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

  public count(): number {
    let count = 0;

    while (!this.#iterator.next().done) {
      count++;
    }

    return count;
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

  public forEach(callback: (value: T) => void): void {
    for (const elem of this.#iterable) {
      callback(elem);
    }
  }

  public map<U>(mapper: (element: T) => U): Stream<U> {
    const iterable = this.#iterable;

    function* mapIterator() {
      for (const value of iterable) {
        yield mapper(value);
      }
    }

    return new Stream.#Impl<U>(mapIterator());
  }
}
