import { describe, expect, it, vitest } from 'vitest';
import { NoSuchElementException, NullPointerException } from './exceptions';
import { Optional } from './optional';

describe('Optional', () => {
  describe('Optional.empty', () => {
    it('should create a new empty Optional', () => {
      const result = Optional.empty();
      expect(result).toBeInstanceOf(Optional);
    });

    it('should not have a value', () => {
      const result = Optional.empty();
      expect(result.isPresent()).toBe(false);
    });
  });

  describe('Optional.of', () => {
    it('should create a new Optional', () => {
      const result = Optional.of('string');
      expect(result).toBeInstanceOf(Optional);
    });

    it('should set the parameter as the return value of the optional', () => {
      const result = Optional.of('Test value');
      expect(result.get()).toBe('Test value');
    });

    it('should throw a NullPointerException when the parameter is null', () => {
      expect(() => Optional.of(null)).toThrow(
        new NullPointerException('value must not be null')
      );
    });
  });

  describe('Optional.ofNullable', () => {
    it('should create a new Optional', () => {
      const result = Optional.ofNullable('string');
      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(true);
    });

    it('should create a new empty Optional when provided null as value', () => {
      const result = Optional.ofNullable(null);
      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(false);
    });

    it('should set the parameter as the return value of the optional', () => {
      const result = Optional.ofNullable('Test value');
      expect(result.get()).toBe('Test value');
    });
  });

  describe('equals', () => {
    it('should return true when the value of another optional is the same', () => {
      const a = Optional.of('Test value');
      const b = Optional.of('Test value');

      const result = a.equals(b);

      expect(result).toBe(true);
    });

    it('should return false when the value of another optional is different', () => {
      const a = Optional.of('Test value');
      const b = Optional.of('Different value');

      const result = a.equals(b);

      expect(result).toBe(false);
    });

    it('should return false when the value of the other optional is empty', () => {
      const a = Optional.of('Test value');
      const b = Optional.empty();

      const result = a.equals(b);

      expect(result).toBe(false);
    });

    it('should return false when the value is empty and the other optional is not', () => {
      const a = Optional.empty();
      const b = Optional.of('Test value');

      const result = a.equals(b);

      expect(result).toBe(false);
    });

    it('should work for arrays', () => {
      const a = Optional.of([1, 2, 3]);
      const b = Optional.of([1, 2, 3]);

      const result = a.equals(b);

      expect(result).toBe(true);
    });

    it('should work for objects', () => {
      const a = Optional.of({ name: 'hello' });
      const b = Optional.of({ name: 'hello' });

      const result = a.equals(b);

      expect(result).toBe(true);
    });

    it('should return false when comparing to different object', () => {
      const a = Optional.of('Test value');
      const b = {
        isPresent() {
          return true;
        },
        get() {
          return 'Test value';
        },
      };

      const result = a.equals(b);

      expect(result).toBe(false);
    });

    it('should return false when comparing two different types', () => {
      const a = Optional.of('Test value');
      const b = Optional.of(123);

      const result = a.equals(b);

      expect(result).toBe(false);
    });
  });

  describe('filter', () => {
    it('should throw a NullPointerException when the filter function is not provided', () => {
      const optional = Optional.of('Test string');

      // @ts-expect-error 'filter' expects a function that returns a boolean
      expect(() => optional.filter(null)).toThrow(
        new NullPointerException('filter must be a function')
      );
    });

    it('should return an Optional containing the value if the value is present and matches the filter', () => {
      const optional = Optional.of('Test string');

      const result = optional.filter((val) => val.includes('Test'));

      expect(result).toBeInstanceOf(Optional);
      expect(result.get()).toBe('Test string');
    });

    it('should return an empty Optional if the value is present and does not match the filter', () => {
      const optional = Optional.of('Test string');

      const result = optional.filter((val) => val.includes('Contains'));

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(false);
    });

    it('should return an empty Optional if the value is not present', () => {
      const optional = Optional.empty<string>();

      const result = optional.filter((val) => val.includes('Contains'));

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(false);
    });
  });

  describe('flatMap', () => {
    it('should return an empty Optional when the value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      const result = optional.flatMap(spy);

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(false);
    });

    it('should throw a NullPointerException when the mapping function is not provided', () => {
      const optional = Optional.of('Test string');

      // @ts-expect-error 'flatMap' expects a function that returns a boolean
      expect(() => optional.flatMap(null)).toThrow(
        new NullPointerException('mapper must be a function')
      );
    });

    it('should call the mapping function when a value is present', () => {
      const optional = Optional.of('Test value');
      const spy = vitest.fn().mockReturnValue(Optional.of('Other value'));

      optional.flatMap(spy);

      expect(spy).toHaveBeenCalledWith('Test value');
    });

    it('should not call the mapping function when the value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      optional.flatMap(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a NullPointerException when the mapping function does not return an Optional', () => {
      const optional = Optional.of(Optional.of('a string'));

      expect(() => optional.flatMap(vitest.fn())).toThrow(
        new NullPointerException('mapper must return an Optional')
      );
    });

    it('should return the value of the mapping function when is present', () => {
      const optional = Optional.of(Optional.of('a string'));

      const result = optional.flatMap(() => Optional.of('A STRING'));

      expect(result).toBeInstanceOf(Optional);
      expect(result.get()).toBe('A STRING');
    });
  });

  describe('get', () => {
    it('should return the value when present', () => {
      const result = Optional.of('Test value');
      expect(result.get()).toBe('Test value');
    });

    it('should throw a NoSuchElementException when no value is present', () => {
      const result = Optional.empty();
      expect(() => result.get()).toThrow(NoSuchElementException);
    });
  });

  describe('ifPresent', () => {
    it('should not apply the action function when a value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      optional.ifPresent(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a NullPointerException when the action function is not provided', () => {
      const optional = Optional.of('Test value');

      // @ts-expect-error 'ifPresent' expects a function
      expect(() => optional.ifPresent(null)).toThrow(
        new NullPointerException('action must be a function')
      );
    });

    it('should apply the action when a value is present', () => {
      const optional = Optional.of('Test value');
      const spy = vitest.fn();

      optional.ifPresent(spy);

      expect(spy).toHaveBeenCalledWith('Test value');
    });
  });

  describe('isPresent', () => {
    it('should return true when a value is present', () => {
      const optional = Optional.of('Test value');

      const result = optional.isPresent();

      expect(result).toBe(true);
    });

    it.each([
      { type: 'array', value: [] },
      { type: 'object', value: {} },
      { type: 'string', value: '' },
      { type: 'NaN', value: NaN },
      { type: 'zero number', value: 0 },
    ])('should work for empty $type', ({ value }) => {
      const optional = Optional.of(value);

      const result = optional.isPresent();

      expect(result).toBe(true);
    });

    it('should return false when a value is missing', () => {
      const optional = Optional.empty();

      const result = optional.isPresent();

      expect(result).toBe(false);
    });
  });

  describe('map', () => {
    it('should return an empty Optional when the value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      const result = optional.map(spy);

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBe(false);
    });

    it('should not call the mapping function when the value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      optional.map(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a NullPointerException when the mapping function is not provided', () => {
      const optional = Optional.of('Test value');

      // @ts-expect-error 'map' expects a function
      expect(() => optional.map(null)).toThrow(
        new NullPointerException('mapper must be a function')
      );
    });

    it('should call the mapping function with the value when it is present', () => {
      const optional = Optional.of('Test value');
      const spy = vitest.fn();

      optional.map(spy);

      expect(spy).toHaveBeenCalledWith('Test value');
    });

    it('should wrap the value of the mapping function in an Optional', () => {
      const optional = Optional.of(['a', 'b', 'c']);

      const result = optional.map((value) => value.length);

      expect(result).toBeInstanceOf(Optional);
      expect(result.get()).toBe(3);
    });
  });

  describe('or', () => {
    it('should return self if value is present', () => {
      const optional = Optional.of('value');

      const result = optional.or(() => Optional.of('default'));

      expect(result.get()).toBe('value');
    });

    it('should return the result of the supplier if value is not present', () => {
      const optional = Optional.empty<string>();

      const result = optional.or(() => Optional.of('default'));

      expect(result.get()).toBe('default');
    });

    it('should only call the supplier function if value is not present', () => {
      const spy = vitest.fn(() => Optional.of('default'));
      const optional = Optional.of('value');

      optional.or(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw if the supplier is not a function', () => {
      const optional = Optional.empty();

      expect(() => {
        // @ts-expect-error 'or' expects a function that returns an Optional
        optional.or(null);
      }).toThrow(NullPointerException);
    });

    it('should throw if the supplier function returns null', () => {
      const optional = Optional.empty();

      expect(() => {
        // @ts-expect-error 'or' expects a function that returns an Optional
        optional.or(() => null);
      }).toThrow(NullPointerException);
    });
  });

  describe('orElse', () => {
    it('should return the original value when a value is present', () => {
      const optional = Optional.of('Test string');

      const result = optional.orElse('Different string');

      expect(result).toBe('Test string');
    });

    it('should return the alternative value when the original value is missing', () => {
      const optional = Optional.empty<string>();

      const result = optional.orElse('Different string');

      expect(result).toBe('Different string');
    });
  });

  describe('orElseGet', () => {
    it('should return the original value when a value is present', () => {
      const optional = Optional.of('Test string');
      const spy = vitest.fn();
      const result = optional.orElseGet(spy);

      expect(result).toBe('Test string');
    });

    it('should not call the provided function when a value is present', () => {
      const optional = Optional.of('Test string');
      const spy = vitest.fn();
      optional.orElseGet(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a NullPointerException when the supplier function is not provided', () => {
      const optional = Optional.empty();

      // @ts-expect-error 'orElseGet' expects a function
      expect(() => optional.orElseGet(null)).toThrow(
        new NullPointerException('supplier must be a function')
      );
    });

    it('should call the supplier function when a value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();
      optional.orElseGet(spy);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should return the value of the supplier function when a value is missing', () => {
      const optional = Optional.empty<string>();
      const result = optional.orElseGet(() => 'Test string');

      expect(result).toBe('Test string');
    });
  });

  describe('orElseThrow', () => {
    it('should return the original value when a value is present', () => {
      const optional = Optional.of('Test string');
      const spy = vitest.fn();
      const result = optional.orElseThrow(spy);

      expect(result).toBe('Test string');
    });

    it('should not call the provided exceptionSupplier when a value is present', () => {
      const optional = Optional.of('Test string');
      const spy = vitest.fn();
      optional.orElseThrow(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw a NullPointerException when the exceptionSupplier is not provided', () => {
      const optional = Optional.empty();

      // @ts-expect-error 'orElseThrow' expects a function
      expect(() => optional.orElseThrow(null)).toThrow(
        new NullPointerException('exceptionSupplier must be a function')
      );
    });

    it('should call the exceptionSupplier when a value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn().mockReturnValue(new Error('Custom error'));

      expect(() => optional.orElseThrow(spy)).toThrow();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should throw the error of the exceptionSupplier when a value is missing', () => {
      const optional = Optional.empty<string>();

      expect(() =>
        optional.orElseThrow(() => new Error('Custom error'))
      ).toThrow('Custom error');
    });
  });

  describe('toString', () => {
    it('should return "Optional[empty]" for an empty Optional', () => {
      const optional = Optional.empty();
      expect(optional.toString()).toBe('Optional[null]');
    });

    it('should return "Optional[value]" for a non-empty Optional', () => {
      const optional = Optional.of('test');
      expect(optional.toString()).toBe('Optional[test]');
    });

    it('should call toString on the wrapped value', () => {
      const obj = { toString: () => 'obj' };
      const optional = Optional.of(obj);
      expect(optional.toString()).toBe('Optional[obj]');
    });

    it('should handle nested Optionals', () => {
      const inner = Optional.of('inner');
      const outer = Optional.of(inner);
      expect(outer.toString()).toBe('Optional[Optional[inner]]');
    });

    it('should handle null value', () => {
      const optional = Optional.ofNullable(null);
      expect(optional.toString()).toBe('Optional[null]');
    });
  });
});
