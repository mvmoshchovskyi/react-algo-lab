import { describe, expect, it } from "vitest";
import { getVirtualRange } from "./impl";

describe("getVirtualRange", () => {
  it("returns zeros for an empty list", () => {
    expect(
      getVirtualRange({ scrollTop: 0, viewportHeight: 300, rowHeight: 50, total: 0 }),
    ).toEqual({ start: 0, end: 0, offsetY: 0, totalHeight: 0 });
  });

  it("renders from the top with overscan", () => {
    expect(
      getVirtualRange({
        scrollTop: 0,
        viewportHeight: 300,
        rowHeight: 50,
        total: 1000,
        overscan: 2,
      }),
    ).toEqual({ start: 0, end: 8, offsetY: 0, totalHeight: 50_000 });
  });

  it("calculates the window in the middle", () => {
    expect(
      getVirtualRange({
        scrollTop: 1000,
        viewportHeight: 300,
        rowHeight: 50,
        total: 1000,
        overscan: 2,
      }),
    ).toEqual({ start: 18, end: 28, offsetY: 900, totalHeight: 50_000 });
  });

  it("clamps at the bottom", () => {
    expect(
      getVirtualRange({
        scrollTop: 49_700,
        viewportHeight: 300,
        rowHeight: 50,
        total: 1000,
        overscan: 2,
      }),
    ).toEqual({ start: 992, end: 1000, offsetY: 49_600, totalHeight: 50_000 });
  });

  it("supports overscan = 0 and clamps invalid input", () => {
    expect(
      getVirtualRange({
        scrollTop: 1000,
        viewportHeight: 300,
        rowHeight: 50,
        total: 100,
        overscan: 0,
      }),
    ).toEqual({ start: 20, end: 26, offsetY: 1000, totalHeight: 5000 });

    expect(
      getVirtualRange({
        scrollTop: -100,
        viewportHeight: 300,
        rowHeight: 50,
        total: 10,
        overscan: 2,
      }),
    ).toEqual({ start: 0, end: 8, offsetY: 0, totalHeight: 500 });

    expect(
      getVirtualRange({ scrollTop: 0, viewportHeight: 300, rowHeight: 0, total: 10 }),
    ).toEqual({ start: 0, end: 0, offsetY: 0, totalHeight: 0 });
  });
});
