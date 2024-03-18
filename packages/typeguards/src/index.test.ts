import { describe, expect, it } from 'vitest';
import {
  isArray,
  isBigInt,
  isBoolean,
  isDate,
  isError,
  isFunction,
  isMap,
  isNone,
  isNotANumber,
  isNull,
  isNumber,
  isObject,
  isPresent,
  isPromise,
  isRecord,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
  isWeakMap,
  isWeakSet,
} from './index';

function noop() {
  // empty
}

describe('isArray', () => {
  it.each([
    { expected: true, type: 'array', value: [1, 2, 3] },
    { expected: true, type: 'empty array', value: [] },
  ])('should work for $type', ({ expected, value }) => {
    expect(isArray(value)).toBe(expected);
  });
});

describe('isBigInt', () => {
  it.each([
    { expected: true, type: 'BigInt constructor', value: BigInt(0) },
    { expected: true, type: '0n', value: 0n },
  ])('should work for $type', ({ expected, value }) => {
    expect(isBigInt(value)).toBe(expected);
  });
});

describe('isBoolean', () => {
  it.each([
    { expected: true, type: 'true', value: true },
    { expected: true, type: 'false', value: false },
    { expected: true, type: 'Boolean constructor', value: Boolean('yes') },
  ])('should work for $type', ({ expected, value }) => {
    expect(isBoolean(value)).toBe(expected);
  });
});

describe('isDate', () => {
  it.each([{ expected: true, type: 'Date constructor', value: new Date() }])(
    'should work for $type',
    ({ expected, value }) => {
      expect(isDate(value)).toBe(expected);
    }
  );
});

describe('isError', () => {
  it.each([{ expected: true, type: 'Error constructor', value: new Error() }])(
    'should work for $type',
    ({ expected, value }) => {
      expect(isError(value)).toBe(expected);
    }
  );
});

describe('isFunction', () => {
  it.each([
    { expected: true, type: 'function', value: noop },
    { expected: true, type: 'async function', value: async () => noop() },
  ])('should work for $type', ({ expected, value }) => {
    expect(isFunction(value)).toBe(expected);
  });
});

describe('isMap', () => {
  it.each([
    { expected: true, type: 'Map', value: new Map() },
    // false
    { expected: false, type: 'WeakMap', value: new WeakMap() },
  ])('should work for $type', ({ expected, value }) => {
    expect(isMap(value)).toBe(expected);
  });
});

describe('isNotANumber', () => {
  it.each([
    { expected: true, type: 'NaN', value: NaN },
    // false
    { expected: false, type: 'null', value: null },
    { expected: false, type: 'number', value: 0 },
    { expected: false, type: 'undefined', value: undefined },
  ])('should work for $type', ({ expected, value }) => {
    expect(isNotANumber(value)).toBe(expected);
  });
});

describe('isNone', () => {
  it.each([
    { expected: true, type: 'null', value: null },
    { expected: true, type: 'undefined', value: undefined },
    // false
    { expected: false, type: 'empty array', value: [] },
    { expected: false, type: 'bigint', value: BigInt(0) },
    { expected: false, type: 'false', value: false },
    { expected: false, type: 'function', value: noop },
    { expected: false, type: 'NaN', value: NaN },
    { expected: false, type: 'number', value: 0 },
    { expected: false, type: 'object', value: {} },
    { expected: false, type: 'string', value: '' },
    { expected: false, type: 'symbol', value: Symbol() },
  ])('should work for $type', ({ expected, value }) => {
    expect(isNone(value)).toBe(expected);
  });
});

describe('isPresent', () => {
  it.each([
    { expected: true, type: 'array', value: [1, 2, 3] },
    { expected: true, type: 'bigint', value: BigInt(0) },
    { expected: true, type: 'true', value: true },
    { expected: true, type: 'false', value: false },
    { expected: true, type: 'function', value: noop },
    { expected: true, type: 'NaN', value: NaN },
    { expected: true, type: 'number', value: 0 },
    { expected: true, type: 'object', value: {} },
    { expected: true, type: 'string', value: '' },
    { expected: true, type: 'symbol', value: Symbol('symbol') },
    // false
    { expected: false, type: 'null', value: null },
    { expected: false, type: 'undefined', value: undefined },
  ])('should work for $type', ({ expected, value }) => {
    expect(isPresent(value)).toBe(expected);
  });
});

