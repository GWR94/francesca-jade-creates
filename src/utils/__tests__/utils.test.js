/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { convertPoundsToPence, convertPenceToPounds } from "../index";

describe("index.js test suite", () => {
  describe("convert pounds to pence test cases", () => {
    it("should return the correct amount based on input of convertPoundsToPence", () => {
      expect(convertPoundsToPence(10)).toBe(1000);
      expect(convertPoundsToPence(1)).toBe(100);
      expect(convertPoundsToPence(234)).toBe(23400);
    });
    it("should return the correct amount based on input of convertPenceToPounds", () => {
      expect(convertPenceToPounds(100)).toBe(1);
      expect(convertPenceToPounds(2400)).toBe(24);
      expect(convertPenceToPounds(259900)).toBe(2599);
    });
  });
});
