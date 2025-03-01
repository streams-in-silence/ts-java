import { NoSuchElementException } from '@ts-java/common/exception/no-such-element';
import { NullPointerException } from '@ts-java/common/exception/null-pointer';
import { isNone, isNotFunction, isNotNull } from '@ts-java/common/typeguards';
import { isEqual } from '@ts-java/common/utils/is-equal';

/**
 * @typedef {(value: T) => boolean} Predicate
 */

/**
 * A container object wich may or may not contain a non-null value.
 * @template T the type of the value, if present.
 */
export class Optional<T> {
  /**
   * Creates a new Optional that has no value.
   *
   * @returns a new `Optional<T>`.
   * @template T the type of the value, if present. Defaults to `null`.
   */
  public static empty<T = null>(): Optional<T> {
    return new Optional();
  }

  /**
   * Creates a new non-empty Optional.
   *
   * @param {T} value the value of the Optional
   * @returns a new non-empty `Optional<T>` with the provided value.
   * @throws a {@link NullPointerException} if the provided value is `null` or `undefined`.
   * @template T the type of the value.
   */
  public static of<T>(value: T): Optional<T> {
    if (isNone(value)) {
      throw new NullPointerException('value must not be null');
    }
    return new Optional(value);
  }

  /**
   * Creates a new Optional with the value, if non-null, otherwise an empty Optional.
   *
   * @param {T} value the value of the Optional.
   * @returns a new `Optional<T|null>`
   * @template T the type of the value, if present. Defaults to `null`.
   */
  public static ofNullable<T>(value: T | null): Optional<T | null> {
    if (isNone(value)) {
      return Optional.empty();
    }
    return Optional.of(value);
  }

  /**
   * The actual value of the Optional.
   */
  readonly #value: T | null;

  private constructor(value?: T) {
    this.#value = value ?? null;
  }

  /**
   * Indicates whether some object is equal to this Optional.
   * It is considered equal if
   * - it is also an `Optional`
   * - both instances have no value, or
   * - the present values are equal to each other
   *
   * @param {unknown} other the object to compare this Optional to
   * @returns `true` if the other object is equal to this Optional otherwise `false`
   */
  public equals(other: unknown): boolean {
    if (!(other instanceof Optional)) {
      return false;
    }

    if (this.isEmpty() && other.isEmpty()) {
      return true;
    }

    if (
      (this.isPresent() && other.isEmpty()) ||
      (this.isEmpty() && other.isPresent())
    ) {
      return false;
    }

    return isEqual(this.get(), other.get());
  }

