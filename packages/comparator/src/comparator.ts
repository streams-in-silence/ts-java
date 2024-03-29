import { NullPointerException } from '@sis/common';
import {
  isBoolean,
  isDate,
  isNull,
  isNumber,
  isPresent,
  isString,
} from '@sis/typeguards';
import { isComparable, isSameType } from './typeguards';
import {
  ComparableProps,
  ComparableValue,
  ComparableValueExtractor,
} from './types';

export abstract class Comparator<T> {
  public static comparing<T extends ComparableProps<T>>(
    keyExtractor: ComparableValueExtractor<T>
  ): Comparator<T> {
    return new Comparator.#Impl((a, b) => {
      return Comparator.naturalOrder<ComparableValue>().compare(
        keyExtractor(a),
        keyExtractor(b)
      );
    });
  }

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

  public static reverseOrder<T>(): Comparator<T> {
    return Comparator.naturalOrder<T>().reversed();
  }

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

  static readonly #Impl = class ComparatorImpl<T> extends Comparator<T> {
    constructor(public override compare: Comparator<T>['compare']) {
      super();
    }
  };

  public abstract compare(a: T, b: T): number;

  public reversed(): Comparator<T> {
    return new Comparator.#Impl((b, a) => this.compare(a, b));
  }

  public thenComparing(
    keyExtractorOrComparator: ComparableValueExtractor<T> | Comparator<T>
  ): Comparator<T> {
    return new Comparator.#Impl((a, b) => {
      const result = this.compare(a, b);
      if (result !== 0) {
        return result;
      }

      if (keyExtractorOrComparator instanceof Comparator) {
        return keyExtractorOrComparator.compare(a, b);
      }

      return Comparator.naturalOrder<ComparableValue>().compare(
        keyExtractorOrComparator(a),
        keyExtractorOrComparator(b)
      );
    });
  }
}
