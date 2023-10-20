import { NoSuchElementException, NullPointerException } from './exceptions';
import { isEqual, isNotFunction, isNotNull, isNull } from './utils';

export interface Optional<T> {
  equals(other: unknown): boolean;
  filter(filter: (value: T) => boolean): Optional<T>;
  flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U>;
  get(): T;
  ifPresent(action: (value: T) => void): void;
  isPresent(): this is Optional<NonNullable<T>>;
  map<U>(mapper: (value: T) => U): Optional<U>;
  or(supplier: () => Optional<T>): Optional<T>;
  orElse(other: T): T;
  orElseGet(supplier: () => T): T;
  orElseThrow(exceptionSupplier: () => Error): T;
}

export class Optional<T> implements Optional<T> {
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
    if (isNotFunction(filter)) {
      throw new NullPointerException();
    }

    if (isNull(this.#value) || !filter(this.#value)) {
      return Optional.empty();
    }

    return Optional.of(this.#value);
  }

  public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (isNull(this.#value)) {
      return Optional.empty();
    }

    if (isNotFunction(mapper)) {
      throw new NullPointerException();
    }

    return mapper(this.#value);
  }

  public get(): T {
    if (isNull(this.#value)) {
      throw new NoSuchElementException();
    }
    return this.#value;
  }

  public ifPresent(action: (value: T) => void): void {
    if (isNull(this.#value)) {
      return;
    }

    if (isNotFunction(action)) {
      throw new NullPointerException();
    }

    action(this.#value);
  }

  public isPresent(): this is Optional<NonNullable<T>> {
    return isNotNull(this.#value);
  }

  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (isNull(this.#value)) {
      return Optional.empty();
    }

    if (isNotFunction(mapper)) {
      throw new NullPointerException();
    }

    return Optional.of(mapper(this.#value));
  }

  public or(supplier: () => Optional<T>): Optional<T> {
    if (isNotNull(this.#value)) {
      return Optional.of(this.#value);
    }

    if (isNotFunction(supplier)) {
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
    if (isNotNull(this.#value)) {
      return this.#value;
    }

    if (isNotFunction(supplier)) {
      throw new NullPointerException();
    }

    return supplier();
  }

  public orElseThrow(exceptionSupplier: () => Error): T {
    if (isNotNull(this.#value)) {
      return this.#value;
    }
    if (isNotFunction(exceptionSupplier)) {
      throw new NullPointerException();
    }
    
    throw exceptionSupplier();
  }

  public toString(): string {
    return `Optional[${JSON.stringify(this)}]`;
  }
}
