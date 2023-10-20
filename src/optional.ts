import { NoSuchElementException, NullPointerException } from './exceptions';
import { type Optional as IOptional } from './types';
import { isEqual, isFunction, isNull } from './utils';

export class Optional<T> implements IOptional<T> {
  readonly #value: T | null;

  private constructor(value?: T) {
    this.#value = value ?? null;
  }

  public static empty<T = null>(): Optional<T> {
    return new Optional<T>();
  }

  public static of<T>(value: T): Optional<T> {
    if (isNull(value)) {
      throw new NullPointerException();
    }
    return new Optional<T>(value);
  }

  public static ofNullable<T>(value: T | null): Optional<T> {
    if (isNull(value)) {
      return Optional.empty();
    }
    return Optional.of(value);
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Optional)) {
      return false;
    }
    if (
      (this.isPresent() && !other.isPresent()) ||
      (!this.isPresent() && other.isPresent())
    ) {
      return false;
    }
    return isEqual(other.get(), this.get());
  }

  public filter(filter: (value: T) => boolean): Optional<T> {
    if (isNull(this.#value) || !filter(this.#value)) {
      return Optional.empty();
    }
    return Optional.of(this.#value);
  }

  public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (isNull(this.#value)) {
      return Optional.empty();
    }

    return mapper(this.#value);
  }

  public get(): T {
    if (isNull(this.#value)) {
      throw new NoSuchElementException();
    }
    return this.#value;
  }

  public ifPresent(consumer: (value: T) => void): void {
    if (isNull(this.#value)) {
      return;
    }

    consumer(this.#value);
  }

  public isPresent(): this is Optional<NonNullable<T>> {
    return !isNull(this.#value);
  }

  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (isNull(this.#value)) {
      return Optional.empty();
    }

    return Optional.of(mapper(this.#value));
  }

  public or(supplier: () => Optional<T>): Optional<T> {
    if (!isNull(this.#value)) {
      return Optional.of(this.#value);
    }

    if (!isFunction(supplier)) {
      throw new NullPointerException();
    }

    const optional = supplier();

    if (!(optional instanceof Optional)) {
      throw new NullPointerException();
    }

    return optional;
  }

  public orElse(other: T): T {
    return this.#value ?? other;
  }

  public orElseGet(supplier: () => T): T {
    return this.#value ?? supplier();
  }

  public orElseThrow(exceptionSupplier: () => Error): T {
    if (isNull(this.#value)) {
      throw exceptionSupplier();
    }
    return this.#value;
  }

  public toString(): string {
    return `Optional[${JSON.stringify(this)}]`;
  }
}
