import { describe, expect, it } from 'vitest';
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
});
