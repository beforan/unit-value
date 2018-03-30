import { expect } from "chai";
import UnitValue, { getValuesAndUnits } from "../lib/unit-value";
import UnitsError from "../lib/units-error";

describe("getValuesAndUnits", () => {
  [[1, 2], ["4", "5"], [6, "7"], ["8", 9]].forEach(([v1, v2]) =>
    it("should throw UnitsError if no units are specified", () => {
      expect(() => getValuesAndUnits(v1, v2)).to.throw(UnitsError);
    })
  );

  [["a", 2], ["b", "5"], [6, "c"], [8, "d"]].forEach(([v1, v2]) =>
    it("should rethrow TypeErrors", () => {
      expect(() => getValuesAndUnits(v1, v2)).to.throw(TypeError);
    })
  );

  [
    ["2px", "10em"],
    [new UnitValue(2, "px"), new UnitValue(10, "em")],
    ["2px", new UnitValue(10, "em")],
    [new UnitValue(2, "px"), "10em"]
  ].forEach(([v1, v2]) =>
    it("should throw UnitsError if values have non-matching units and no explicit units given", () => {
      expect(() => getValuesAndUnits(v1, v2)).to.throw(UnitsError);
    })
  );

  [
    ["2px", "10em"],
    [new UnitValue(2, "px"), new UnitValue(10, "em")],
    ["2px", new UnitValue(10, "em")],
    [new UnitValue(2, "px"), "10em"]
  ].forEach(([v1, v2]) =>
    it("should throw UnitsError if values have non-matching units and no explicit units given", () => {
      expect(() => getValuesAndUnits(v1, v2)).to.throw(UnitsError);
    })
  );
});

describe("UnitValue", () => {
  describe("parseString", () => {
    [
      "abc",
      "%$£@&*(^()",
      "hel5432lo?!",
      "#hash1.5tag",
      "15  toomanyspaces",
      "1 1m",
      "1 .gda"
    ].forEach(input =>
      it("should throw TypeError if numberMatch finds no matches", () => {
        expect(() => UnitValue.parseString(input)).to.throw(TypeError);
      })
    );

    [
      ["10", "px"],
      ["1.5", "em"],
      ["4 ", "gold pieces"],
      ["1.6", "unit.of.fun.5"]
    ].forEach(([value, units]) =>
      it("should return a UnitValue with correct properties when numberMatch matches", () => {
        const uv = UnitValue.parseString(`${value}${units}`);

        expect(uv instanceof UnitValue).to.be.true;
        expect(uv.value).to.equal(parseFloat(value));
        expect(uv.units).to.equal(units);
      })
    );
  });

  describe("parse", () => {});
});
