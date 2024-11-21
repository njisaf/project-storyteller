interface NumericValidationOptions {
  min?: number;
  max?: number;
}

/**
 * Calculate the modifier for a given aspect value
 * @param value - The aspect value
 * @returns The calculated modifier
 */
export function calculateModifier(value: number): number {
  return Math.floor(value / 3);
}

/**
 * Validate and sanitize numeric input
 * @param input - The input string to validate
 * @param options - Optional validation constraints
 * @returns The validated number
 */
export function validateNumericField(input: string, options: NumericValidationOptions = {}): number {
  const num = parseInt(input) || 0;

  if (options.min !== undefined && num < options.min) {
    return options.min;
  }

  if (options.max !== undefined && num > options.max) {
    return options.max;
  }

  return num;
}

/**
 * Create a deep clone of an object or value
 * @param source - The source value to clone
 * @returns A deep clone of the source
 */
export function deepClone<T>(source: T): T {
  // Handle null and undefined
  if (source === null || source === undefined) {
    return source;
  }

  // Handle primitive types
  if (typeof source !== 'object') {
    return source;
  }

  // Handle arrays
  if (Array.isArray(source)) {
    return source.map(item => deepClone(item)) as unknown as T;
  }

  // Handle objects
  const clone = {} as T;
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      (clone as any)[key] = deepClone((source as any)[key]);
    }
  }

  return clone;
}
