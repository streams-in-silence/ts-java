import { NoSuchElementException } from './exceptions';
import { type Optional as IOptional } from './types';
import { isEqual, isNull } from './utils';

export class Optional<T> implements IOptional<T> {
  private readonly value: T | null;

  protected constructor(value?: T) {
    this.value = value ?? null;
  }

  public static empty<T>(): Optional<T> {
    return new Optional<T>();
  }

  public static of<T>(value: T): Optional<T> {
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
    if (isNull(this.value) || !filter(this.value)) {
      return Optional.empty();
    }
    return this;
  }

  public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (isNull(this.value)) {
      return Optional.empty();
    }

    return mapper(this.value);
  }

  public get(): T {
    if (isNull(this.value)) {
      throw new NoSuchElementException();
    }
    return this.value;
  }

  public ifPresent(consumer: (value: T) => void): void {
    if (isNull(this.value)) {
      return;
    }

    consumer(this.value);
  }

  public isPresent(): boolean {
    return !isNull(this.value);
  }

  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (isNull(this.value)) {
      return Optional.empty();
    }
    return Optional.of(mapper(this.value));
  }

  public orElse(other: T): T {
    return this.value || other;
  }

  public orElseGet(other: () => T): T {
    return this.value || other();
  }

  public orElseThrow(exceptionSupplier: () => Error): T {
    if (isNull(this.value)) {
      throw exceptionSupplier();
    }
    return this.value;
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}

const o = Optional.of('');
o.toString();
