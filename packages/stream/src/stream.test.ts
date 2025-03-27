import { describe, expect, it, vitest } from 'vitest';
import { Stream } from './stream';

describe('Stream', () => {
  it('works', () => {
    const stream = Stream.of([1, 2, 3]);

    expect(stream.count()).toBe(3);
  });

  it("doesn't call the method", () => {
    const stream = Stream.of([1, 2, 3]);
    const filter = vitest.fn();

    stream.filter(filter);

    expect(filter).not.toHaveBeenCalled();
  });

  it('filters', () => {
    const stream = Stream.of([1, 2, 3, 4, 5]);
    const filter = vitest.fn((n: number) => n % 2 === 0);

    expect(stream.filter(filter).count()).toBe(2);
    expect(filter).toHaveBeenCalledTimes(5);
  });
});
