import { describe, expect, it } from 'vitest';
import { isEqual } from './is-equal';

describe('isEqual', () => {
  it.each([
    {
      type: 'string',
      a: 'a',
      b: 'a',
      expected: true,
    },
    {
      type: 'empty string',
      a: '',
      b: '',
      expected: true,
    },
    {
      type: 'different strings',
      a: 'a',
      b: 'b',
      expected: false,
    },
    {
      type: 'numbers',
      a: 0,
      b: 0,
      expected: true,
    },
    {
      type: 'boolean',
      a: true,
      b: true,
      expected: true,
    },
    {
      type: 'different boolean',
      a: true,
      b: false,
      expected: false,
    },
    {
      type: 'arrays',
      a: [1, 2, 3],
      b: [1, 2, 3],
      expected: true,
    },
    {
      type: 'different arrays',
      a: [1, 2, 3, 4],
      b: [4, 3, 2, 1],
      expected: false,
    },
    {
      type: 'empty arrays',
      a: [],
      b: [],
      expected: true,
    },
    {
      type: 'objects',
      a: { a: 'a', b: 'b' },
      b: { a: 'a', b: 'b' },
      expected: true,
    },
    {
      type: 'different objects',
      a: { a: 'a', b: 'b' },
      b: { a: 'b', b: 'a' },
      expected: false,
    },
    {
      type: 'empty objects',
      a: {},
      b: {},
      expected: true,
    },
  ])('should work for $type', ({ a, b, expected }) => {
    const result = isEqual(a, b);
    expect(result).toBe(expected);
  });
});