  /**
   * Applies a filter on the value of the optional.
   * If the value is present and passes the provided filter check, a new Optional with
   * the value is returned. Otherwise, an empty Optional will be returned.
   *
   * @param filter a function to check if the value matches the desired outcome or not
   * @returns a new `Optional<T>` with the value or an empty `Optional<T>` if the value does not match the filter
   * @throws a {@link NullPointerException} if the provided `filter` is not a function
   */
  public filter(filter: (value: T) => boolean): Optional<T> {
    if (isNotFunction(filter)) {
      throw new NullPointerException('filter must be a function');
    }

    if (isNone(this.#value) || !filter(this.#value)) {
      return Optional.empty();
    }

    return Optional.of(this.#value);
  }

  /**
   * Applies the provided mapping function on the value of the optional.
   * If the value is present, the outcome of the mapping function will be returned.
   * Otherwise, an empty Optional will be returned.
   *
   * @param mapper a function that takes in the value of type `T` and returns a new `Optional<U>`.
   * @returns a new Optional of type `T` with
   * @throws a {@link NullPointerException} if value is present and the provided `mapper` is not a function
   * @template U the type of the new Optional
   */
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

  /**
   * If the value is present in this Optional, returns the value.
   * Otherwise, a {@link NoSuchElementException} is thrown.
   *
   * @returns the non-null value of this Optional
   * @throws a {@link NoSuchElementException} if the value is absent.
   * @template T
   * @see {@link Optional.isPresent}
   */
  public get(): NonNullable<T> {
    if (isNone(this.#value)) {
      throw new NoSuchElementException();
    }
    return this.#value as NonNullable<T>;
  }

  /**
   * If a value is present, the provided action will be invoked with the value.
   * Otherwise, nothing is done.
   *
   * @param action the method to be invoked if a value is present.
   * @throws a {@link NullPointerException} if the provided `action` is not a function
   */
  public ifPresent(action: (value: T) => void): void {
    if (isNone(this.#value)) {
      return;
    }

    if (isNotFunction(action)) {
      throw new NullPointerException('action must be a function');
    }

    action(this.#value);
  }

  /**
   * Indicates the absence of a value.
   *
   * @returns `true` if the value is absent, `false` otherwise
   */
  public isEmpty(): boolean {
    return isNone(this.#value);
  }

  /**
   * Indicates the presence of a non-null value.
   *
   * @returns `true` if the value is present, `false` otherwise
   */
  public isPresent(): this is Optional<NonNullable<T>> {
    return isNotNull(this.#value);
  }

  /**
   * Applies the provided mapping function on the value of the optional.
   * If the value is present, the outcome of the mapping function will be wrapped in a new Optional.
   * Otherwise, an empty Optional will be returned.
   *
   * @param mapper a function that takes in the value of type `T` and returns a new value of type `U`.
   * @returns a new Optional of type `T` with
   * @throws a {@link NullPointerException} if value is present and the provided `mapper` is not a function
   * @template U the type of the new value
   */
  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (isNone(this.#value)) {
      return Optional.empty();
    }

    if (isNotFunction(mapper)) {
      throw new NullPointerException('mapper must be a function');
    }

    return Optional.of(mapper(this.#value));
  }

  /**
   * If a value is present, a new `Optional<T>` with the value is returned.
   * Otherwise, the provided `supplier` is invoked to return another `Optional<T>`.
   *
   * @param supplier the function to invoke if the value is empty that will provide a new `Optional<T>`.
   * @returns a new `Optional<T>` containing the value of this Optional or the `Optional<T>` of the `supplier`.
   * @throws a {@link NullPointerException} if the value is not present and the provided `supplier` is not a function
   * or the `supplier` returns a null result
   */
  public or(supplier: () => Optional<T>): Optional<T> {
    if (isNotNull(this.#value)) {
      return Optional.of(this.#value);
    }

    if (isNotFunction(supplier)) {
      throw new NullPointerException('supplier must be a function');
    }

    const optional = supplier();

    if (!(optional instanceof Optional) || optional.isEmpty()) {
      throw new NullPointerException(
        'supplier must return a non-null Optional'
      );
    }

    return optional;
  }

  /**
   * If a value is present, it will be returned.
   * Otherwise, the provided value will be returned instead.
   *
   * @param other the value that should be returned if this Optional is empty.
   * @returns the value or the fallback if the value is not present.
   */
  public orElse(other: T): T {
    return this.#value ?? other;
  }

  /**
   * If a value is present, it will be returned.
   * Otherwise, the provided `supplier` will be invoked to get the value that is returned
   * as fallback.
   *
   * @param supplier a function that returns the value that should be returned if this Optional is empty.
   * @returns the value or the return value of the `supplier` if the value is not present.
   * @throws a {@link NullPointerException} if the value is not present and the provided `supplier` is not a function
   */
  public orElseGet(supplier: () => T): T {
    if (isNotNull(this.#value)) {
      return this.#value;
    }

    if (isNotFunction(supplier)) {
      throw new NullPointerException('supplier must be a function');
    }

    return supplier();
  }

  /**
   * If a value is present, it will be returned.
   * Otherwise, the provided `exceptionSupplier` will be invoked to get the Error that should be thrown.
   *
   * @param supplier a function that returns the Error that should be thrown if this Optional is empty.
   * @returns the value or throws the Error of the `exceptionSupplier` if the value is not present.
   * @throws a {@link NullPointerException} if the value is not present and the provided `exceptionSupplier` is not a function
   */
  public orElseThrow(exceptionSupplier: () => Error): T {
    if (isNotNull(this.#value)) {
      return this.#value;
    }

    if (isNotFunction(exceptionSupplier)) {
      throw new NullPointerException('exceptionSupplier must be a function');
    }

    throw exceptionSupplier();
  }

  /**
   * Returns a string representation of this Optional. The exact format depends on the value it holds.
   *
   * @returns a string representation of this Optional and it's value
   */
  public toString(): string {
    if (this.isPresent()) {
      return `Optional[${this.get()}]`;
    }
    return `Optional[null]`;
  }
}
