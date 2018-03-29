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
});
