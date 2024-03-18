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
      type: 'null',
      a: null,
      b: null,
      expected: true,
    },
    {
      type: 'undefined',
      a: undefined,
      b: undefined,
      expected: true,
    },
    {
      type: 'null and undefined',
      a: null,
      b: undefined,
      expected: false,
    },
    {
      type: 'Dates',
      a: new Date(10),
      b: new Date(10),
      expected: true,
    },
    {
      type: 'different Dates',
      a: new Date(10),
      b: new Date(20),
      expected: false,
    },
    {
      type: 'Maps',
      a: new Map([
        ['1', '1'],
        ['2', '2'],
      ]),
      b: new Map([
        ['1', '1'],
        ['2', '2'],
      ]),
      expected: true,
    },
    {
      type: 'different Maps',
      a: new Map([
        ['1', '1'],
        ['2', '2'],
      ]),
      b: new Map([
        ['1', '2'],
        ['2', '1'],
      ]),
      expected: false,
    },
    {
      type: 'empty Maps',
      a: new Map(),
      b: new Map(),
      expected: true,
    },
    {
      type: 'Sets',
      a: new Set([1, 2, 3]),
      b: new Set([1, 2, 3]),
      expected: true,
    },
    {
      type: 'different Sets',
      a: new Set([1, 2, 3]),
      b: new Set([3, 2, 1]),
      expected: false,
    },
    {
      type: 'empty Sets',
      a: new Set(),
      b: new Set(),
      expected: true,
    },
    {
      type: 'functions',
      a: function test() {
        /*empty on purpose*/
      },
      b: function test() {
        /*empty on purpose*/
      },
      expected: true,
    },
    {
      type: 'different functions',
      a: function foo() {
        /*empty on purpose*/
      },
      b: function bar() {
        /*empty on purpose*/
      },
      expected: false,
    },
    {
      type: 'anonymous functions',
      a: function () {
        /*empty on purpose*/
      },
      b: function () {
        /*empty on purpose*/
      },
      expected: true,
    },
    {
      type: 'arrow functions',
      a: () => {
        /*empty on purpose*/
      },
      b: () => {
        /*empty on purpose*/
      },
      expected: true,
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
