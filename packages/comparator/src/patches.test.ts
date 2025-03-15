import { isFunction } from '@ts-java/common/typeguards';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Comparator } from './comparator';
import { patchArray, revertPatchArray } from './patches';

/**
 * Conditionally runs a testSuite based on the givven condition.
 *
 * @param condition the condition to run the suite or skip it
 * @returns the {@link describe} method if the condition is met or {@link describe.skip} if not.
 */
const describeIf = (condition: boolean) =>
  condition ? describe : describe.skip;

describe('patches', () => {
  describe('patchArray', () => {
    describe('sort', () => {
      afterEach(() => {
        revertPatchArray();
      });

      it('should be possible to sort an array without arguments', () => {
        patchArray();

        expect([3, 2, 1].sort(undefined)).toStrictEqual([1, 2, 3]);
      });

      it('should be possible to sort an array with a provided compare function', () => {
        patchArray();

        expect([3, 2, 1].sort((a, b) => a - b)).toStrictEqual([1, 2, 3]);
      });

      it('should be possible to sort an array with a provided Comparator instance', () => {
        patchArray();

        expect([3, 2, 1].sort(Comparator.naturalOrder())).toStrictEqual([
          1, 2, 3,
        ]);
      });

      it('should throw a TypeError if something other than undefined, a function or a Comparator is provided', () => {
        patchArray();

        expect(() =>
          [3, 2, 1]
            // @ts-expect-error must provide undefined, a function or a Comparator instance
            .sort(null)
        ).toThrow(TypeError);
      });
    });

    describeIf(isFunction(Array.prototype.toSorted))('toSorted', () => {
      it('should be possible to sort an array without arguments', () => {
        patchArray();

        expect([3, 2, 1].toSorted(undefined)).toStrictEqual([1, 2, 3]);
      });

      it('should be possible to sort an array with a provided compare function', () => {
        patchArray();

        expect([3, 2, 1].toSorted((a, b) => a - b)).toStrictEqual([1, 2, 3]);
      });

      it('should be possible to sort an array with a provided Comparator instance', () => {
        patchArray();

        expect([3, 2, 1].toSorted(Comparator.naturalOrder())).toStrictEqual([
          1, 2, 3,
        ]);
      });

      it('should throw a TypeError if something other than undefined, a function or a Comparator is provided', () => {
        patchArray();

        expect(() =>
          [3, 2, 1]
            // @ts-expect-error must provide undefined, a function or a Comparator instance
            .toSorted(null)
        ).toThrow(TypeError);
      });
    });
  });

  describe('revertPatchArray', () => {
    describe('sort', () => {
      beforeEach(() => {
        patchArray();
      });

      it('should be possible to sort an array without arguments after revertPatchArray was called', () => {
        revertPatchArray();

        expect([3, 2, 1].sort(undefined)).toStrictEqual([1, 2, 3]);
      });

      it('should be possible to sort an array with a provided compare function after revertPatchArray was called', () => {
        revertPatchArray();

        expect([3, 2, 1].sort((a, b) => a - b)).toStrictEqual([1, 2, 3]);
      });

      it('should throw a TypeError if a Comparator is provided after revertPatchArray was called', () => {
        revertPatchArray();

        expect(() => [3, 2, 1].sort(Comparator.naturalOrder())).toThrow(
          TypeError
        );
      });
    });

    describeIf(isFunction(Array.prototype.toSorted))('toSorted', () => {
      it('should be possible to sort an array without arguments after revertPatchArray was called', () => {
        patchArray();

        expect([3, 2, 1].toSorted(undefined)).toStrictEqual([1, 2, 3]);
      });

      it('should be possible to sort an array with a provided compare function after revertPatchArray was called', () => {
        patchArray();

        expect([3, 2, 1].toSorted((a, b) => a - b)).toStrictEqual([1, 2, 3]);
      });

      it('should throw a TypeError if a Comparator is provided after revertPatchArray was called', () => {
        revertPatchArray();

        expect(() => [3, 2, 1].toSorted(Comparator.naturalOrder())).toThrow(
          TypeError
        );
      });
    });
  });
});
