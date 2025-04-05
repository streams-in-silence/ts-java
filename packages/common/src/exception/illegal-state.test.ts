import { describe, expect, it } from 'vitest';
import { IllegalStateException } from './illegal-state';

describe('IllegalStateException', () => {
  it('should have IllegalStateException as a name', () => {
    const exception = new IllegalStateException();
    expect(exception.name).toBe('IllegalStateException');
  });

  it('should have a stackTrace', () => {
    const exception = new IllegalStateException();
    expect(exception.stack).toBeDefined();
  });

  it('should be possible to provide a detailed message', () => {
    const exception = new IllegalStateException('Details');
    expect(exception.message).toBe('Details');
  });
});
