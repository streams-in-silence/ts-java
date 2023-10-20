// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isMap<T extends Map<unknown, unknown>>(value: unknown): value is T {
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

export function isNotNull<T>(value: T | null): value is T {
  return !isNull(value);
}

export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}
