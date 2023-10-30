import { NullPointerException } from './exceptions/null-pointer.exception';
import {
  isBoolean,
  isComparable,
  isDate,
  isNull,
  isNumber,
  isPresent,
  isSameType,
  isString,
} from './utils/typeguards';
import {
  ComparableProps,
  ComparableValue,
  ComparableValueExtractor,
  CompareFunction,
} from './utils/types';

export abstract class Comparator<T> {
  public static comparing<T extends ComparableProps<T>>(
    keyExtractor: ComparableValueExtractor<T>
  ): Comparator<T> {
    return Comparator.#create((a, b) => {
      return Comparator.naturalOrder<ComparableValue>().compare(
        keyExtractor(a),
        keyExtractor(b)
      );
    });
  }

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
    return Comparator.#create((a, b) => {
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

  static #create<T>(compareFn: CompareFunction<T>): Comparator<T> {
    return new ComparatorImpl(compareFn);
  }

  public abstract compare(a: T, b: T): number;

  public reversed(): Comparator<T> {
    return Comparator.#create((b, a) => this.compare(a, b));
  }

  public thenComparing(
    keyExtractorOrComparator: ComparableValueExtractor<T> | Comparator<T>
  ): Comparator<T> {
    return Comparator.#create((a, b) => {
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

class ComparatorImpl<T> extends Comparator<T> {
  readonly #compareFn: CompareFunction<T>;

  constructor(compareFn: CompareFunction<T>) {
    super();
    this.#compareFn = compareFn;
  }

  public override compare(a: T, b: T): number {
    return this.#compareFn(a, b);
  }
}
