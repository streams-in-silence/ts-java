import { describe, expect, it } from 'vitest';
import { NullPointerException } from './null-pointer';

describe('NullPointerException', () => {
  it('should have NullPointerException as a name', () => {
    const exception = new NullPointerException();
    expect(exception.name).toBe('NullPointerException');
  });

  it('should have a stackTrace', () => {
    const exception = new NullPointerException();
    expect(exception.stack).toBeDefined();
  });

  it('should be possible to provide a detailed message', () => {
    const exception = new NullPointerException('Details');
    expect(exception.message).toBe('Details');
  });
});
