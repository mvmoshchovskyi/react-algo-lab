import { describe, expect, it } from "vitest";
import { topKFrequent } from "./impl";

describe("topKFrequent", () => {
  it("returns the most frequent elements", () => {
    expect(topKFrequent([1, 1, 1, 2, 2, 3], 2)).toEqual([1, 2]);
    expect(topKFrequent([1], 1)).toEqual([1]);
  });

  it("breaks frequency ties by ascending value", () => {
    expect(topKFrequent([4, 4, 5, 5, 6], 2)).toEqual([4, 5]);
    expect(topKFrequent([3, 3, 2, 2, 1, 1], 3)).toEqual([1, 2, 3]);
  });

  it("handles k equal to the number of unique values", () => {
    expect(topKFrequent([5, 5, 7, 8, 8, 8], 3)).toEqual([8, 5, 7]);
  });

  it("handles empty input and k=0", () => {
    expect(topKFrequent([], 0)).toEqual([]);
    expect(topKFrequent([1, 1, 2], 0)).toEqual([]);
  });

  it("works on a larger input", () => {
    const result = topKFrequent([1, 1, 1, 2, 2, 3, 3, 3], 2);
    expect(result).toEqual([1, 3]);
  });
});
