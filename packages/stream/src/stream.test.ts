import { IllegalStateException } from '@ts-java/common/exception/illegal-state';
import { NullPointerException } from '@ts-java/common/exception/null-pointer';
import { isNumber, isString } from '@ts-java/common/typeguards';
import { Comparator } from '@ts-java/comparator';
import { Optional } from '@ts-java/optional';
import { describe, expect, it, vitest } from 'vitest';
import { Stream } from './stream';
import { BinaryOperator, type BiFunction } from './types';

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

        const iterator = Stream.generate(supplier).iterator();

        const first = iterator.next();
        expect(first.value).toBe(0);
        expect(supplier).toHaveBeenCalledTimes(1);

        const second = iterator.next();
        expect(second.value).toBe(1);
        expect(second.value).not.toBe(first.value);
        expect(supplier).toHaveBeenCalledTimes(2);
      });

      it('should return an infinite Stream', () => {
        const maxIterations = Math.floor(Math.random() * 9 + 1);

        expect.assertions(2 * maxIterations);
        const iterator = Stream.generate(() => Math.random()).iterator();

        let iteration = 0;

        while (iteration < maxIterations) {
          const next = iterator.next();

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
        const iterator = Stream.iterate('foo', (v: string) => {
          if (Math.random() < 0.5) {
            return v;
          }
          return v.toUpperCase();
        }).iterator();

        let iteration = 0;

        while (iteration < maxIterations) {
          const next = iterator.next();

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

  describe('iterator', () => {
    it('should return an iterator of the stream', () => {
      const iterator = Stream.of(1, 2, 3).iterator();

      expect(iterator).toBeInstanceOf(Iterator);
    });

    it('should allow to manually iterate over the elements of the stream', () => {
      const iterator = Stream.of(1, 2, 3).iterator();

      expect(iterator.next().value).toBe(1);
      expect(iterator.next().value).toBe(2);
      expect(iterator.next().value).toBe(3);
      expect(iterator.next().done).toBe(true);
    });

    it('should be a terminal operation', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.iterator();

      expect(() => stream.iterator()).toThrow(IllegalStateException);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.iterator()).toThrow(IllegalStateException);
    });
  });

  describe('allMatch', () => {
    it('should return true for an empty stream', () => {
      const result = Stream.empty().allMatch(() => true);

      expect(result).toBe(true);
    });

    it('should not evaluate the predicate for an empty stream', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 0;
        });

      Stream.empty<number>().allMatch(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should return true when all elements of the stream match the given predicate', () => {
      const result = Stream.of(1, 2, 3).allMatch(isNumber);

      expect(result).toBe(true);
    });

    it('should return false when one of the elements does not match the given predicate', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 1;
        });

      const result = Stream.of(1, 2, 3).allMatch(spy);

      expect(result).toBe(false);
    });

    it('should stop iterating when one of the elements does not match the given predicate', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 1;
        });

      Stream.of(1, 2, 3).allMatch(spy);

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
    });

    it('should be a terminal operation', () => {
      const spy = vitest.fn();
      Stream.of(1, 2, 3, 4)
        .onClose(spy)
        .allMatch(() => false);

      expect(spy).toHaveBeenCalled();
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.allMatch(vitest.fn())).toThrow(IllegalStateException);
    });
  });

  describe('anyMatch', () => {
    it('should return false for an empty stream', () => {
      const result = Stream.empty().anyMatch(() => true);

      expect(result).toBe(false);
    });

    it('should return true when one element of the stream matches the given predicate', () => {
      const result = Stream.of(1, 2, 3).anyMatch((v) => v % 2 === 0);

      expect(result).toBe(true);
    });

    it('should return false when none of the elements match the given predicate', () => {
      const result = Stream.of(1, 2, 3).anyMatch((v) => v > 3);

      expect(result).toBe(false);
    });

    it('should stop iterating as soon as the first element matches the given predicate', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 0;
        });

      Stream.of(1, 2, 3).anyMatch(spy);

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
    });

    it('should be a terminal operation', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.anyMatch(() => false);

      expect(() => stream.anyMatch(() => true)).toThrow(IllegalStateException);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.anyMatch(vitest.fn())).toThrow(IllegalStateException);
    });
  });

  describe('collect', () => {
    it.todo(
      'should reduce the elements of a stream using supplier, accumulator and combiner'
    );
    it.todo('should reduce the elements of a stream using a collector');
    it.todo('should return a mutable result');
    it.todo('should be a terminal operation');
    it.todo(
      'should throw an IllegalStateException when the stream was closed before'
    );
  });

  describe('count', () => {
    it('should return the count of elements in the stream', () => {
      const result = Stream.of(1, 2, 3, 4).count();

      expect(result).toBe(4);
    });

    it('should be a terminal operation', () => {
      const stream = Stream.of(1, 2, 3, 4);

      stream.count();

      expect(() => stream.count()).toThrow(IllegalStateException);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.count()).toThrow(IllegalStateException);
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

  describe('findAny', () => {
    it('should return an Optional describing any value of the stream', () => {
      const result = Stream.of(1, 2, 3, 4).findAny();

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(true);
      expect(result.orElseThrow()).toBeOneOf([1, 2, 3, 4]);
    });

    it('should return an empty Optional when the stream is empty', () => {
      const result = Stream.empty().findAny();

      expect(result).toBeInstanceOf(Optional);
      expect(result.isEmpty()).toBe(true);
    });

    it('should be a terminal operation', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.findAny();

      expect(() => stream.findAny()).toThrow(IllegalStateException);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.findAny()).toThrow(IllegalStateException);
    });
  });

  describe('findFirst', () => {
    it('should return an Optional describing the first value of the stream', () => {
      const result = Stream.of(4, 3, 2, 1).findFirst();

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(true);
      expect(result.orElseThrow()).toBe(4);
    });

    it('should return an empty Optional when the stream is empty', () => {
      const result = Stream.empty().findFirst();

      expect(result).toBeInstanceOf(Optional);
      expect(result.isEmpty()).toBe(true);
    });

    it('should be a terminal operation', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.findFirst();

      expect(() => stream.findFirst()).toThrow(IllegalStateException);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.findFirst()).toThrow(IllegalStateException);
    });
  });

  describe('flatMap', () => {
    it('should be an intermediate operation and return a new Stream', () => {
      const result = Stream.of([1, 2], [3, 4], [5, 6]).flatMap(Stream.ofArray);

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not run the mapper immediately', () => {
      const spy = vitest.fn((arr: number[]) => Stream.ofArray(arr));
      Stream.of([1, 2], [3, 4], [5, 6]).flatMap(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should run the mapper function on every element when the stream is consumed', () => {
      const spy = vitest.fn((arr: number[]) => Stream.ofArray(arr));
      const result = Stream.of([1, 2], [3, 4], [5, 6]).flatMap(spy).count();

      expect(spy).toHaveBeenNthCalledWith(1, [1, 2]);
      expect(spy).toHaveBeenNthCalledWith(2, [3, 4]);
      expect(spy).toHaveBeenNthCalledWith(3, [5, 6]);

      expect(result).toBe(6);
    });

    it('should iterate over all elements from the mapped stream before going to the next', () => {
      const iterator = Stream.of([1, 2], [3, 4], [5, 6])
        .flatMap(Stream.ofArray)
        .iterator();

      expect(iterator.next().value).toBe(1);
      expect(iterator.next().value).toBe(2);
      expect(iterator.next().value).toBe(3);
      expect(iterator.next().value).toBe(4);
      expect(iterator.next().value).toBe(5);
      expect(iterator.next().value).toBe(6);
    });

    it('should close the mapped stream when it is done iterating over all elements', () => {
      const firstOnClose = vitest.fn();
      const secondOnClose = vitest.fn();

      const iterator = Stream.of([1], [2])
        .flatMap((value) => {
          switch (value[0]) {
            case 1:
              return Stream.of(1, 3).onClose(firstOnClose);
            case 2:
              return Stream.of(2, 4).onClose(secondOnClose);
            default:
              return Stream.empty();
          }
        })
        .iterator();

      expect(iterator.next().value).toBe(1);
      expect(firstOnClose).not.toHaveBeenCalled();
      expect(secondOnClose).not.toHaveBeenCalled();

      expect(iterator.next().value).toBe(3);
      expect(firstOnClose).not.toHaveBeenCalled();
      expect(secondOnClose).not.toHaveBeenCalled();

      expect(iterator.next().value).toBe(2);
      expect(firstOnClose).toHaveBeenCalled();
      expect(secondOnClose).not.toHaveBeenCalled();

      expect(iterator.next().value).toBe(4);
      expect(secondOnClose).not.toHaveBeenCalled();

      expect(iterator.next().done).toBe(true);
      expect(secondOnClose).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('should call the callback on each element of the Stream', () => {
      const callback = vitest.fn();

      Stream.of(1, 2, 3, 4).forEach(callback);

      expect(callback).toHaveBeenNthCalledWith(1, 1);
      expect(callback).toHaveBeenNthCalledWith(2, 2);
      expect(callback).toHaveBeenNthCalledWith(3, 3);
      expect(callback).toHaveBeenNthCalledWith(4, 4);
    });

    it('should be a terminal operation', () => {
      const stream = Stream.of(1, 2, 3, 4);

      stream.forEach(vitest.fn());

      expect(() => stream.forEach(vitest.fn())).toThrow(IllegalStateException);
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.forEach(vitest.fn())).toThrow(IllegalStateException);
    });
  });

  describe('limit', () => {
    it('should return a new Stream', () => {
      const result = Stream.of(1, 2, 3).limit(10);

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not iterate immediately', () => {
      const spy = vitest.fn((num) => num);
      Stream.of(1, 2, 3).peek(spy).limit(10);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should truncate the Stream to be no longer than the maxSize in lenght', () => {
      const stream = Stream.of(1, 2, 3).limit(1);

      expect(stream.count()).toBe(1);
    });

    it('should return all elements of the Stream if the amount is smaller than the maxSize', () => {
      const stream = Stream.of(1, 2, 3).limit(10);

      expect(stream.count()).toBe(3);
    });

    it('should return an empty Stream if maxSize is 0', () => {
      const stream = Stream.of(1, 2, 3).limit(0);

      expect(stream.count()).toBe(0);
    });

    it('should throw an error if maxSize is NaN', () => {
      expect(() => Stream.of(1, 2, 3).limit(NaN)).toThrow(TypeError);
    });

    it('should throw an error if maxSize is negative', () => {
      expect(() => Stream.of(1, 2, 3).limit(-1)).toThrow(TypeError);
    });

    it('should throw an error if the maxSize is not a full number', () => {
      expect(() => Stream.of(1, 2, 3).limit(1.01)).toThrow(TypeError);
    });

    it('should not throw an error if the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3);

      stream.close();

      expect(() => stream.limit(10)).not.toThrow();
    });

    it('should be a short-circuiting Stream', () => {
      const spy = vitest.fn();
      const onClose = vitest.fn();

      Stream.iterate(1, (num) => num + 1)
        .limit(3)
        .onClose(onClose)
        .forEach(spy);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 3);

      expect(onClose).toHaveBeenCalledAfter(spy);
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

  describe('max', () => {
    it('should return an Optional', () => {
      const result = Stream.of(1, 3, 2).max(Comparator.naturalOrder());

      expect(result).toBeInstanceOf(Optional);
    });

    it('should return an Optional describing the maximum element of the stream according to the provided Comparator', () => {
      const result = Stream.of(1, 3, 2).max(Comparator.naturalOrder());

      expect(result.orElseThrow()).toBe(3);
    });

    it('should return an empty Optional if the stream is empty', () => {
      const result = Stream.empty().max(Comparator.naturalOrder());

      expect(result).toBeInstanceOf(Optional);
      expect(result.isEmpty()).toBe(true);
    });

    it('should be a terminal operation', () => {
      const spy = vitest.fn();

      Stream.of(1, 2, 3, 4).onClose(spy).max(Comparator.naturalOrder());

      expect(spy).toHaveBeenCalled();
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.max(Comparator.naturalOrder())).toThrow(
        IllegalStateException
      );
    });

    it('should throw a NullPointerException when the max element is null', () => {
      const stream = Stream.of(1, 2, 3, null);

      expect(() =>
        stream.max(Comparator.nullLast(Comparator.naturalOrder()))
      ).toThrow(NullPointerException);
    });
  });

  describe('min', () => {
    it('should return an Optional', () => {
      const result = Stream.of(1, 3, 2).min(Comparator.naturalOrder());

      expect(result).toBeInstanceOf(Optional);
    });

    it('should return an Optional describing the maximum element of the stream according to the provided Comparator', () => {
      const result = Stream.of(1, 3, 2).min(Comparator.naturalOrder());

      expect(result.orElseThrow()).toBe(1);
    });

    it('should return an empty Optional if the stream is empty', () => {
      const result = Stream.empty().min(Comparator.naturalOrder());

      expect(result).toBeInstanceOf(Optional);
      expect(result.isEmpty()).toBe(true);
    });

    it('should be a terminal operation', () => {
      const spy = vitest.fn();

      Stream.of(1, 2, 3, 4).onClose(spy).min(Comparator.naturalOrder());

      expect(spy).toHaveBeenCalled();
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.min(Comparator.naturalOrder())).toThrow(
        IllegalStateException
      );
    });

    it('should throw a NullPointerException when the max element is null', () => {
      const stream = Stream.of(1, 2, 3, null);

      expect(() =>
        stream.max(Comparator.nullLast(Comparator.naturalOrder()))
      ).toThrow(NullPointerException);
    });
  });

  describe('noneMatch', () => {
    it('should return true for an empty stream', () => {
      const result = Stream.empty().noneMatch(() => true);

      expect(result).toBe(true);
    });

    it('should not evaluate the predicate for an empty stream', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 0;
        });

      Stream.empty<number>().noneMatch(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should return true when no element of the stream matches the given predicate', () => {
      const result = Stream.of(1, 2, 3).noneMatch(isString);

      expect(result).toBe(true);
    });

    it('should return false when one of the elements matches the given predicate', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 0;
        });

      const result = Stream.of(1, 2, 3).allMatch(spy);

      expect(result).toBe(false);
    });

    it('should stop iterating when one of the elements matches the given predicate', () => {
      const spy = vitest
        .fn<(v: number) => boolean>()
        .mockImplementation((v) => {
          return v % 2 === 0;
        });

      Stream.of(1, 2, 3).noneMatch(spy);

      expect(spy).toHaveBeenCalledTimes(2);

      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
    });

    it('should be a terminal operation', () => {
      const spy = vitest.fn();
      Stream.of(1, 2, 3, 4)
        .onClose(spy)
        .noneMatch(() => true);

      expect(spy).toHaveBeenCalled();
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.noneMatch(vitest.fn())).toThrow(
        IllegalStateException
      );
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

  describe('reduce', () => {
    it('should return an Optional when only providing an accumulator', () => {
      const result = Stream.of(1, 2, 3).reduce((prev, curr) => prev + curr);

      expect(result).toBeInstanceOf(Optional);
    });

    it('should return an empty Optional when the stream is empty and only an accumulator was provided', () => {
      const result = Stream.empty<number>().reduce((prev, curr) => prev + curr);

      expect(result).toBeInstanceOf(Optional);
      expect(result.isEmpty()).toBe(true);
    });

    it('should return an Optional describing the result of the reduction of the elements of the stream', () => {
      const result = Stream.of(1, 2, 3).reduce((prev, curr) => prev + curr);

      expect(result).toBeInstanceOf(Optional);
      expect(result.orElseThrow()).toBe(6);
    });

    it('should perform a reduction on the elements of the stream using the provided accumulator', () => {
      const accumulator = vitest
        .fn<BinaryOperator<number>>()
        .mockImplementation((prev, curr) => prev + curr);

      Stream.of(1, 2, 3).reduce(accumulator);

      expect(accumulator).toHaveBeenNthCalledWith(1, 1, 2);
      expect(accumulator).toHaveBeenNthCalledWith(2, 3, 3);
    });

    it('should return the value of the provided identity if the stream is empty', () => {
      const accumulator = vitest
        .fn<BinaryOperator<number>>()
        .mockImplementation((prev, curr) => prev + curr);

      const result = Stream.empty<number>().reduce(10, accumulator);

      expect(result).toBe(10);
      expect(accumulator).not.toHaveBeenCalled();
    });

    it('should return the result of the reduction on the elements of the stream using the provided identity and the associative accumulator', () => {
      const result = Stream.of(1, 2, 3).reduce(10, (prev, curr) => prev + curr);

      expect(result).toBe(16);
    });

    it('should perform a reduction on the elements of the stream using the provided identity value and the associative accumulator', () => {
      const accumulator = vitest
        .fn<BinaryOperator<number>>()
        .mockImplementation((prev, curr) => prev + curr);

      Stream.of(1, 2, 3).reduce(10, accumulator);

      expect(accumulator).toHaveBeenNthCalledWith(1, 10, 1);
      expect(accumulator).toHaveBeenNthCalledWith(2, 11, 2);
      expect(accumulator).toHaveBeenNthCalledWith(3, 13, 3);
    });

    it('should return the result of the reduction on the elements of the stream when the accumulator maps the elements of the stream to the type of the identity', () => {
      const result = Stream.of('one', 'two', 'three').reduce(
        10,
        // maps from string to int
        (prev, curr) => prev + curr.length
      );

      expect(result).toBe(21);
    });

    it('should perform a reduction on the elements of the stream when the accumulator maps the elements of the stream to the type of the identity', () => {
      const accumulator = vitest
        .fn<BiFunction<number, string, number>>()
        .mockImplementation((prev, curr) => prev + curr.length);

      Stream.of('one', 'two', 'three').reduce(0, accumulator);

      expect(accumulator).toHaveBeenNthCalledWith(1, 0, 'one');
      expect(accumulator).toHaveBeenNthCalledWith(2, 3, 'two');
      expect(accumulator).toHaveBeenNthCalledWith(3, 6, 'three');
    });

    it('should throw a NullPointerException when the result of the reduction is null', () => {
      const stream = Stream.of(1, 2, 3, null);

      expect(() => stream.reduce(() => null)).toThrow(NullPointerException);
    });

    it('should be a terminal operation', () => {
      const spy = vitest.fn();
      Stream.of(1, 2, 3, 4)
        .onClose(spy)
        .reduce(() => 1);

      expect(spy).toHaveBeenCalled();
    });

    it('should throw an IllegalStateException when the stream was closed before', () => {
      const stream = Stream.of(1, 2, 3, 4);
      stream.close();

      expect(() => stream.reduce(() => 1)).toThrow(IllegalStateException);
    });
  });

  describe('skip', () => {
    it('should be an intermediate operation and return a new Stream', () => {
      const result = Stream.of(1, 2, 3).skip(2);

      expect(result).toBeInstanceOf(Stream);
    });

    it('should not iterate over the elements immediately', () => {
      const spy = vitest.fn();

      Stream.of(1, 2, 3).peek(spy).skip(2);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should discard the first n elements of the stream', () => {
      const iterator = Stream.of(1, 2, 3).skip(2).iterator();

      expect(iterator.next().value).toBe(3);
      expect(iterator.next().done).toBe(true);
    });

    it('should not pass the discarded elements to the next stream', () => {
      const beforeSpy = vitest.fn();
      const afterSpy = vitest.fn();

      const result = Stream.of(1, 2, 3)
        .peek(beforeSpy)
        .skip(2)
        .peek(afterSpy)
        .count();

      expect(result).toBe(1);
      expect(beforeSpy).toHaveBeenCalledTimes(3);
      expect(afterSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw a TypeError if the provided number is smaller than 0', () => {
      expect(() => Stream.of(1, 2, 3).skip(-1)).toThrow(TypeError);
    });

    it('should throw a TypeError if the provided value is NaN', () => {
      expect(() => Stream.of(1, 2, 3).skip(NaN)).toThrow(TypeError);
    });

    it('should throw a TypeError if the provided value is not an integer', () => {
      expect(() => Stream.of(1, 2, 3).skip(1.5)).toThrow(TypeError);
    });
  });
});
