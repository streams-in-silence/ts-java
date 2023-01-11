import { isPrimitive } from './typeguards';

export function isEqual(a: unknown, b: unknown): boolean {
  if (isPrimitive(a) && isPrimitive(b)) {
    return a === b;
  }

  return JSON.stringify(a) === JSON.stringify(b);
}
