import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue, useThrottledCallback, useThrottledValue } from "./impl";

describe("useDebouncedValue", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("keeps the old value until the delay passes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "a" } },
    );

    expect(result.current).toBe("a");
    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("b");
  });

  it("resets the timer on every change", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 0 } },
    );

    rerender({ value: 1 });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(0);

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(2);
  });
});

describe("useThrottledCallback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls immediately and then once with the last arguments", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(spy, 300));

    act(() => {
      result.current(1);
      result.current(2);
      result.current(3);
    });
    expect(spy.mock.calls).toEqual([[1]]);

    act(() => vi.advanceTimersByTime(300));
    expect(spy.mock.calls).toEqual([[1], [3]]);

    act(() => {
      result.current(4);
    });
    expect(spy.mock.calls).toEqual([[1], [3]]);

    act(() => vi.advanceTimersByTime(300));
    expect(spy.mock.calls).toEqual([[1], [3], [4]]);
  });

  it("uses the latest callback reference for trailing calls", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useThrottledCallback(callback, 300),
      { initialProps: { callback: first } },
    );

    act(() => result.current("leading"));
    rerender({ callback: second });
    act(() => result.current("trailing"));

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));
    expect(second).toHaveBeenCalledWith("trailing");
  });

  it("clears a pending trailing call on unmount", () => {
    const spy = vi.fn();
    const { result, unmount } = renderHook(() => useThrottledCallback(spy, 300));

    act(() => {
      result.current("first");
      result.current("pending");
    });
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(spy.mock.calls).toEqual([["first"]]);
  });
});

describe("useThrottledValue", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("updates on the leading edge and then with the latest value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, 300),
      { initialProps: { value: 0 } },
    );

    rerender({ value: 1 });
    rerender({ value: 2 });
    rerender({ value: 3 });
    expect(result.current).toBe(1);

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe(3);
  });
});
