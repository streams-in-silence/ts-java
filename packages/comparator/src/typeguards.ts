import { isFunction } from '@ts-java/common/typeguards';
import type { AnyFunction } from '@ts-java/common/utils/types';
import type { Comparable } from './types';

export function isComparable<T>(value: unknown): value is Comparable<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'compareTo' in value &&
    isFunction(value.compareTo)
  );
}

export function isClass(value: unknown): value is { constructor: AnyFunction } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.constructor === 'function'
  );
}

export function isSameClass<T, U>(value: T, other: U): value is T & U {
  return (
    isClass(value) && isClass(other) && value.constructor === other.constructor
  );
}

export function isSameType<T, U>(value: T, other: U): value is T & U {
  return isSameClass(value, other) || typeof value === typeof other;
}
