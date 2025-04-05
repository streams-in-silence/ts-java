import { IllegalStateException } from '@ts-java/common/exception/illegal-state';
import { describe, expect, it, vitest } from 'vitest';
import { Stream } from './stream';

describe('Stream', () => {
  describe('static', () => {
    describe('concat', () => {
      it('should create a new Stream', () => {
        const result = Stream.concat(Stream.empty(), Stream.empty());

        expect(result).toBeInstanceOf(Stream);
      });

      it('should create a lazily concatenated Stream', () => {
        const spyOnA = vitest.fn();
        const spyOnB = vitest.fn();

        Stream.concat(Stream.of(1).peek(spyOnA), Stream.of(2).peek(spyOnB));

        expect(spyOnA).not.toHaveBeenCalled();
        expect(spyOnB).not.toHaveBeenCalled();
      });

      it('should create a new Stream whose elements are all elements from the first stream, followed by the second stream', () => {
        const iterator = Stream.concat(
          Stream.of(1, 3),
          Stream.of(2, 4)
        ).iterator();

        expect(iterator.next().value).toBe(1);
        expect(iterator.next().value).toBe(3);
        expect(iterator.next().value).toBe(2);
        expect(iterator.next().value).toBe(4);

        expect(iterator.next().done).toBe(true);
      });

      it.skip('should create a new Stream whose elements are ordered if both provided streams are ordered', () => {
        const iterator = Stream.concat(
          Stream.of(1, 3).sorted(),
          Stream.of(2, 4).sorted()
        ).iterator();

        expect(iterator.next().value).toBe(1);
        expect(iterator.next().value).toBe(2);
        expect(iterator.next().value).toBe(3);
        expect(iterator.next().value).toBe(4);

        expect(iterator.next().done).toBe(true);
      });
    });

    describe('empty', () => {
      it('should create a new empty Stream', () => {
        const result = Stream.empty();

        expect(result).toBeInstanceOf(Stream);
        expect(result.count()).toBe(0);
      });
    });

    describe('generate', () => {
      it('should create a new Stream from the provided supplier', () => {
        const result = Stream.generate(() => 'foo');

        expect(result).toBeInstanceOf(Stream);
      });

      it('should use the supplier to provide the value when iterating', () => {
        let count = 0;
        const supplier = vitest.fn().mockImplementation(() => {
          return count++;
        });

        const stream = Stream.generate(supplier);

        const first = stream.iterator().next();
        expect(first.value).toBe(0);
        expect(supplier).toHaveBeenCalledTimes(1);

        const second = stream.iterator().next();
        expect(second.value).toBe(1);
        expect(second.value).not.toBe(first.value);
        expect(supplier).toHaveBeenCalledTimes(2);
      });

      it('should return an infinite Stream', () => {
        const maxIterations = Math.floor(Math.random() * 9 + 1);

        expect.assertions(2 * maxIterations);
        const stream = Stream.generate(() => Math.random());

        let iteration = 0;

        while (iteration < maxIterations) {
          const next = stream.iterator().next();

          expect(next.value).toBeDefined();
          expect(next.done).toBe(false);
          iteration++;
        }
      });
    });

    describe('iterate', () => {
      it('should create a new Stream from the provided function', () => {
        const result = Stream.iterate('foo', () => 'bar');

        expect(result).toBeInstanceOf(Stream);
      });

      it('should return an infinite Stream', () => {
        const maxIterations = Math.floor(Math.random() * 9 + 1);

        expect.assertions(2 * maxIterations);
        const stream = Stream.iterate('foo', (v: string) => {
          if (Math.random() < 0.5) {
            return v;
          }
          return v.toUpperCase();
        });

        let iteration = 0;

        while (iteration < maxIterations) {
          const next = stream.iterator().next();

          expect(next.value).toBeDefined();
          expect(next.done).toBe(false);
          iteration++;
        }
      });

      it('should return the seed on the first iteration', () => {
        const spy = vitest.fn<(v: string) => string>().mockReturnValue('bar');
        const stream = Stream.iterate('foo', spy);

        expect(stream.iterator().next().value).toBe('foo');
      });

      it('should not call the provided function on the first iteration', () => {
        const spy = vitest.fn<(v: string) => string>().mockReturnValue('bar');
        const stream = Stream.iterate('foo', spy);

        stream.iterator().next();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should provide the return value of the function in the next interation', () => {
        const spy = vitest
          .fn<(v: string) => string>()
          .mockImplementation((v) => {
            switch (v) {
              case 'foo':
                return 'bar';
              case 'bar':
                return 'baz';
              case 'baz':
              default:
                return 'foo';
            }
          });

        const stream = Stream.iterate('foo', spy);
        const iterator = stream.iterator();

        expect(iterator.next().value).toBe('foo');
        expect(spy).not.toHaveBeenCalled();

        expect(iterator.next().value).toBe('bar');
        expect(spy).toHaveBeenNthCalledWith(1, 'foo');

        expect(iterator.next().value).toBe('baz');
        expect(spy).toHaveBeenNthCalledWith(2, 'bar');

        expect(iterator.next().value).toBe('foo');
        expect(spy).toHaveBeenNthCalledWith(3, 'baz');
      });
    });

    describe('of', () => {
      it('should create a new Stream from a single element', () => {
        const result = Stream.of('foo');

        expect(result).toBeInstanceOf(Stream);
        expect(result.count()).toBe(1);
      });

      it('should create a new Stream from multiple arguments', () => {
        const result = Stream.of('foo', 'bar', 'baz');

        expect(result).toBeInstanceOf(Stream);
        expect(result.count()).toBe(3);
      });

      it('should not unpack an array of elements into a new Stream', () => {
        const result = Stream.of([1, 2, 3]);

        expect(result).toBeInstanceOf(Stream);
        expect(result.count()).toBe(1);
      });
    });

    describe('ofArray', () => {
      it('should create a new Stream from an array', () => {
        const result = Stream.ofArray([1, 2, 3]);

        expect(result).toBeInstanceOf(Stream);
      });

      it('should create a new Stream that returns each element of the provided array', () => {
        const result = Stream.ofArray([1, 2, 3]);

        expect(result.count()).toBe(3);
      });
    });
  });

  describe('close', () => {
    it('should close the current stream', () => {
      const stream = Stream.of(1, 2, 3);

      stream.close();

      expect(() => stream.forEach(vitest.fn())).toThrow(IllegalStateException);
    });

    it('should invoke each onClose callback', () => {
      const onClose1 = vitest.fn();
      const onClose2 = vitest.fn();

      Stream.of(1, 2, 3).onClose(onClose1).onClose(onClose2).close();

      expect(onClose1).toHaveBeenCalled();
      expect(onClose2).toHaveBeenCalled();
    });

    it('should invoke each onClose callback in the order they were provided', () => {
      const spy = vitest.fn();
      const onClose1 = () => spy('first');
      const onClose2 = () => spy('second');

      Stream.of(1, 2, 3).onClose(onClose1).onClose(onClose2).close();

      expect(spy).toHaveBeenNthCalledWith(1, 'first');
      expect(spy).toHaveBeenNthCalledWith(2, 'second');
    });

    it('should not invoke the close handlers when the stream was already closed', () => {
      const onClose = vitest.fn();

      const stream = Stream.of(1, 2, 3).onClose(onClose);

      stream.close();
      stream.close();

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('filter', () => {
    it('should be an intermediate operation and return a new Stream', () => {
      const result = Stream.of(1, 2, 3).filter(vitest.fn());

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not run the filter immediately', () => {
      const spy = vitest.fn();
      Stream.of(1, 2, 3).filter(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should run the filter function on every element when the stream is consumed', () => {
      const spy = vitest.fn();
      Stream.of(1, 2, 3).filter(spy).forEach(vitest.fn());

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 3);
    });

    it('should not forward the element to the next stream when it does not match the predicate', () => {
      const spy = vitest.fn();

      Stream.of(1, 2, 3)
        .filter((num) => num % 2 === 0)
        .forEach(spy);

      expect(spy).toHaveBeenCalledExactlyOnceWith(2);
    });
  });

  describe('forEach', () => {
    it('should be a terminal operation and call the callback on each element of the Stream', () => {
      const callback = vitest.fn();

      Stream.of(1, 2, 3, 4).forEach(callback);

      expect(callback).toHaveBeenNthCalledWith(1, 1);
      expect(callback).toHaveBeenNthCalledWith(2, 2);
      expect(callback).toHaveBeenNthCalledWith(3, 3);
      expect(callback).toHaveBeenNthCalledWith(4, 4);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const callback = vitest.fn();

      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.forEach(callback)).toThrow(IllegalStateException);
    });
  });

  describe('map', () => {
    it('should be an intermediate operation and return a new Stream', () => {
      const result = Stream.of(1, 2, 3).map((num) => num * num);

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not run the mapper immediately', () => {
      const spy = vitest.fn((num) => num);
      Stream.of(1, 2, 3).map(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should run the mapper function on every element when the stream is consumed', () => {
      const spy = vitest.fn((num) => num);
      Stream.of(1, 2, 3).map(spy).count();

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 3);
    });
  });

  describe('peek', () => {
    it('should return a new Stream', () => {
      const result = Stream.of(1, 2, 3).peek(vitest.fn());

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not run the action immediately', () => {
      const spy = vitest.fn();

      Stream.of(1, 3, 2, 4).peek(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should run the action on every element when the stream is consumed', () => {
      const spy = vitest.fn();

      Stream.of(1, 3, 2, 4).peek(spy).forEach(vitest.fn());

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 3);
      expect(spy).toHaveBeenNthCalledWith(3, 2);
      expect(spy).toHaveBeenNthCalledWith(4, 4);
    });

    it('should return the value of the passed element', () => {
      const spy = vitest.fn();

      Stream.of(1, 3, 2, 4).peek(vitest.fn()).forEach(spy);

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 3);
      expect(spy).toHaveBeenNthCalledWith(3, 2);
      expect(spy).toHaveBeenNthCalledWith(4, 4);
    });
  });
});
