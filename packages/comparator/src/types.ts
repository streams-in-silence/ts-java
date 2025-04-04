/**
 * This interface imposes a total ordering on the objects of each class that implements it.
 * This ordering is referred to as the class's natural ordering, and the object's compareTo method is referred to as
 * its natural comparison method.
 */
export interface Comparable<T> {
  /**
   * Compares this object with the specified object for order.
   * @param other the object to be compared.
   * @returs a negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object.
   */
  compareTo(other: T): number;
}

export type CompareFunction<T> = (a: T, b: T) => number;

/**
 * All possible values that can be compared by default.
 * @see {@link Comparable}
 */
export type ComparableValue =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Comparable<any> | number | string | boolean | Date;

/**
 * All possible keys that can be compared used by the keyExtractor.
 */
export type ComparableKeyOf<T> = {
  [K in keyof T]: T[K] extends ComparableValue ? K : never;
}[keyof T];

/**
 * All possible values that can be returned by the keyExtractor.
 */
export type ComparableValueOf<T> = T[ComparableKeyOf<T>];

/**
 * A function that extracts a comparable value from an object.
 */
export type ComparableKeyExtractor<T, U extends ComparableValueOf<T>> = (
  object: Pick<T, ComparableKeyOf<T>>
) => ComparableValue & U;
