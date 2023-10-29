import { describe, expect, it } from 'vitest';
import { Comparable } from './comparable';
import { Comparator } from './comparator';

class TestComparable implements Comparable<TestComparable> {
  constructor(
    public readonly name: string,
    public readonly age: number
  ) {}

  public compareTo(other: TestComparable): number {
    return this.name.localeCompare(other.name);
  }
}

describe('Comparator', () => {
  describe('Comparator.naturalOrder', () => {
    it('should sort numbers in ascending order', () => {
      const unsorted = [5, 3, 1, 4, 2];
      const sorted = [1, 2, 3, 4, 5];

      expect(unsorted.sort(Comparator.naturalOrder().compare)).toEqual(sorted);
    });

    it('should sort strings alphabetically in ascending order', () => {
      const unsorted = ['b', 'c', 'a'];
      const sorted = ['a', 'b', 'c'];

      expect(unsorted.sort(Comparator.naturalOrder().compare)).toEqual(sorted);
    });

    it('should sort booleans in ascending order', () => {
      const unsorted = [true, false, true, false];
      const sorted = [true, true, false, false];

      expect(unsorted.sort(Comparator.naturalOrder().compare)).toEqual(sorted);
    });

    it('should sort Dates in ascending order', () => {
      const unsorted: Date[] = [
        new Date('2022-03-01'),
        new Date('2022-01-01'),
        new Date('2022-02-01'),
      ];

      const sorted = [
        new Date('2022-01-01'),
        new Date('2022-02-01'),
        new Date('2022-03-01'),
      ];

      expect(unsorted.sort(Comparator.naturalOrder().compare)).toEqual(sorted);
    });

    it('should sort objects that are "comparable" in ascending order', () => {
      const unsorted = [
        new TestComparable('John', 20),
        new TestComparable('Alice', 25),
        new TestComparable('Bob', 30),
      ];

      const sorted = [
        new TestComparable('Alice', 25),
        new TestComparable('Bob', 30),
        new TestComparable('John', 20),
      ];

      expect(unsorted.sort(Comparator.naturalOrder().compare)).toEqual(sorted);
    });
  });

  describe('Comparator.reverseOrder', () => {
    it('should sort numbers in descending order', () => {
      const unsorted = [1, 5, 3, 2, 4];
      const sorted = [5, 4, 3, 2, 1];

      expect(unsorted.sort(Comparator.reverseOrder().compare)).toEqual(sorted);
    });

    it('should sort strings alphabetically in descending order', () => {
      const unsorted = ['a', 'c', 'b'];
      const sorted = ['c', 'b', 'a'];

      expect(unsorted.sort(Comparator.reverseOrder().compare)).toEqual(sorted);
    });

    it('should sort booleans in descending order', () => {
      const unsorted = [false, true, false, true];
      const sorted = [false, false, true, true];

      expect(unsorted.sort(Comparator.reverseOrder().compare)).toEqual(sorted);
    });

    it('should sort Dates in descending order', () => {
      const unsorted = [
        new Date('2022-01-01'),
        new Date('2022-02-01'),
        new Date('2022-03-01'),
      ];

      const sorted = [
        new Date('2022-03-01'),
        new Date('2022-02-01'),
        new Date('2022-01-01'),
      ];

      expect(unsorted.sort(Comparator.reverseOrder().compare)).toEqual(sorted);
    });

    it('should sort objects that are "comparable" in descending order', () => {
      const unsorted = [
        new TestComparable('Bob', 30),
        new TestComparable('Alice', 25),
        new TestComparable('John', 20),
      ];

      const sorted = [
        new TestComparable('John', 20),
        new TestComparable('Bob', 30),
        new TestComparable('Alice', 25),
      ];

      expect(unsorted.sort(Comparator.reverseOrder().compare)).toEqual(sorted);
    });
  });
});
