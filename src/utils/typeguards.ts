type Primitive = string | number | boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isPrimitive(value: unknown): value is Primitive {
  return isBoolean(value) || isNumber(value) || isString(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}
