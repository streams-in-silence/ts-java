import { isPrimitive } from './typeguards';

export function isEqual(a: unknown, b: unknown): boolean {
  if (isPrimitive(a) && isPrimitive(b)) {
    return a === b;
  }
  if (!isPrimitive(a) && !isPrimitive(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}
