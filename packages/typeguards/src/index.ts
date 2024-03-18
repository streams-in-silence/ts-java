/**
 * Type Guards
 *
 * This module provides a collection of type guard functions that can be used to check the type of a value at runtime.
 * Each type guard function returns a boolean value indicating whether the input value matches the specified type.
 * If the input value matches the type, the type guard function narrows down the type of the input value in the type system.
 *
 * @module typeguards
 */

import { AnyFunction } from '@sis/common';

/**
 * Checks if the given input is an array.
 *
 * @param input - The input to check.
 * @returns True if the input is an array, false otherwise.
 *
 * @example
 * const arr = [1, 2, 3];
 * isArray(arr); // true
 */
export function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

/**
 * Checks if the given input is a bigint.
 *
 * @param input - The input to check.
 * @returns True if the input is a bigint, false otherwise.
 *
 * @example
 * const big = BigInt(123);
 * isBigInt(big); // true
 */
export function isBigInt(input: unknown): input is bigint {
  return typeof input === 'bigint';
}

/**
 * Checks if the given input is a boolean.
 *
 * @param input - The input to check.
 * @returns True if the input is a boolean, false otherwise.
 *
 * @example
 * const bool = true;
 * isBoolean(bool); // true
 */
export function isBoolean(input: unknown): input is boolean {
  return typeof input === 'boolean';
}

/**
 * Checks if the given input is a Date object.
 *
 * @param input - The input to check.
 * @returns True if the input is a Date object, false otherwise.
 *
 * @example
 * const date = new Date();
 * isDate(date); // true
 */
export function isDate(input: unknown): input is Date {
  return input instanceof Date;
}

/**
 * Checks if the given input is an Error object.
 *
 * @param input - The input to check.
 * @returns True if the input is an Error object, false otherwise.
 *
 * @example
 * const error = new Error('Something went wrong');
 * isError(error); // true
 *
 * isError(123); // false
 */
export function isError(input: unknown): input is Error {
  return input instanceof Error;
}

/**
 * Checks if the given input is a function.
 *
 * @param input - The input to check.
 * @returns True if the input is a function, false otherwise.
 *
 * @example
 * function foo() {}
 * isFunction(foo); // true
 *
 * isFunction(123); // false
 */
export function isFunction<T extends AnyFunction>(input: unknown): input is T {
  return typeof input === 'function';
}

/**
 * Checks if the given input is not a function.
 *
 * @param input - The input to check.
 * @returns True if the input is not a function, false otherwise.
 *
 * @example
 * function foo() {}
 * isNotFunction(123); // true
 *
 * isNotFunction(foo); // false
 */
export function isNotFunction<T>(value: T): value is Exclude<T, AnyFunction> {
  return typeof value !== 'function';
}

/**
 * Checks if the given input is a Map object.
 *
 * @param input - The input to check.
 * @returns True if the input is a Map object, false otherwise.
 *
 * @example
 * const map = new Map();
 * isMap(map); // true
 *
 * isMap(123); // false
 */
export function isMap(input: unknown): input is Map<unknown, unknown> {
  return input instanceof Map;
}

/**
 * Checks if the given value is NaN (not a number).
 *
 * @param input - The value to check.
 * @returns True if the value is NaN, false otherwise.
 *
 * @example
 * isNaN(NaN); // true
 * isNaN(123); // false
 */
export function isNotANumber(input: unknown): input is number {
  return Number.isNaN(input);
}

/**
 * Checks if the given input is null or undefined.
 *
 * @param input - The input to check
 * @returns True if the input is null or undefined, false otherwise
 *
 * @example
 *
 * const x = null;
 * isNone(null); // true
 *
 * let y;
 * isNone(y); // true
 *
 * isNone(123); // false
 */
export function isNone(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}

/**
 * Checks if the given input is not null or undefined.
 *
 * @param input - The input to check
 * @returns True if the input is not null or undefined, false otherwise
 *
 * @example
 * isPresent(123); // true
 *
 * let y;
 * isPresent(y); // false
 *
 * isPresent(null); // false
 */
export function isPresent<T>(input: T): input is Exclude<T, null | undefined> {
  return input !== null && input !== undefined;
}

/**
 * Checks if the given input is null.
 *
 * @param input - The input to check.
 * @returns True if the input is null, false otherwise.
 *
 * @example
 * const x = null;
 * isNull(x); // true
 *
 * isNull(123); // false
 */
