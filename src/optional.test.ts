import { describe, expect, it, vitest } from 'vitest';
import { NoSuchElementException } from './exceptions';
import { Optional } from './optional';

describe('Optional', () => {
  describe('Optional.empty', () => {
    it('should create a new empty Optional', () => {
      const result = Optional.empty();
      expect(result).toBeInstanceOf(Optional);
    });

    it('should not have a value', () => {
      const result = Optional.empty();
      expect(result.isPresent()).toBeFalsy();
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
  });

  describe('Optional.ofNullable', () => {
    it('should create a new Optional', () => {
      const result = Optional.ofNullable('string');
      expect(result).toBeInstanceOf(Optional);
    });

    it('should create a new empty Optional when provided null as value', () => {
      const result = Optional.ofNullable(null);
      expect(result).toBeInstanceOf(Optional);
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

      expect(result).toBeTruthy();
    });

    it('should return false when the value of another optional is different', () => {
      const a = Optional.of('Test value');
      const b = Optional.of('Different value');

      const result = a.equals(b);

      expect(result).toBeFalsy();
    });

    it('should work for arrays', () => {
      const a = Optional.of([1, 2, 3]);
      const b = Optional.of([1, 2, 3]);

      const result = a.equals(b);

      expect(result).toBeTruthy();
    });

    it('should work for objects', () => {
      const a = Optional.of({ name: 'hello' });
      const b = Optional.of({ name: 'hello' });

      const result = a.equals(b);

      expect(result).toBeTruthy();
    });
  });

  describe('filter', () => {
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
      expect(result.isPresent()).toBeFalsy();
    });

    it('should return an empty Optional if the value is not present', () => {
      const optional = Optional.empty<string>();

      const result = optional.filter((val) => val.includes('Contains'));

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBeFalsy();
    });
  });

  describe('flatMap', () => {
    it('should call the mapping function when a value is present', () => {
      const optional = Optional.of('Test value');
      const spy = vitest.fn();

      optional.flatMap(spy);

      expect(spy).toHaveBeenCalledWith('Test value');
    });

    it('should not call the mapping function when the value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      optional.flatMap(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should return an empty Optional when the value is missing', () => {
      const optional = Optional.ofNullable(null);
      const spy = vitest.fn();

      const result = optional.flatMap(spy);

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBeFalsy();
    });

    it('should apply the mapping function when a value is present', () => {
      const optional = Optional.of(Optional.of('a string'));

      const result = optional.flatMap((value) => value);

      expect(result).toBeInstanceOf(Optional);
      expect(result.get()).toBe('a string');
    });
  });

  describe('get', () => {
    it('should return the value when present', () => {
      const result = Optional.of('Test value');
      expect(result.get()).toBe('Test value');
    });

    it('should throw a NoSuchElementException when no value is present', () => {
      const result = Optional.ofNullable(null);
      expect(() => result.get()).toThrow(NoSuchElementException);
    });
  });

  describe('ifPresent', () => {
    it('should apply the provided function when a value is present', () => {
      const optional = Optional.of('Test value');
      const spy = vitest.fn();

      optional.ifPresent(spy);

      expect(spy).toHaveBeenCalledWith('Test value');
    });

    it('should not apply the provided function when a value is missing', () => {
      const optional = Optional.ofNullable(null);
      const spy = vitest.fn();

      optional.ifPresent(spy);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('isPresent', () => {
    it('should return true when a value is present', () => {
      const optional = Optional.of('Test value');

      const result = optional.isPresent();

      expect(result).toBeTruthy();
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

      expect(result).toBeTruthy();
    });

    it('should return false when a value is missing', () => {
      const optional = Optional.ofNullable(null);

      const result = optional.isPresent();

      expect(result).toBeFalsy();
    });
  });

  describe('map', () => {
    it('should call the mapping function when a value is present', () => {
      const optional = Optional.of('Test value');
      const spy = vitest.fn();

      optional.map(spy);

      expect(spy).toHaveBeenCalledWith('Test value');
    });

    it('should not call the mapping function when the value is missing', () => {
      const optional = Optional.empty();
      const spy = vitest.fn();

      optional.map(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should return an empty Optional when the value is missing', () => {
      const optional = Optional.ofNullable(null);
      const spy = vitest.fn();

      const result = optional.map(spy);

      expect(result).toBeInstanceOf(Optional);
      expect(result.isPresent()).toBeFalsy();
    });

    it('should apply the mapping function when a value is present', () => {
      const optional = Optional.of(Optional.of('a string'));

      const result = optional.map((value) => value);

      expect(result).toBeInstanceOf(Optional);
      expect(result.get()).toBeInstanceOf(Optional);
    });
  });

  describe('orElse', () => {
    it('should return the original value when a value is present', () => {
      const optional = Optional.of('Test string');

      const result = optional.orElse('Different string');

      expect(result).toBe('Test string');
    });

    it('should return the alternative value when the original value is missing', () => {
      const optional = Optional.ofNullable<string>(null);

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

    it('should call the provided function when a value is missing', () => {
      const optional = Optional.ofNullable(null);
      const spy = vitest.fn();
      optional.orElseGet(spy);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should return the value of the provided function when a value is missing', () => {
      const optional = Optional.ofNullable<string>(null);
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

    it('should not call the provided function when a value is present', () => {
      const optional = Optional.of('Test string');
      const spy = vitest.fn();
      optional.orElseThrow(spy);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should call the provided function when a value is missing', () => {
      const optional = Optional.ofNullable(null);
      const spy = vitest.fn().mockReturnValue(new Error('Custom error'));

      expect(() => optional.orElseThrow(spy)).toThrow();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should throw the error of the provided function when a value is missing', () => {
      const optional = Optional.ofNullable<string>(null);

      expect(() =>
        optional.orElseThrow(() => new Error('Custom error'))
      ).toThrow('Custom error');
    });
  });
});
