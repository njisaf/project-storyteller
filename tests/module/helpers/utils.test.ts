import { calculateModifier, validateNumericField, deepClone } from '../../../module/helpers/utils';

describe('Utility Functions', () => {
  describe('calculateModifier', () => {
    test('should calculate positive modifiers correctly', () => {
      expect(calculateModifier(6)).toBe(2);
      expect(calculateModifier(9)).toBe(3);
      expect(calculateModifier(3)).toBe(1);
    });

    test('should calculate negative modifiers correctly', () => {
      expect(calculateModifier(-3)).toBe(-1);
      expect(calculateModifier(-6)).toBe(-2);
    });

    test('should handle zero and edge cases', () => {
      expect(calculateModifier(0)).toBe(0);
      expect(calculateModifier(2)).toBe(0);
      expect(calculateModifier(-2)).toBe(0);
    });
  });

  describe('validateNumericField', () => {
    test('should validate numeric input', () => {
      expect(validateNumericField('123')).toBe(123);
      expect(validateNumericField('-45')).toBe(-45);
      expect(validateNumericField('0')).toBe(0);
    });

    test('should handle invalid input', () => {
      expect(validateNumericField('abc')).toBe(0);
      expect(validateNumericField('')).toBe(0);
      expect(validateNumericField('12.34')).toBe(12);
    });

    test('should respect min and max values', () => {
      expect(validateNumericField('150', { max: 100 })).toBe(100);
      expect(validateNumericField('-50', { min: -20 })).toBe(-20);
      expect(validateNumericField('75', { min: 0, max: 100 })).toBe(75);
    });
  });

  describe('deepClone', () => {
    test('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('test')).toBe('test');
      expect(deepClone(true)).toBe(true);
    });

    test('should clone arrays', () => {
      const original = [1, 'two', { three: 3 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).toEqual(original[2]);
      expect(cloned[2]).not.toBe(original[2]);
    });

    test('should clone objects', () => {
      const original = {
        a: 1,
        b: { c: 2 },
        d: [3, { e: 4 }]
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).toEqual(original.b);
      expect(cloned.b).not.toBe(original.b);
      expect(cloned.d).toEqual(original.d);
      expect(cloned.d).not.toBe(original.d);
    });

    test('should handle null and undefined', () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });
  });
});
