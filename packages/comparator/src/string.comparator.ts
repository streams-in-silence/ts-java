import { NullPointerException } from '@ts-java/common/exception/null-pointer';
import { isNone, isString } from '@ts-java/common/typeguards';
import { Comparator } from './comparator';

/**
 * An internal class that extends the Comparator class to implement a string based Comparator
 * that compares strings in natural order, ignoring case differences. It is not using locale-sensitive comparison.
 */
class CaseInsensitiveOrderComparator extends Comparator<string> {
  public override compare(a: string, b: string): number {
    if (isNone(a) || isNone(b)) {
      throw new NullPointerException();
    }

    if (!isString(a) || !isString(b)) {
      throw new TypeError('both arguments must be a string');
    }

    const convertedAString = a.toUpperCase().toLowerCase();
    const convertedBString = b.toUpperCase().toLowerCase();

    if (convertedAString === convertedBString) {
      return 0;
    }

    if (convertedAString < convertedBString) {
      return -1;
    }

    return 1;
  }
}

/**
 * A comparator that compares two strings lexographically, eliminating case differences by calling toUpperCase().toLowerCase() on each Unicode code point.
 *
 * This Comparator does _not_ take locale into account and will result in an unsatisfactory ordering for certain locales. If locale-sensitive comparison is required,
 * use {@link Intl.Collator} or {@link String.localeCompare} with a proper locale instead.
 *
 * @see {@link Intl.Collator}
 * @see {@link String.localeCompare}
 * @example
 * ```typescript
 * const strings = ['Alpha', 'bravo', 'alpha', 'charlie', 'Bravo']
 * strings.toSorted(
 *  CASE_INSENSITIVE_ORDER.compare
 * ); // ['Alpha', 'alpha', 'bravo', 'Bravo', 'charlie']
 * ```
 */
export const CASE_INSENSITIVE_ORDER: Readonly<Comparator<string>> =
  Object.freeze(new CaseInsensitiveOrderComparator());