describe('isNull', () => {
  it.each([{ expected: true, type: 'null', value: null }])(
    'should work for $type',
    ({ expected, value }) => {
      expect(isNull(value)).toBe(expected);
    }
  );
});

describe('isNumber', () => {
  it.each([
    { expected: true, type: 'NaN', value: NaN },
    { expected: true, type: '0', value: 0 },
    { expected: true, type: 'numbers', value: 42 },
    { expected: true, type: 'Number constructor', value: Number(10) },
    // false
    { expected: false, type: 'bigint', value: BigInt(0) },
  ])('should work for $type', ({ expected, value }) => {
    expect(isNumber(value)).toBe(expected);
  });
});

describe('isObject', () => {
  it.each([
    { expected: true, type: 'object', value: {} },
    { expected: true, type: 'array', value: [1, 2, 3] },
    // false
    { expected: false, type: 'null', value: null },
    { expected: false, type: 'function', value: noop },
  ])('should work for $type', ({ expected, value }) => {
    expect(isObject(value)).toBe(expected);
  });
});

describe('isPromise', () => {
  it.each([
    {
      expected: true,
      type: 'Promise',
      value: new Promise(noop),
    },
    {
      expected: true,
      type: 'async function',
      value: (async () => noop())(),
    },
  ])('should work for $type', ({ expected, value }) => {
    expect(isPromise(value)).toBe(expected);
  });
});

describe('isRecord', () => {
  it.each([{ expected: true, type: 'object', value: {} }])(
    'should work for $type',
    ({ expected, value }) => {
      expect(isRecord(value)).toBe(expected);
    }
  );
});

describe('isRegExp', () => {
  it.each([
    { expected: true, type: 'regex', value: /hello world/ },
    {
      expected: true,
      type: 'RegExp constructor',
      value: new RegExp('hello world'),
    },
    // false
    { expected: false, type: 'string', value: '' },
  ])('should work for $type', ({ expected, value }) => {
    expect(isRegExp(value)).toBe(expected);
  });
});

describe('isSet', () => {
  it.each([
    { expected: true, type: 'Set', value: new Set() },
    // false
    { expected: false, type: 'WeakSet', value: new WeakSet() },
  ])('should work for $type', ({ expected, value }) => {
    expect(isSet(value)).toBe(expected);
  });
});

describe('isString', () => {
  it.each([
    { expected: true, type: 'string', value: 'Hello world' },
    { expected: true, type: 'empty string', value: '' },
    {
      expected: true,
      type: 'String constructor',
      value: String('Hello world'),
    },
  ])('should work for $type', ({ expected, value }) => {
    expect(isString(value)).toBe(expected);
  });
});

describe('isSymbol', () => {
  it.each([{ expected: true, type: 'symbol', value: Symbol('symbol') }])(
    'should work for $type',
    ({ expected, value }) => {
      expect(isSymbol(value)).toBe(expected);
    }
  );
});

describe('isUndefined', () => {
  it.each([
    { expected: true, type: 'undefined', value: undefined },
    // false
    { expected: false, type: 'empty array', value: [] },
    { expected: false, type: 'false', value: false },
    { expected: false, type: 'NaN', value: NaN },
    { expected: false, type: 'null', value: null },
    { expected: false, type: '0', value: 0 },
    { expected: false, type: 'empty object', value: {} },
    { expected: false, type: 'empty string', value: '' },
  ])('should work for $type', ({ expected, value }) => {
    expect(isUndefined(value)).toBe(expected);
  });
});

describe('isWeakMap', () => {
  it.each([
    { expected: true, type: 'WeakMap', value: new WeakMap() },
    // false
    { expected: false, type: 'Map', value: new Map() },
  ])('should work for $type', ({ expected, value }) => {
    expect(isWeakMap(value)).toBe(expected);
  });
});

describe('isWeakSet', () => {
  it.each([
    { expected: true, type: 'WeakSet', value: new WeakSet() },
    // false
    { expected: false, type: 'Set', value: new Set() },
  ])('should work for $type', ({ expected, value }) => {
    expect(isWeakSet(value)).toBe(expected);
  });
});
