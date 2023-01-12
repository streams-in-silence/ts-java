import equals from 'lodash/isEqual';

export function isEqual(a: unknown, b: unknown): boolean {
  return equals(a, b);
}
