import { NullPointerException } from '@ts-java/common/exception/null-pointer';
import { describe, expect, it } from 'vitest';
import { Comparator } from './comparator';
import { CASE_INSENSITIVE_ORDER } from './string.comparator';

describe('CASE_INSENSITIVE_ORDER', () => {
  it('should be an instance of a Comparator', () => {
    expect(CASE_INSENSITIVE_ORDER).toBeInstanceOf(Comparator);
  });

  it('should be immutable', () => {
    expect(Object.isFrozen(CASE_INSENSITIVE_ORDER));

    expect(
      () =>
        // @ts-expect-error instance should be immutable so this is not valid Typescript
        (CASE_INSENSITIVE_ORDER.compare = () => 0)
    ).toThrow(TypeError);
  });

  it('should sort strings in a natural order', () => {
    const unsorted = ['b', 'c', 'a'];
    const sorted = ['a', 'b', 'c'];

    expect(unsorted.toSorted(CASE_INSENSITIVE_ORDER.compare)).toStrictEqual(
      sorted
    );
  });

  it('should sort strings in a natural order ', () => {
    const unsorted = ['Alpha', 'bravo', 'alpha', 'charlie', 'Bravo'];
    const sorted = ['Alpha', 'alpha', 'bravo', 'Bravo', 'charlie'];

    expect(unsorted.toSorted(CASE_INSENSITIVE_ORDER.compare)).toStrictEqual(
      sorted
    );
  });

  it('should throw a NullPointerException when one of the values is null', () => {
    expect(() =>
      // @ts-expect-error explicitly testing for invalid null input
      CASE_INSENSITIVE_ORDER.compare(null, 1)
    ).toThrowError(NullPointerException);

    expect(() =>
      // @ts-expect-error explicitly testing for invalid null input
      CASE_INSENSITIVE_ORDER.compare(1, null)
    ).toThrowError(NullPointerException);
  });

  it.each([
    { type: 'array', value: [1] },
    { type: 'object', value: { foo: 'bar' } },
    { type: 'number', value: 1 },
    { type: 'boolean', value: false },
    { type: 'Date', value: new Date('2025-03-06') },
    { type: 'Symbol', value: Symbol('test') },
  ])(
    'should throw a TypeError when one of the values is of type $type',
    ({ value }) => {
      expect(() =>
        // @ts-expect-error explicitly testing for invalid non-string input
        CASE_INSENSITIVE_ORDER.compare('a', value)
      ).toThrow(TypeError);

      expect(() =>
        // @ts-expect-error explicitly testing for invalid non-string input
        CASE_INSENSITIVE_ORDER.compare(value, 'b')
      ).toThrow(TypeError);
    }
  );
});
