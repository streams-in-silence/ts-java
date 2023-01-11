export interface Optional<T> {
  equals(other: unknown): boolean;
  filter(filter: (value: T) => boolean): Optional<T>;
  flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U>;
  get(): T;
  ifPresent(consumer: (value: T) => void): void;
  isPresent(): boolean;
  map<U>(mapper: (value: T) => U): Optional<U>;
  orElse(other: T): T;
  orElseGet(other: () => T): T;
  orElseThrow(exceptionSupplier: () => Error): T;
  toString(): string;
}
