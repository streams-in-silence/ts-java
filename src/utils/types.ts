import { Comparable } from '../comparable';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export type CompareFunction<T> = (a: T, b: T) => number;

export type ComparableValue =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Comparable<any> | number | string | boolean | Date;

export type ComparableKeyOf<T> = {
  [K in keyof T]: T[K] extends ComparableValue ? K : never;
}[keyof T];

export type ComparableProps<T> = {
  [K in ComparableKeyOf<T>]: T[K];
};

export type ComparableValueExtractor<T> = (object: T) => ComparableValue;
