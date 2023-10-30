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

  describe('Comparator.comparing', () => {
    it('should sort by name when comparing by name', () => {
      const comparator = Comparator.comparing<TestComparable>((o) => o.name);

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

      expect(unsorted.sort(comparator.compare)).toEqual(sorted);
    });

    it('should sort by age when comparing by age', () => {
      const comparator = Comparator.comparing<TestComparable>((o) => o.age);

      const unsorted = [
        new TestComparable('Bob', 30),
        new TestComparable('Alice', 25),
        new TestComparable('John', 20),
      ];

      const sorted = [
        new TestComparable('John', 20),
        new TestComparable('Alice', 25),
        new TestComparable('Bob', 30),
      ];

      expect(unsorted.sort(comparator.compare)).toEqual(sorted);
    });
  });

  describe('Comparator.nullFirst', () => {
    it('should sort null before numbers', () => {
      const unsorted = [null, 1, 2, null, 3];
      const sorted = [null, null, 1, 2, 3];

      expect(
        unsorted.sort(Comparator.nullFirst(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });

    it('should sort null before strings', () => {
      const unsorted = [null, 'a', 'b', null, 'c'];
      const sorted = [null, null, 'a', 'b', 'c'];

      expect(
        unsorted.sort(Comparator.nullFirst(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });

    it('should sort null before booleans', () => {
      const unsorted = [null, true, false, null, true];
      const sorted = [null, null, true, true, false];

      expect(
        unsorted.sort(Comparator.nullFirst(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });

    it('should sort null before dates', () => {
      const unsorted = [null, new Date(2020), new Date(2022), null];
      const sorted = [null, null, new Date(2020), new Date(2022)];

      expect(
        unsorted.sort(Comparator.nullFirst(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });
  });

  describe('Comparator.nullLast', () => {
    it('should sort null after numbers', () => {
      const unsorted = [null, 1, 2, null, 3];
      const sorted = [1, 2, 3, null, null];

      expect(
        unsorted.sort(Comparator.nullLast(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });

    it('should sort null after strings', () => {
      const unsorted = [null, 'a', 'b', null, 'c'];
      const sorted = ['a', 'b', 'c', null, null];

      expect(
        unsorted.sort(Comparator.nullLast(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });

    it('should sort null after booleans', () => {
      const unsorted = [null, true, false, null, true];
      const sorted = [true, true, false, null, null];

      expect(
        unsorted.sort(Comparator.nullLast(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });

    it('should sort null after dates', () => {
      const unsorted = [null, new Date(2020), new Date(2022), null];
      const sorted = [new Date(2020), new Date(2022), null, null];

      expect(
        unsorted.sort(Comparator.nullLast(Comparator.naturalOrder()).compare)
      ).toEqual(sorted);
    });
  });

  describe('thenComparing', () => {
    it('should apply a second comparator when the first comparator returns 0', () => {
      const AgeComparator = Comparator.comparing<TestComparable>((o) => o.age);
      const comparator = Comparator.comparing<TestComparable>(
        (o) => o.name
      ).thenComparing(AgeComparator);

      const unsorted = [
        new TestComparable('Bob', 30),
        new TestComparable('Alice', 20),
        new TestComparable('Bob', 25),
      ];

      const sorted = [
        new TestComparable('Alice', 20),
        new TestComparable('Bob', 25),
        new TestComparable('Bob', 30),
      ];

      expect(unsorted.sort(comparator.compare)).toStrictEqual(sorted);
    });

    it('should sort by another comparable value based on the key extractor', () => {
      const comparator = Comparator.comparing<TestComparable>(
        (o) => o.name
      ).thenComparing((o) => o.age);

      const unsorted = [
        new TestComparable('Bob', 30),
        new TestComparable('Alice', 20),
        new TestComparable('Bob', 25),
      ];

      const sorted = [
        new TestComparable('Alice', 20),
        new TestComparable('Bob', 25),
        new TestComparable('Bob', 30),
      ];

      expect(unsorted.sort(comparator.compare)).toStrictEqual(sorted);
    });
  });
});
