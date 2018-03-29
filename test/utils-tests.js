import { expect } from "chai";
import * as Utils from "../lib/utils";

describe("Utils", () => {
  describe("numberMatch", () => {
    it("should match an integer", () => {
      expect("5".match(Utils.numberMatch)).to.not.be.null;
    });

    it("should match a float with nothing after the decimal", () => {
      expect("5.".match(Utils.numberMatch)).to.not.be.null;
    });

    it("should match a float", () => {
      expect("5.2".match(Utils.numberMatch)).to.not.be.null;
    });

    it("should not match a decimal point only", () => {
      expect(".".match(Utils.numberMatch)).to.be.null;
    });

    ["abc", "%$£@&*(^()", "hello?!", "#hashtag"].forEach(input =>
      it("should not match a string with no numbers", () => {
        expect(input.match(Utils.numberMatch)).to.be.null;
      })
    );

    ["1abc", "%$£@&*(^()2.5", "hel8.76lo?!", "2#hash1tag6"].forEach(input =>
      it("should not match a string with numbers AND non-numbers", () => {
        expect(input.match(Utils.numberMatch)).to.be.null;
      })
    );
  });

  describe("unitValueMatch", () => {
    ["1em", "2.px", "3.4rem", "100%", "9.67mp3.6"].forEach(input =>
      it("should match <number><units>", () => {
        expect(input.match(Utils.unitValueMatch)).to.not.be.null;
      })
    );

    ["1 em", "2. px", "3.4 rem", "100 %", "9.67 mp3.6"].forEach(input =>
      it("should match <number> <units> (with separating whitespace)", () => {
        expect(input.match(Utils.unitValueMatch)).to.not.be.null;
      })
    );

    ["1 1em", "2. 2px", "3.4 3rem", "100 4%", "9.67 .mp3.6"].forEach(input =>
      it("should not match <number> <units> (with separating whitespace) when units starts with a number or .", () => {
        expect(input.match(Utils.unitValueMatch)).to.be.null;
      })
    );

    ["1", "2.", "3.4"].forEach(input =>
      it("should not match <number>", () => {
        expect(input.match(Utils.unitValueMatch)).to.be.null;
      })
    );

    ["a", "xyz", "%"].forEach(input =>
      it("should not match <units>", () => {
        expect(input.match(Utils.unitValueMatch)).to.be.null;
      })
    );

    it("should not match '.'", () => {
      expect(".".match(Utils.unitValueMatch)).to.be.null;
    });
  });

  describe("toggle", () => {
    it("should obey basic maths and return `1` for `2`", () => {
      expect(Utils.toggle(1)).to.equal(2);
    });

    it("should obey basic maths and return `2` for `1`", () => {
      expect(Utils.toggle(2)).to.equal(1);
    });
  });
});
