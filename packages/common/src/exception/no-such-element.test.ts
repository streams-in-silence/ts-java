import { describe, expect, it } from 'vitest';
import { NoSuchElementException } from './no-such-element';

describe('NoSuchElementException', () => {
  it('should have NoSuchElementException as a name', () => {
    const exception = new NoSuchElementException();
    expect(exception.name).toBe('NoSuchElementException');
  });

  it('should have a stackTrace', () => {
    const exception = new NoSuchElementException();
    expect(exception.stack).toBeDefined();
  });

  it('should be possible to provide a detailed message', () => {
    const exception = new NoSuchElementException('Details');
    expect(exception.message).toBe('Details');
  });
});
