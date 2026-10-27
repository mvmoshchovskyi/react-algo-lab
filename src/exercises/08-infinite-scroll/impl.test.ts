import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  getNextSkip,
  hasMore,
  mergeUnique,
  useInfiniteList,
  type InfinitePage,
} from "./impl";

type Row = { id: number; title: string };

function rows(count: number): Row[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Row ${index + 1}`,
  }));
}

describe("getNextSkip", () => {
  it("returns the number of already loaded items", () => {
    expect(getNextSkip(0, 20)).toBe(0);
    expect(getNextSkip(20, 20)).toBe(20);
    expect(getNextSkip(18, 20)).toBe(18);
  });
});

describe("mergeUnique", () => {
  it("appends new items and removes duplicates by id", () => {
    const existing = rows(3);
    const incoming: Row[] = [
      { id: 3, title: "Row 3 duplicate" },
      { id: 4, title: "Row 4" },
      { id: 4, title: "Row 4 duplicate" },
      { id: 5, title: "Row 5" },
    ];

    const result = mergeUnique(existing, incoming);
    expect(result.map((row) => row.id)).toEqual([1, 2, 3, 4, 5]);
    expect(result[2]!.title).toBe("Row 3");
    expect(existing).toHaveLength(3);
  });
});

describe("hasMore", () => {
  it("compares loaded count with total", () => {
    expect(hasMore(0, 194)).toBe(true);
    expect(hasMore(193, 194)).toBe(true);
    expect(hasMore(194, 194)).toBe(false);
    expect(hasMore(200, 194)).toBe(false);
    expect(hasMore(0, 0)).toBe(false);
  });
});

describe("useInfiniteList", () => {
  it("loads the first page and appends the next one", async () => {
    const data = rows(5);
    const loadPage = vi.fn(
      async (skip: number, limit: number): Promise<InfinitePage<Row>> => ({
        items: data.slice(skip, skip + limit),
        total: data.length,
      }),
    );

    const { result } = renderHook(() => useInfiniteList(loadPage, { pageSize: 2 }));

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.status).toBe("idle");
    expect(result.current.total).toBe(5);

    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.items.map((row) => row.id)).toEqual([1, 2, 3, 4]);

    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.items).toHaveLength(5);
    expect(result.current.status).toBe("done");
  });

  it("does not run two requests in parallel", async () => {
    const data = rows(10);
    let resolveFirst: (() => void) | null = null;
    const loadPage = vi.fn(
      (skip: number, limit: number): Promise<InfinitePage<Row>> =>
        new Promise((resolve) => {
          resolveFirst = () =>
            resolve({ items: data.slice(skip, skip + limit), total: data.length });
        }),
    );

    const { result } = renderHook(() => useInfiniteList(loadPage, { pageSize: 5 }));
    await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(1));

    await act(async () => {
      const first = result.current.loadMore();
      const second = result.current.loadMore();
      resolveFirst?.();
      await Promise.all([first, second]);
    });

    expect(loadPage).toHaveBeenCalledTimes(1);
    expect(result.current.items).toHaveLength(5);
  });

  it("keeps loaded items after an error and retries", async () => {
    const data = rows(4);
    let shouldFail = false;
    const loadPage = vi.fn(
      async (skip: number, limit: number): Promise<InfinitePage<Row>> => {
        if (shouldFail) throw new Error("Network down");
        return { items: data.slice(skip, skip + limit), total: data.length };
      },
    );

    const { result } = renderHook(() => useInfiniteList(loadPage, { pageSize: 2 }));
    await waitFor(() => expect(result.current.items).toHaveLength(2));

    shouldFail = true;
    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.status).toBe("error");
    expect(result.current.items).toHaveLength(2);

    shouldFail = false;
    await act(async () => {
      await result.current.retry();
    });
    expect(result.current.items).toHaveLength(4);
    expect(result.current.status).toBe("done");
  });
});
