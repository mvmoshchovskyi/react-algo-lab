import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Задача 4a.
 * Повертає значення, яке оновлюється лише після паузи `delay` мс.
 * Кожна зміна value скидає попередній таймер, cleanup обов'язковий.
 */
export function useDebouncedValue<T>(value: T, _delay = 300): T {
  // TODO: реалізуй debounce
  return value;
}

/**
 * Задача 4b.
 * Leading + trailing throttle:
 * - перший виклик виконується одразу;
 * - виклики протягом `limit` мс запам'ятовуються, виконується останній;
 * - таймер очищається при розмонтуванні;
 * - callback завжди актуальний (через ref).
 */
export function useThrottledCallback<A extends unknown[]>(
  _callback: (...args: A) => void,
  _limit = 300,
): (...args: A) => void {
  // TODO: реалізуй throttle
  return useCallback((..._args: A) => {}, []);
}

/** Допоміжний хук: throttle для значення. Можеш не змінювати. */
export function useThrottledValue<T>(value: T, limit = 300): T {
  const [throttled, setThrottled] = useState(value);
  const previousRef = useRef(value);
  const update = useThrottledCallback((next: T) => setThrottled(next), limit);

  useEffect(() => {
    if (previousRef.current === value) return;
    previousRef.current = value;
    update(value);
  }, [value, update]);

  return throttled;
}
