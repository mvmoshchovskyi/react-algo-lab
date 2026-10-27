import { describe, expect, it, vi } from "vitest";
import { memoize } from "./impl";

describe("memoize", () => {
  it("caches by arguments and does not call the source function twice", () => {
    const source = vi.fn((value: number) => value * 2);
    const memoized = memoize(source);

    expect(memoized(2)).toBe(4);
    expect(memoized(2)).toBe(4);
    expect(source).toHaveBeenCalledTimes(1);

    expect(memoized(3)).toBe(6);
    expect(source).toHaveBeenCalledTimes(2);
    expect(memoized.cacheSize()).toBe(2);
  });

  it("supports multiple arguments", () => {
    const source = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(source);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 1)).toBe(3);
    expect(source).toHaveBeenCalledTimes(2);
  });

  it("evicts the least recently used entry", () => {
    const source = vi.fn((value: number) => value * 10);
    const memoized = memoize(source, 2);

    memoized(1);
    memoized(2);
    memoized(1); // 1 стає свіжим, 2 — найстаріший
    memoized(3); // витісняє 2

    expect(memoized.cacheSize()).toBe(2);
    expect(source).toHaveBeenCalledTimes(3);

    memoized(1); // 1 ще в кеші
    expect(source).toHaveBeenCalledTimes(3);

    memoized(2); // має перерахуватися, витісняє 3
    expect(source).toHaveBeenCalledTimes(4);

    memoized(1); // 1 все ще в кеші
    expect(source).toHaveBeenCalledTimes(4);
  });

  it("returns the same reference for the same object argument", () => {
    const source = vi.fn((value: { id: number }) => ({ copy: value.id }));
    const memoized = memoize(source);
    const first = memoized({ id: 1 });
    const second = memoized({ id: 1 });
    expect(second).toBe(first);
    expect(source).toHaveBeenCalledTimes(1);
  });
});
