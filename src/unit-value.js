import UnitsError from "./units-error";
import * as Utils from "./utils";

/**
 * Takes two UnitValue compatible values, with optional specified units
 * and returns the individual values and the resulting units string
 *
 * @private
 *
 * @param {number|Number|string|String|UnitValue} v1 The first value
 * @param {number|Number|string|String|UnitValue} v1 The second value
 * @param {string|String} [u] Units.
 *
 * Units are required if none of the values have units associated with them.
 *
 * If the values already have units and units are additionally specified,
 * the specified units will override those of the original values.
 */
const getValuesAndUnits = (v1, v2, u) => {
  const v = [v1, v2];
  const retry = [];
  const values = [];

  // try and get UnitValues for each value
  for (let i = 0; i < v.length; i++) {
    try {
      values[i] = UnitValue.parse(v[i], u);
    } catch (e) {
      // units missing? wait and try again later
      if (e instanceof UnitsError) retry.push(i);
      else throw e;
    }
  }

  // if only one value failed due to missing units,
  // we can use the units from the other one!
  // otherwise we need to throw
  switch (retry.length) {
    case 0:
      break;
    case 1:
      const [i] = retry;
      values[i] = UnitValue.parse(v[i], values[toggle(i)].units);
      break;
    default:
      throw new UnitsError(
        "At least one value should contain units, or separate units must be specified."
      );
  }

  // this can occur if both values contain different units and u is not specified
  if (values[0].units !== values[1].units)
    throw new Error(
      "The units of both values do not match. Please specify units."
    );

  return {
    value1: values[0].value,
    value2: values[1].value,
    units: values[0].units
  };
};

/**
 * A class representing a numeric value with associated units.
 *
 * Includes static helpers for maths and parsing strings of values with units.
 *
 * @class UnitValue
 *
 * @param {number} value The numeric value to represent.
 * @param {string} units The units of the value.
 *
 * @example
 * const uv = new UnitValue(10, "px");
 */
export default class UnitValue {
  constructor(value, units) {
    if (typeof value !== "number")
      throw new TypeError("Expected value to be a number");

    /**
     * The numeric value of the {@link UnitValue}
     *
     * @type {number}
     */
    this.value = value;

    /**
     * The units of the {@link UnitValue}
     *
     * @type {string}
     */
    this.units = units.toString();
  }

  /**
   * Parse a value and return a {@link UnitValue}, optionally overriding the units.
   *
   * @static
   * @param {number|Number|string|String|UnitValue} v The value
   * @param {string} [units] The units.
   *
   * Units are required if `v` has no units associated.
   *
   * If `v` already has units and units are additionally specified,
   * the specified units will override those of the original value.
   *
   * @example <caption>Parsing a combined string to a UnitValue</caption>
   * const uv = UnitValue.parse("10px");
   * // uv = { value: 10, units: "px" }
   * // uv.toString() = "10px"
   *
   * @example <caption>Parsing a number value to a UnitValue with specified units</caption>
   * const uv = UnitValue.parse(1.6, "em");
   * // uv = { value: 1.6, units: "em" }
   * // uv.toString() = "1.6em"
   *
   * @example <caption>Parsing an existing UnitValue and overriding the units</caption>
   * // This is probably an uncommon usage,
   * // but is valid as a side effect of how {@link UnitValue.parse} is used internally
   * const uv = UnitValue.parse(new UnitValue(10, "px"), "%");
   * // uv = { value: 10, units: "%" }
   * // uv.toString() = "10%"
   *
   * @returns {UnitValue} A {@link UnitValue} initialised with the results of parsing the value.
   */
  static parse(v, units) {
    let type;
    const badType = "Expected value to be a string, number or UnitValue";
    const missingUnits = "For values without units, units must be specified";

    // deal with javascript's messy type checking
    if (typeof v === "object") {
      if (v instanceof Number) type = "number";
      else if (v instanceof String) type = "string";
      else if (v instanceof UnitValue) type = "UnitValue";
      else throw new TypeError(badType);
    } else {
      type = typeof v;
    }

    // WARNING: This switch intentionally uses case fallthrough!
    switch (type) {
      case "number": // fall through to string
      case "string":
        v = v.toString(); // convert to a regular string (not String)
        if (v.match(Utils.numberMatch)) {
          // add units if there aren't any
          if (units == null) throw new UnitsError(missingUnits);
          v = v + units;
        }
        v = UnitValue.parseString(v); //make a UnitValue instance
      // fall through to UnitValue
      case "UnitValue":
        if (units) v.units = units; // override units if specified
        return v;
      default:
        throw new TypeError(badType);
    }
  }

