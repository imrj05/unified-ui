import { describe, expect, it } from "vitest";
import {
  checkHexContrast,
  contrastRatio,
  meetsAA,
  meetsAAA,
  meetsNonTextAA,
  parseRGBString,
  relativeLuminance,
} from "../contrast";

describe("contrast utilities", () => {
  describe("relativeLuminance", () => {
    it("returns 1 for white", () => {
      expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 2);
    });

    it("returns 0 for black", () => {
      expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 2);
    });

    it("returns correct value for mid-gray", () => {
      const luminance = relativeLuminance([128, 128, 128]);
      expect(luminance).toBeGreaterThan(0.2);
      expect(luminance).toBeLessThan(0.3);
    });
  });

  describe("contrastRatio", () => {
    it("returns ~21 for black on white", () => {
      const ratio = contrastRatio([0, 0, 0], [255, 255, 255]);
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("returns 1 for same colors", () => {
      const ratio = contrastRatio([128, 128, 128], [128, 128, 128]);
      expect(ratio).toBeCloseTo(1, 0);
    });

    it("is symmetric", () => {
      const ratio1 = contrastRatio([0, 0, 0], [255, 255, 255]);
      const ratio2 = contrastRatio([255, 255, 255], [0, 0, 0]);
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });
  });

  describe("meetsAA", () => {
    it("returns true for ratio >= 4.5 (normal text)", () => {
      expect(meetsAA(4.5)).toBe(true);
      expect(meetsAA(7)).toBe(true);
      expect(meetsAA(21)).toBe(true);
    });

    it("returns false for ratio < 4.5 (normal text)", () => {
      expect(meetsAA(4.4)).toBe(false);
      expect(meetsAA(3)).toBe(false);
    });

    it("returns true for ratio >= 3 (large text)", () => {
      expect(meetsAA(3, "large")).toBe(true);
      expect(meetsAA(4.5, "large")).toBe(true);
    });

    it("returns false for ratio < 3 (large text)", () => {
      expect(meetsAA(2.9, "large")).toBe(false);
    });
  });

  describe("meetsAAA", () => {
    it("returns true for ratio >= 7 (normal text)", () => {
      expect(meetsAAA(7)).toBe(true);
      expect(meetsAAA(21)).toBe(true);
    });

    it("returns false for ratio < 7 (normal text)", () => {
      expect(meetsAAA(6.9)).toBe(false);
    });

    it("returns true for ratio >= 4.5 (large text)", () => {
      expect(meetsAAA(4.5, "large")).toBe(true);
    });
  });

  describe("meetsNonTextAA", () => {
    it("returns true for ratio >= 3", () => {
      expect(meetsNonTextAA(3)).toBe(true);
      expect(meetsNonTextAA(4.5)).toBe(true);
    });

    it("returns false for ratio < 3", () => {
      expect(meetsNonTextAA(2.9)).toBe(false);
    });
  });

  describe("parseRGBString", () => {
    it("parses space-separated RGB values", () => {
      expect(parseRGBString("79 70 229")).toEqual([79, 70, 229]);
    });

    it("handles single-digit values", () => {
      expect(parseRGBString("0 0 0")).toEqual([0, 0, 0]);
    });
  });

  describe("checkHexContrast", () => {
    it("checks contrast between hex colors", () => {
      const result = checkHexContrast("#000000", "#ffffff");
      expect(result.ratio).toBeCloseTo(21, 0);
      expect(result.aa).toBe(true);
      expect(result.aaa).toBe(true);
    });

    it("returns correct AA/AAA flags for medium contrast", () => {
      const result = checkHexContrast("#505050", "#ffffff");
      expect(result.ratio).toBeGreaterThan(7);
      expect(result.aa).toBe(true);
      expect(result.aaa).toBe(true);
    });
  });
});
