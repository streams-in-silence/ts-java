import { isUndefined } from '@ts-java/common/typeguards';
import { Comparator } from './comparator';

declare global {
  interface Array<T> {
    sort(comparatorOrCompareFn?: Comparator<T> | ((a: T, b: T) => number)): T[];
    toSorted(
      comparatorOrCompareFn?: Comparator<T> | ((a: T, b: T) => number)
    ): T[];
  }
}

const originalSort = Array.prototype.sort;

/**
 * Patches the {@link Array.prototype.sort} method to implicitly pass in the
 * `compare` method of a provided {@link Comparator}.
 * The usage of this method is discuraged as messing with the prototype of
 * native objects can lead to unexpected behavior, bugs and compatibility
 * issues.
 */
function patchSort(): void {
  Array.prototype.sort = function sort<T>(
    comparatorOrFunction?: Comparator<T> | ((a: T, b: T) => number)
  ): T[] {
    if (comparatorOrFunction instanceof Comparator) {
      return originalSort.call(this, comparatorOrFunction.compare);
    }
    return originalSort.call(this, comparatorOrFunction);
  };
}

const originalToSorted = Array.prototype.toSorted;
/**
 * Patches the {@link Array.prototype.toSorted} method to implicitly pass in the
 * `compare` method of a provided {@link Comparator}.
 * The usage of this method is discuraged as messing with the prototype of
 * native objects can lead to unexpected behavior, bugs and compatibility
 * issues.
 */
function patchToSorted(): void {
  // only patch if already define
  if (isUndefined(originalToSorted)) {
    return;
  }

  Array.prototype.toSorted = function toSorted<T>(
    comparatorOrFunction?: Comparator<T> | ((a: T, b: T) => number)
  ): T[] {
    if (comparatorOrFunction instanceof Comparator) {
      return originalToSorted.call(this, comparatorOrFunction.compare);
    }
    return originalToSorted.call(this, comparatorOrFunction);
  };
}

/**
 * Patches the {@link Array.prototype.sort} and {@link Array.prototype.toSorted} method to implicitly pass
 * in the `compare` method of a provided {@link Comparator}.
 *
 * The usage of this method is discuraged as messing with the prototype of
 * native objects can lead to unexpected behavior, bugs and compatibility
 * issues.
 */
export function patchArray(): void {
  patchSort();
  patchToSorted();
}

/**
 * Reverts the patched {@link Array.prototype.sort} and {@link Array.prototype.toSorted} method to the native implementation, removing the support for
 * passing a {@link Comparator}.
 *
 * This only removes the JavaScript implementation but not the Typescript type override!
 */
export function revertPatchArray(): void {
  Array.prototype.sort = originalSort;
  Array.prototype.toSorted = originalToSorted;
}
