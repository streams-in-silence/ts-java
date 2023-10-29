import { Comparable } from '../comparable';
import { AnyFunction } from './types';

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isMap<T extends Map<unknown, unknown>>(
  value: unknown
): value is T {
  return value instanceof Map;
}

export function isSet<T extends Set<unknown>>(value: unknown): value is T {
  return value instanceof Set;
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && isNotNull(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return !isNull(value);
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNone<T>(value: T): value is Extract<T, undefined | null> {
  return value === undefined || value === null;
}

export function isPresent<T>(value: T): value is Exclude<T, undefined | null> {
  return !isNone(value);
}

export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}

export function isNotFunction<T>(value: T): value is Exclude<T, AnyFunction> {
  return !isFunction(value);
}

export function isComparable<T>(value: unknown): value is Comparable<T> {
  return isObject(value) && 'compareTo' in value && isFunction(value.compareTo);
}

export function isClass(value: unknown): value is { constructor: AnyFunction } {
  return (
    typeof value === 'object' && value !== null && isFunction(value.constructor)
  );
}

export function isSameClass<T, U>(value: T, other: U): value is T & U {
  return (
    isClass(value) && isClass(other) && value.constructor === other.constructor
  );
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isSameType<T, U>(value: T, other: U): value is T & U {
  return isSameClass(value, other) || typeof value === typeof other;
}
