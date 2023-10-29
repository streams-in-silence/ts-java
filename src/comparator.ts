import { NullPointerException } from './exceptions/null-pointer.exception';
import {
  isBoolean,
  isComparable,
  isDate,
  isNone,
  isNull,
  isNumber,
  isPresent,
  isSameType,
  isString,
} from './utils/typeguards';

type CompareFunction<T> = (a: T, b: T) => number;

export abstract class Comparator<T> {
  public static naturalOrder<T>(): Comparator<T> {
    return Comparator.#create((a, b) => {
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
    return Comparator.#create((a, b) => {
      if (isPresent(a) && isPresent(b)) {
        return comparator.compare(a, b);
      }
      if (isNone(a) && isNone(b)) {
        return 0;
      }
      if (isNone(a)) {
        return 1;
      }
      return -1;
    });
  }

  public static nullLast<U>(comparator: Comparator<U>): Comparator<U> {
    return Comparator.#create((a, b) => {
      if (isPresent(a) && isPresent(b)) {
        return comparator.compare(a, b);
      }
      if (isNone(a) && isNone(b)) {
        return 0;
      }
      if (isNone(a)) {
        return -1;
      }
      return 1;
    });
  }

  static #create<T>(compareFn: CompareFunction<T>): Comparator<T> {
    class Impl extends Comparator<T> {
      public override compare(a: T, b: T): number {
        return compareFn(a, b);
      }
    }

    return new Impl();
  }

  public abstract compare(a: T, b: T): number;

  public reversed(): Comparator<T> {
    return Comparator.#create((b, a) => this.compare(a, b));
  }

  public thenComparing(other: Comparator<T>): Comparator<T> {
    return Comparator.#create((a, b) => {
      const result = this.compare(a, b);
      if (result !== 0) {
        return result;
      }
      return other.compare(a, b);
    });
  }
}
