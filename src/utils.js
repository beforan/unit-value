/**
 * RegEx pattern that matches a string
 * formatted exactly like a number (`int` or `float`)
 * and nothing else (e.g. doesn't behave like `parseFloat()`)
 *
 * @private
 */
export const numberMatch = /^(\d+\.?\d*)$/;

/**
 * RegEx pattern that matches a string
 * formatted exactly like `<number><units>`
 * where:
 *
 * - number is required
 * - number is an `int` or a `float`
 * - number doesn't support Scientific Notation e.g. `1E2`
 * - units is required
 * - units is an arbitrary `string`
 * - units doesn't start with a number or a `.`
 * - `<number>` and `<units>` are optionally separated by a single whitespace character
 *
 * @private
 */
export const unitValueMatch = /^(\d+\.?\d*)\s?([^\s\d\.].*)$/;

/**
 * Used to toggle a 1 to a 2 or a 2 to a 1.
 *
 * @private
 * @param {number} v a numeric value, ideally 1 or 2
 * @returns 1 for Even numbers, 2 for Odd numbers
 */
export const toggle = v => v % 2 + 1;
