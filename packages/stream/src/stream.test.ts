import { describe, expect, it, vitest } from 'vitest';
import { Stream } from './stream';

describe('Stream', () => {
  describe('of', () => {
    it('should create a new sequential Stream from a single element', () => {
      const result = Stream.of('foo');

      expect(result).toBeInstanceOf(Stream);
      expect(result.count()).toBe(1);
    });

    it('should create a sequential Stream from multiple arguments', () => {
      const result = Stream.of('foo', 'bar', 'baz');

      expect(result).toBeInstanceOf(Stream);
      expect(result.count()).toBe(3);
    });

    it('should not unpack an array of elements into a new Stream', () => {
      const result = Stream.of([1, 2, 3]);

      expect(result).toBeInstanceOf(Stream);
      expect(result.count()).toBe(1);
    });
  });

  describe('filter', () => {
    it('should be an intermediate operation and return a new sequential', () => {
      const result = Stream.of(1, 2, 3).filter(() => true);

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not run the filter immediately', () => {
      const spy = vitest.fn(() => true);
      Stream.of(1, 2, 3).filter(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should run the filter function on every element', () => {
      const spy = vitest.fn(() => true);
      Stream.of(1, 2, 3).filter(spy).count();

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 3);
    });

    it('should not forward the element to the next stream when it does not match the predicate', () => {
      const result = Stream.of(1, 2, 3)
        .filter((num) => num % 2 === 0)
        .count();

      expect(result).toBe(1);
    });
  });

  describe('forEach', () => {
    it('should be a terminal operation and call the callback on each element of the Stream', () => {
      const callback = vitest.fn();

      Stream.of(1, 2, 3, 4).forEach(callback);

      expect(callback).toHaveBeenNthCalledWith(1, 1);
      expect(callback).toHaveBeenNthCalledWith(2, 2);
      expect(callback).toHaveBeenNthCalledWith(3, 3);
      expect(callback).toHaveBeenNthCalledWith(4, 4);
    });
  });

  describe('map', () => {
    it('should be an intermediate operation and return a new Stream', () => {
      const result = Stream.of(1, 2, 3).map((num) => num * num);

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not run the mapper immediately', () => {
      const spy = vitest.fn((num) => num);
      Stream.of(1, 2, 3).map(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should run the mapper function on every element', () => {
      const spy = vitest.fn((num) => num);
      Stream.of(1, 2, 3).map(spy).count();

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 3);
    });
  });
});
