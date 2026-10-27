import { describe, expect, it } from "vitest";
import { clampPage, getPageWindow, pageCount, toSkip, type PageItem } from "./impl";

describe("pageCount", () => {
  it("handles empty, exact and partial pages", () => {
    expect(pageCount(0, 20)).toBe(1);
    expect(pageCount(194, 20)).toBe(10);
    expect(pageCount(200, 20)).toBe(10);
    expect(pageCount(201, 20)).toBe(11);
    expect(pageCount(10, 0)).toBe(1);
  });
});

describe("clampPage", () => {
  it("clamps to the valid range", () => {
    expect(clampPage(0, 10)).toBe(1);
    expect(clampPage(-5, 10)).toBe(1);
    expect(clampPage(11, 10)).toBe(10);
    expect(clampPage(5, 10)).toBe(5);
    expect(clampPage(Number.NaN, 10)).toBe(1);
  });
});

describe("toSkip", () => {
  it("calculates offset and never goes negative", () => {
    expect(toSkip(1, 20)).toBe(0);
    expect(toSkip(10, 20)).toBe(180);
    expect(toSkip(0, 20)).toBe(0);
    expect(toSkip(3, 0)).toBe(0);
  });
});

describe("getPageWindow", () => {
  it("returns all pages when there are 7 or fewer", () => {
    expect(getPageWindow(4, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageWindow(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("adds ellipsis on both sides", () => {
    const expected: PageItem[] = [1, "ellipsis", 5, 6, 7, "ellipsis", 20];
    expect(getPageWindow(6, 20)).toEqual(expected);
  });

  it("handles the start and the end", () => {
    expect(getPageWindow(2, 20)).toEqual([1, 2, 3, "ellipsis", 20]);
    expect(getPageWindow(19, 20)).toEqual([1, "ellipsis", 18, 19, 20]);
  });

  it("respects siblings and clamps the current page", () => {
    expect(getPageWindow(10, 20, 2)).toEqual([
      1,
      "ellipsis",
      8,
      9,
      10,
      11,
      12,
      "ellipsis",
      20,
    ]);
    expect(getPageWindow(999, 20)).toEqual([1, "ellipsis", 19, 20]);
    expect(getPageWindow(1, 0)).toEqual([]);
  });
});
