import { expect } from "chai";
import { getValuesAndUnits } from "../lib/unit-value";
import UnitValue from "../lib";
import UnitsError from "../lib/units-error";

describe("getValuesAndUnits", () => {
  // TODO positive tests? theoretically the math helpers cover that

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
});

describe("UnitValue", () => {
  ["2", "abc", true, null, undefined, new Number(1)].forEach(input =>
    it("should throw a TypeError if value is not a number", () => {
      expect(() => new UnitValue(input, "px")).to.throw(TypeError);
    })
  );

  describe("toString()", () => {
    it("should return a string in the form <value><units>", () => {
      expect(new UnitValue(2, "px").toString()).to.equal("2px");
    });
  });

  describe("toArray()", () => {
    it("should return an array in the form [ value, units ]", () => {
      expect(new UnitValue(2, "px").toArray().toString()).to.equal(
        [2, "px"].toString()
      );
    });
  });

  describe("parseString()", () => {
    [2, 3.4, true, null, undefined, new String("1")].forEach(input =>
      it("should throw a TypeError if s is not a string", () => {
        expect(() => UnitValue.parseString(input)).to.throw(TypeError);
      })
    );

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

  describe("parse", () => {
    it("should return an semantically identical UnitValue when parsing a UnitValue without explicit units", () => {
      const result = UnitValue.parse(new UnitValue(2, "px"));
      expect(result.toString()).to.equal("2px");
      expect(result instanceof UnitValue).to.be.true;
    });

    it("should return a UnitValue with correct values when parsing a UnitValue with explicit units", () => {
      const result = UnitValue.parse(new UnitValue(2, "px"), "em");
      expect(result.toString()).to.equal("2em");
      expect(result instanceof UnitValue).to.be.true;
    });

    [1, 2.3, new Number(4), new Number(5.6)].forEach(input =>
      it("should return a UnitValue with correct values when parsing a number or Number with explicit units", () => {
        const result = UnitValue.parse(input, "em");
        expect(result.toString()).to.equal(`${input.toString()}em`);
        expect(result instanceof UnitValue).to.be.true;
      })
    );

    ["1", "2.3", new String("4"), new String("5.6")].forEach(input =>
      it("should return a UnitValue with correct values when parsing a unitless string or String with explicit units", () => {
        const result = UnitValue.parse(input, "em");
        expect(result.toString()).to.equal(`${input}em`);
        expect(result instanceof UnitValue).to.be.true;
      })
    );

    ["1px", "2.3em", new String("4%"), new String("5.6cm")].forEach(input =>
      it("should return a UnitValue with correct values when parsing a string or String with implicit units", () => {
        const result = UnitValue.parse(input);
        expect(result.toString()).to.equal(input.toString());
        expect(result instanceof UnitValue).to.be.true;
      })
    );

    [
      ["1px", "em", "1em"],
      ["2.3em", "px", "2.3px"],
      [new String("4%"), "yalms", "4yalms"],
      [new String("5.6cm"), "ilms", "5.6ilms"]
    ].forEach(([value, units, output]) =>
      it("should return a UnitValue with correct values when parsing a string or String with implicit and explicit units", () => {
        const result = UnitValue.parse(value, units);
        expect(result.toString()).to.equal(output);
        expect(result instanceof UnitValue).to.be.true;
      })
    );

    it("should throw a TypeError if passed an object type other than Number, String or UnitValue", () => {
      expect(() => UnitValue.parse(new Date())).to.throw(TypeError);
    });

    it("should throw a TypeError if passed a type other than number, string or object", () => {
      expect(() => UnitValue.parse(undefined)).to.throw(TypeError);
    });
  });

  describe("add() (static)", () => {
    // TODO more cases?
    [{ v1: 1, v2: 2, units: "px", output: "3px" }].forEach(
      ({ v1, v2, units, output }) =>
        it("should return a UnitValue for the sum of two values with explicit or implicit units", () => {
          const result = UnitValue.add(v1, v2, units);
          expect(result.toString()).to.equal(output);
          expect(result instanceof UnitValue).to.be.true;
        })
    );
  });

  describe("subtract() (static)", () => {
    // TODO more cases?
    [{ v1: 5, v2: 2, units: "px", output: "3px" }].forEach(
      ({ v1, v2, units, output }) =>
        it("should return a UnitValue for the difference between two values with explicit or implicit units", () => {
          const result = UnitValue.subtract(v1, v2, units);
          expect(result.toString()).to.equal(output);
          expect(result instanceof UnitValue).to.be.true;
        })
    );
  });

  describe("multiply() (static)", () => {
    // TODO more cases?
    [{ v1: 1.5, v2: 2, units: "px", output: "3px" }].forEach(
      ({ v1, v2, units, output }) =>
        it("should return a UnitValue for two values multiplied together with explicit or implicit units", () => {
          const result = UnitValue.multiply(v1, v2, units);
          expect(result.toString()).to.equal(output);
          expect(result instanceof UnitValue).to.be.true;
        })
    );
  });

  describe("divide() (static)", () => {
    // TODO more cases?
    [{ v1: 6, v2: 2, units: "px", output: "3px" }].forEach(
      ({ v1, v2, units, output }) =>
        it("should return a UnitValue for v1 divided by v2 with explicit or implicit units", () => {
          const result = UnitValue.divide(v1, v2, units);
          expect(result.toString()).to.equal(output);
          expect(result instanceof UnitValue).to.be.true;
        })
    );
  });
});
