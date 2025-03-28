import { describe, expect, it } from 'vitest';
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
});