  /**
   * Parses a `string` (*not* `String`) to a {@link UnitValue}.
   * The string must contain a value and units,
   * in the format: `<number><units>`
   * where:
   *
   * - number is required
   * - number is an `int` or a `float`
   * - number doesn't support Scientific Notation e.g. `1E2`
   * - units is required
   * - units is an arbitrary `string`
   * - units doesn't start with a number or a `.`
   *
   * Used internally by {@link UnitValue.parse} but can be used directly with valid input.
   *
   * @param {string} s The string to parse
   * @returns {UnitValue} A {@link UnitValue} initialised with the results of parsing the string.
   *
   * @example
   * const uv = UnitValue.parseString("10px");
   * // uv = { value: 10, units: "px" }
   * // uv.toString() = "10px"
   */
  static parseString(s) {
    if (typeof s !== "string")
      throw new TypeError("Expected a String to parse");

    const matches = s.match(Utils.unitValueMatch);
    if (matches === null)
      throw new TypeError(
        "The string passed doesn't look like <value><units> e.g. 10px"
      );

    return new UnitValue(matches[1], matches[2]);
  }

  /**
   * Implementing a custom {@link UnitValue#valueOf} means
   * we can use regular javascript math against the value,
   * but discard the units.
   *
   * Unlikely to be used directly, this is used by the javascript engine
   * when inferring that the type should be a number, for example in math operations.
   *
   * @return {number} The numeric value held by the UnitValue.
   *
   * @example <caption>
   * {@link UnitValue#valueOf} is called by the javascript engine
   * to allow the `+` operator to work normally on the object
   * </caption>
   * const uv = new UnitValue(10, "px");
   * const result = uv + 5; // result = 15
   */
  valueOf() {
    return this.value;
  }

  // we also provide common math helpers which RETAIN UNITS (or specify them)
  // including static versions to avoid unnecesasry manual instantiation of UnitValues

  /**
   * Adds the value `v` to the value of this {}
   * @param {*} v
   * @param {*} units
   */
  add(v, units) {
    return UnitValue.add(this, v, units);
  }
  static add(v1, v2, units) {
    const { value1, value2, units: u } = getValuesAndUnits(v1, v2, units);
    return new UnitValue(value1 + value2, u);
  }

  subtract(v, units) {
    return UnitValue.subtract(this, v, units);
  }
  static subtract(v1, v2, units) {
    const { value1, value2, units: u } = getValuesAndUnits(v1, v2, units);
    return new UnitValue(value1 - value2, u);
  }

  divide(v, units) {
    return UnitValue.divide(this, v, units);
  }
  static divide(v1, v2, units) {
    const { value1, value2, units: u } = getValuesAndUnits(v1, v2, units);
    return new UnitValue(value1 / value2, u);
  }

  multiply(v, units) {
    return UnitValue.multiply(this, v, units);
  }
  static multiply(v1, v2, units) {
    const { value1, value2, units: u } = getValuesAndUnits(v1, v2, units);
    return new UnitValue(value1 * value2, u);
  }

  toString() {
    return `${this.value}${this.units}`;
  }

  toArray() {
    return [this.value.toString(), this.units];
  }
}
