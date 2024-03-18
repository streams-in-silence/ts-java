import { isDate, isFunction, isMap, isObject, isSet } from '@sis/typeguards';

/**
 * Checks if two values are equal.
 * @param a
 * @param b
 * returns true if a and b are equal, false otherwise
 */
export function isEqual(a: unknown, b: unknown): a is typeof b {
  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }

  if (isMap(a) && isMap(b)) {
    return isEqual(Array.from(a.entries()), Array.from(b.entries()));
  }

  if (isSet(a) && isSet(b)) {
    return isEqual(Array.from(a), Array.from(b));
  }

  if (isFunction(a) && isFunction(b)) {
    return a.toString() === b.toString();
  }

  if (isObject(a) && isObject(b)) {
    const keysOfA = Object.keys(a) as Array<keyof typeof a>;
    const keysOfB = Object.keys(b);

    // compare object properties recursively
    return (
      keysOfA.length === keysOfB.length &&
      keysOfA.every((key) => isEqual(a[key], b[key]))
    );
  }

  return a === b;
}
