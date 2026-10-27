import { useCallback, useEffect, useRef, useState } from "react";

export type InfiniteStatus = "idle" | "loading" | "error" | "done";

export type InfinitePage<T> = {
  items: T[];
  total: number;
};

export type InfiniteList<T> = {
  items: T[];
  total: number;
  status: InfiniteStatus;
  error: string | null;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
};

export function getNextSkip(loadedCount: number, _pageSize: number): number {
  return Math.max(0, Math.trunc(loadedCount));
}

export function mergeUnique<T extends { id: number }>(existing: T[], incoming: T[]): T[] {
  const seen = new Set(existing.map((item) => item.id));
  const result = [...existing];

  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

export function hasMore(loadedCount: number, total: number): boolean {
  return total > 0 && loadedCount < total;
}

export function useInfiniteList<T extends { id: number }>(
  loadPage: (
    skip: number,
    limit: number,
    signal: AbortSignal,
  ) => Promise<InfinitePage<T>>,
  options: { pageSize?: number; resetKey?: unknown } = {},
): InfiniteList<T> {
  const { pageSize = 20, resetKey } = options;

  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<InfiniteStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const loadPageRef = useRef(loadPage);
  const skipRef = useRef(0);
  const totalRef = useRef(0);
  const loadingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);

  useEffect(() => {
    loadPageRef.current = loadPage;
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (totalRef.current > 0 && skipRef.current >= totalRef.current) return;

    loadingRef.current = true;
    const generation = generationRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");
    setError(null);

    try {
      const page = await loadPageRef.current(
        skipRef.current,
        pageSize,
        controller.signal,
      );
      if (generation !== generationRef.current) return;

      const nextSkip = skipRef.current + page.items.length;
      skipRef.current = nextSkip;
      totalRef.current = page.total;

      setItems((current) => mergeUnique(current, page.items));
      setTotal(page.total);
      setStatus(page.items.length === 0 || nextSkip >= page.total ? "done" : "idle");
    } catch (caught) {
      if (generation !== generationRef.current) return;
      if (controller.signal.aborted) return;
      setError(caught instanceof Error ? caught.message : "Невідома помилка");
      setStatus("error");
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        loadingRef.current = false;
      }
    }
  }, [pageSize]);

  const reset = useCallback(() => {
    generationRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    loadingRef.current = false;
    skipRef.current = 0;
    totalRef.current = 0;
    setItems([]);
    setTotal(0);
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    reset();
    const timer = window.setTimeout(() => {
      void loadMore();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      generationRef.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
      loadingRef.current = false;
    };
  }, [loadMore, reset, resetKey]);

  return { items, total, status, error, loadMore, retry: loadMore, reset };
}
