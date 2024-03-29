import { NoSuchElementException, NullPointerException } from '@sis/common';
import { isNone, isNotFunction, isNotNull } from '@sis/typeguards';
import { isEqual } from '@sis/utils';

export class Optional<T> {
  readonly #value: T | null;

  private constructor(value?: T) {
    this.#value = value ?? null;
  }

  public static empty<T = null>(): Optional<T> {
    return new Optional<T>();
  }

  public static of<T>(value: T): Optional<T> {
    if (isNone(value)) {
      throw new NullPointerException('value must not be null');
    }
    return new Optional<T>(value);
  }

  public static ofNullable<T>(value: T | null): Optional<T> {
    if (isNone(value)) {
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
    return isEqual(this.get(), other.get());
  }

  public filter(filter: (value: T) => boolean): Optional<T> {
    if (isNotFunction(filter)) {
      throw new NullPointerException('filter must be a function');
    }

    if (isNone(this.#value) || !filter(this.#value)) {
      return Optional.empty();
    }

    return Optional.of(this.#value);
  }

  public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (isNone(this.#value)) {
      return Optional.empty();
    }

    if (isNotFunction(mapper)) {
      throw new NullPointerException('mapper must be a function');
    }

    const optional = mapper(this.#value);

    if (!(optional instanceof Optional)) {
      throw new NullPointerException('mapper must return an Optional');
    }

    return optional;
  }

  public get(): T {
    if (isNone(this.#value)) {
      throw new NoSuchElementException();
    }
    return this.#value;
  }

  public ifPresent(action: (value: T) => void): void {
    if (isNone(this.#value)) {
      return;
    }

    if (isNotFunction(action)) {
      throw new NullPointerException('action must be a function');
    }

    action(this.#value);
  }

  public isPresent(): this is Optional<NonNullable<T>> {
    return isNotNull(this.#value);
  }

  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (isNone(this.#value)) {
      return Optional.empty();
    }

    if (isNotFunction(mapper)) {
      throw new NullPointerException('mapper must be a function');
    }

    return Optional.of(mapper(this.#value));
  }

  public or(supplier: () => Optional<T>): Optional<T> {
    if (isNotNull(this.#value)) {
      return Optional.of(this.#value);
    }

    if (isNotFunction(supplier)) {
      throw new NullPointerException('supplier must be a function');
    }

    const optional = supplier();

    if (!(optional instanceof Optional)) {
      throw new NullPointerException('supplier must return an Optional');
    }

    return optional;
  }

  public orElse(other: T): T {
    return this.#value ?? other;
  }

  public orElseGet(supplier: () => T): T {
    if (isNotNull(this.#value)) {
      return this.#value;
    }

    if (isNotFunction(supplier)) {
      throw new NullPointerException('supplier must be a function');
    }

    return supplier();
  }

  public orElseThrow(exceptionSupplier: () => Error): T {
    if (isNotNull(this.#value)) {
      return this.#value;
    }

    if (isNotFunction(exceptionSupplier)) {
      throw new NullPointerException('exceptionSupplier must be a function');
    }

    throw exceptionSupplier();
  }

  public toString(): string {
    if (this.isPresent()) {
      return `Optional[${this.get()}]`;
    }
    return `Optional[null]`;
  }
}
