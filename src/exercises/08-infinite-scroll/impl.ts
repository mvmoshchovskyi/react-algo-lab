import { useCallback } from "react";

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

/** Задача 8a. Наступний offset для запиту. */
export function getNextSkip(_loadedCount: number, _pageSize: number): number {
  // TODO
  return 0;
}

/**
 * Задача 8b.
 * Додай нові елементи до вже завантажених без дублікатів за id.
 * Порядок існуючих зберігається, нові — в кінці.
 */
export function mergeUnique<T extends { id: number }>(
  existing: T[],
  _incoming: T[],
): T[] {
  // TODO
  return existing;
}

/** Задача 8c. Чи є ще сторінки? */
export function hasMore(_loadedCount: number, _total: number): boolean {
  // TODO
  return false;
}

/**
 * Задача 8d.
 * Hook для накопичувального списку.
 *
 * TODO:
 * - перша сторінка завантажується автоматично;
 * - loadMore не запускає паралельні запити;
 * - при resetKey (фільтр) список скидається й завантажується заново;
 * - AbortController скасовує запит при зміні resetKey/unmount;
 * - після помилки retry не втрачає вже завантажені елементи;
 * - status: idle | loading | error | done;
 * - done, коли items.length >= total або прийшла порожня сторінка.
 */
export function useInfiniteList<T extends { id: number }>(
  _loadPage: (
    skip: number,
    limit: number,
    signal: AbortSignal,
  ) => Promise<InfinitePage<T>>,
  _options: { pageSize?: number; resetKey?: unknown } = {},
): InfiniteList<T> {
  const loadMore = useCallback(async () => {}, []);
  const reset = useCallback(() => {}, []);

  return {
    items: [],
    total: 0,
    status: "idle",
    error: null,
    loadMore,
    retry: loadMore,
    reset,
  };
}