export function isNull(input: unknown): input is null {
  return input === null;
}

/**
 * Checks if the given input is not null.
 *
 * @param input - The input to check.
 * @returns True if the input is not null, false otherwise.
 *
 * @example
 * const x = 123;
 * isNotNull(x); // true
 *
 * isNotNull(null); // false
 */
export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

/**
 * Checks if the given input is a number.
 *
 * @param input - The input to check.
 * @returns True if the input is a number, false otherwise.
 *
 * @example
 * const num = 123;
 * isNumber(num); // true
 *
 * isNumber('123'); // false
 */
export function isNumber(input: unknown): input is number {
  return typeof input === 'number';
}

/**
 * Checks if the given input is a non-null object.
 *
 * @param input - The input to check.
 * @returns True if the input is an object and not null, false otherwise.
 *
 * @example
 * const obj = {foo: 'bar'};
 * isObject(obj); // true
 *
 * isObject(null); // false
 */
export function isObject<T extends object>(input: unknown): input is T {
  return typeof input === 'object' && input !== null;
}

/**
 * Checks if the given input is a Promise.
 *
 * @param input - The input to check
 * @returns True if the input is a Promise, false otherwise
 *
 * @example
 * const promise = Promise.resolve(123);
 * isPromise(promise); // true
 *
 * isPromise(123); // false
 */
export function isPromise<T extends Promise<unknown>>(
  input: unknown
): input is T {
  return input instanceof Promise;
}

/**
 * Checks if the given input is a record (plain object).
 *
 * @param input - The input to check
 * @returns True if the input is a record, false otherwise
 *
 * @example
 * const obj = { foo: 'bar' };
 * isRecord(obj); // true
 *
 * isRecord([1, 2, 3]); // false
 */
export function isRecord<T extends Record<string, unknown>>(
  input: unknown
): input is T {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

/**
 * Checks if the given input is a RegExp object.
 *
 * @param input - The input to check
 * @returns True if the input is a RegExp object, false otherwise
 *
 * @example
 * const regex = /foo/;
 * isRegExp(regex); // true
 *
 * isRegExp('foo'); // false
 */
export function isRegExp(input: unknown): input is RegExp {
  return input instanceof RegExp;
}

/**
 * Checks if the given input is a Set object.
 *
 * @param input - The input to check
 * @returns True if the input is a Set object, false otherwise
 *
 * @example
 * const set = new Set();
 * isSet(set); // true
 *
 * isSet(123); // false
 */
export function isSet(input: unknown): input is Set<unknown> {
  return input instanceof Set;
}

/**
 * Checks if the given input is a string.
 *
 * @param input - The input to check.
 * @returns True if the input is a string, false otherwise.
 *
 * @example
 * const str = 'Hello';
 * isString(str); // true
 *
 * isString(123); // false
 */
export function isString(input: unknown): input is string {
  return typeof input === 'string';
}

/**
 * Checks if the given input is a symbol.
 *
 * @param input - The input to check
 * @returns True if the input is a symbol, false otherwise
 *
 * @example
 * const sym = Symbol('foo');
 * isSymbol(sym); // true
 *
 * isSymbol('foo'); // false
 */
export function isSymbol(input: unknown): input is symbol {
  return typeof input === 'symbol';
}

/**
 * Checks if the given input is undefined.
 *
 * @param input - The input to check
 * @returns True if the input is undefined, false otherwise
 *
 * @example
 * let x;
 * isUndefined(x); // true
 *
 * isUndefined(null); // false
 */
export function isUndefined(input: unknown): input is undefined {
  return typeof input === 'undefined';
}

/**
 * Checks if the given input is a WeakMap object.
 *
 * @param input - The input to check
 * @returns True if the input is a WeakMap object, false otherwise
 *
 * @example
 * const weakMap = new WeakMap();
 * isWeakMap(weakMap); // true
 *
 * isWeakMap(123); // false
 */
export function isWeakMap(input: unknown): input is WeakMap<object, unknown> {
  return input instanceof WeakMap;
}

/**
 * Checks if the given input is a WeakSet object.
 *
 * @param input - The input to check
 * @returns True if the input is a WeakSet object, false otherwise
 *
 * @example
 * const weakSet = new WeakSet();
 * isWeakSet(weakSet); // true
 *
 * isWeakSet(123); // false
 */
export function isWeakSet(input: unknown): input is WeakSet<object> {
  return input instanceof WeakSet;
}
