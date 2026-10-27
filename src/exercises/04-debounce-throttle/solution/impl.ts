import { useCallback, useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useThrottledCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  limit = 300,
): (...args: A) => void {
  const callbackRef = useRef(callback);
  const waitingRef = useRef(false);
  const pendingRef = useRef<A | null>(null);
  const timerRef = useRef<number | null>(null);
  const runRef = useRef<(...args: A) => void>(() => {});

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      waitingRef.current = false;
      pendingRef.current = null;
    };
  }, []);

  const run = useCallback(
    (...args: A) => {
      if (!waitingRef.current) {
        waitingRef.current = true;
        callbackRef.current(...args);

        timerRef.current = window.setTimeout(() => {
          waitingRef.current = false;
          timerRef.current = null;
          const pending = pendingRef.current;
          pendingRef.current = null;
          if (pending) runRef.current(...pending);
        }, limit);
        return;
      }

      pendingRef.current = args;
    },
    [limit],
  );

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  return run;
}

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
