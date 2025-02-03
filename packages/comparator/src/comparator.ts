import { NullPointerException } from '@ts-java/common/exception/null-pointer';
import {
  isBoolean,
  isDate,
  isNull,
  isNumber,
  isPresent,
  isString,
  isUndefined,
} from '@ts-java/common/typeguards';
import { isComparable, isSameType } from './typeguards';
import type {
  ComparableKeyExtractor,
  ComparableKeyOf,
  ComparableValueOf
} from './types';

/**
 * A JavaScript implementation of the Java Comparator interface. Due to the lack of Functional Interfaces in JavaScript,
 * this has to be implemented as an abstract class.
 * The class has a single abstract method, compare, that must be implemented by the user.
 * In addition to that, it also has a number of static methods that can be used to create new comparators.
 * 
 * For more information, see the Java documentation.
 * @see https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html
 */
export abstract class Comparator<T> {

  /** 
   * Accepts a function that extracts a comparable value from type T and returns a new Comparator that compares objects by that value in natural order.
   * @param keyExtractor a function that extracts a comparable value from type T.
   * @returns a new Comparator that compares objects by the value extracted by the keyExtractor function in natural order.
   */
  public static comparing<T, U extends ComparableValueOf<T>>(
    keyExtractor: ComparableKeyExtractor<T,U>
  ): Comparator<T>;
  /**
   * Accepts a function that extracts a comparable value from type T and a Comparator that compares objects by that value.
   * Uses the given Comparator to compare the extracted values.
   * @param keyExtractor a function that extracts a comparable value from type T.
   * @param keyComparator a Comparator that compares the objects by the value extracted by the keyExtractor function.
   * @returns a new Comparator that compares objects by the value extracted by the keyExtractor function using the given Comparator.
   */
  public static comparing<T, U extends ComparableValueOf<T>>(keyExtractor: ComparableKeyExtractor<T,U>, keyComparator: Comparator<U>): Comparator<T>;
  public static comparing<T, U extends ComparableValueOf<T>>(keyExtractor: ComparableKeyExtractor<T,U>, keyComparator?: Comparator<U>): Comparator<T> {
    return new Comparator.#Impl((a, b) => {
      const valueOfA = keyExtractor(a);
      const valueOfB = keyExtractor(b);

      if(isUndefined(keyComparator)) {
        return Comparator.naturalOrder().compare(
          valueOfA,
          valueOfB
         );  
      }

      return keyComparator.compare(
        valueOfA,
        valueOfB
      );
    });
  }

  /**
   * Returns a Comparator that compares {@link ComparableValue Comparable} objects by their natural order.
   * @returns a new Comparator that compares objects by their natural order.
   * @throws a {@link NullPointerException} if either of the objects is null.
   * @throws an Error if the objects are not of the same type or are not comparable by natural order.
   * 
   * @example
   * ```typescript
   * const numbers = [1,5,3,2,4];
   * numbers.toSorted(Comparator.naturalOrder().compare); // [1,2,3,4,5]
   * ```
   */
  public static naturalOrder<T>(): Comparator<T> {
    return new Comparator.#Impl((a, b) => {
      if (isNull(a) || isNull(b)) {
        throw new NullPointerException();
      }

      if (!isSameType(a, b) || !isSameType(b, a)) {
        throw new Error('Cannot compare objects of different types');
      }

      if (isString(a) && isString(b)) {
        return a.localeCompare(b);
      }
      if (isNumber(a) && isNumber(b)) {
        return a - b;
      }
      if (isBoolean(a) && isBoolean(b)) {
        return Number(b) - Number(a);
      }
      if (isDate(a) && isDate(b)) {
        return a.getTime() - b.getTime();
      }
      if (isComparable(a) && isComparable(b)) {
        return a.compareTo(b);
      }

      throw new Error('Objects must be comparable by natural order');
    });
  }

  /**
   * Returns a Comparator that compares {@link ComparableValue Comparable} objects by their reverse order.
   * @returns a new Comparator that compares objects by their reverse order.
   * @see {@link Comparator.naturalOrder}
   * @example
   * ```typescript
   * const numbers = [1,5,3,2,4];
   * numbers.toSorted(Comparator.reverseOrder().compare); // [5,4,3,2,1]
   * ```
   */
  public static reverseOrder<T>(): Comparator<T> {
    return Comparator.naturalOrder<T>().reversed();
  }

  /**
   * A null-friendly comparator that compares objects using the given Comparator, putting null values first.
   * @param comparator the comparator that will be used to compare the objects.
   * @returns a new Comparator that compares objects using the given Comparator, with nulls first.
   * @example
   * ```typescript
   * const numbers = [1,5,3,2,4,null];
   * numbers.toSorted(
   *  Comparator.nullFirst(
   *    Comparator.naturalOrder()
   *  ).compare
   * ); // [null,1,2,3,4,5]
   * ```
   */
  public static nullFirst<U>(comparator: Comparator<U>): Comparator<U> {
    return new Comparator.#Impl((a, b) => {
      if (isPresent(a) && isPresent(b)) {
        return comparator.compare(a, b);
      }
      if (isNull(a) && isNull(b)) {
        return 0;
      }
      if (isNull(a)) {
        return -1;
      }
      return 1;
    });
  }

  /**
   * A null-friendly comparator that compares objects using the given Comparator, putting null values last.
   * @param comparator the comparator that will be used to compare the objects.
   * @returns a new Comparator that compares objects using the given Comparator, with nulls last.
   * @example
   * ```typescript
   * const numbers = [1,5,null,3,2,4];
   * numbers.toSorted(
   *  Comparator.nullLast(
   *    Comparator.naturalOrder()
   *  ).compare
   * ); // [1,2,3,4,5,null]
   */
  public static nullLast<U>(comparator: Comparator<U>): Comparator<U> {
    return new Comparator.#Impl((a, b) => {
      if (isPresent(a) && isPresent(b)) {
        return comparator.compare(a, b);
      }
      if (isNull(a) && isNull(b)) {
        return 0;
      }
      if (isNull(a)) {
        return 1;
      }
      return -1;
    });
  }

  /**
   * An internal class that implements the abstract Comparator.
   * Used for the static methods of this class.
   */
  static readonly #Impl = class ComparatorImpl<T> extends Comparator<T> {
    constructor(public override compare: Comparator<T>['compare']) {
      super();
    }
  };

  /**
   * Compares its two arguments for order.
   * @param a the first object to be compared.
   * @param b the second object to be compared.
   * @returns a negative integer, zero, or a positive integer as the first argument is less than, equal to, or greater than the second.
   */
  public abstract compare(a: T, b: T): number;

  /**
   * Returns a new Comparator that imposes the reverse ordering of this Comparator.
   * @returns a Comparator that imposes the reverse ordering of this Comparator.
   * @example
   * ```typescript
   * const comparator = Comparator.naturalOrder();
   * const numbers = [1,5,3,2,4];
   * numbers.toSorted(
   *  comparator.reversed().compare
   * ); // [5,4,3,2,1]
   */
  public reversed(): Comparator<T> {
    return new Comparator.#Impl((b, a) => this.compare(a, b));
  }

   /**
   * Returns a lexicographic-order comparator with a function that extracts a comparable value.
   * If this Comparator considers two elements equal, the next one is used.
   * @param keyExtractor a function that extracts a comparable value from type T and compares objects by that value in natural order if the previous comparison is equal.
   */
   public thenComparing<U extends ComparableValueOf<T>>(keyExtractor: ComparableKeyExtractor<T,U>): Comparator<T>;
  /**
   * Returns a lexicographic-order comparator with another comparator. 
   * If this Comparator considers two elements equal, the next one is used.
   * @param other the Comparator to be used if the previous comparison is equal.
   * @returns a new Comparator that compares objects using the given Comparator if the previous comparison is equal.
   */
  public thenComparing(other: Comparator<T>): Comparator<T>;
  /**
   * Returns a lexicographic-order comparator with a function that extracts a comparable value and a Comparator.
   * If this Comparator considers two elements equal, the provided Comparator is used to compare the objects by the value extracted by the keyExtractor function.
   * @param keyExtractor a function that extracts a comparable value from type T.
   * @param keyComparator the Comparator to be used if the previous comparison is equal.
   * @returns a new Comparator that compares objects by the value extracted by the keyExtractor function using the given Comparator if the previous comparison is equal.
   */
  public thenComparing<U extends ComparableValueOf<T>>(keyExtractor: ComparableKeyExtractor<T,U>, keyComparator: Comparator<T[ComparableKeyOf<T>]>): Comparator<T>;
  public thenComparing<U extends ComparableValueOf<T>>(
    keyExtractorOrComparator: ComparableKeyExtractor<T,U> | Comparator<T>,
    keyComparator?: Comparator<T[ComparableKeyOf<T>]>
  ): Comparator<T> {
    return new Comparator.#Impl((a, b) => {
      const result = this.compare(a, b);
      if (result !== 0) {
        return result;
      }

      if (keyExtractorOrComparator instanceof Comparator) {
        return keyExtractorOrComparator.compare(a, b);
      }
 
      if(isUndefined(keyComparator)) {
        return Comparator.comparing(
          keyExtractorOrComparator,
        ).compare(a, b);
      }

      return Comparator.comparing(
        keyExtractorOrComparator,
        keyComparator
      ).compare(a, b);
    });
  }
}
