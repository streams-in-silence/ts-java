import { isArray } from '@ts-java/common/typeguards';
export abstract class Stream<T> {
  public static of<U>(elements: U[]): Stream<U>;
  public static of<T>(element: T): Stream<T>;
  public static of<T, U>(elements: T | U[]): Stream<T> | Stream<U> {
    if (isArray(elements)) {
      return new Stream.#Impl(elements[Symbol.iterator]());
    }

    return new Stream.#Impl(
      (function* iterator() {
        yield elements;
      })()
    );
  }

  readonly #iterator: Iterator<T>;

  protected constructor(iterator: Iterator<T>) {
    this.#iterator = iterator;
  }

  static readonly #Impl = class StreamImpl<T> extends Stream<T> {
    constructor(iterator: Iterator<T>) {
      super(iterator);
    }
  };

  public count(): number {
    let count = 0;

    let next = this.#iterator.next();

    while (!next.done) {
      count++;
      next = this.#iterator.next();
    }

    return count;
  }

  public filter(predicate: (value: T) => boolean): Stream<T> {
    const iterator = this.#iterator;
    function* filterIterator() {
      let next = iterator.next();

      while (!next.done) {
        if (predicate(next.value)) {
          yield next.value;
        }
        next = iterator.next();
      }
    }

    return new Stream.#Impl<T>(filterIterator());
  }
}
