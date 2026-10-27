export type Memoized<A extends unknown[], R> = ((...args: A) => R) & {
  cacheSize: () => number;
};

export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  maxSize = 50,
): Memoized<A, R> {
  const cache = new Map<string, R>();
  const limit = Math.max(1, Math.floor(maxSize));

  const wrapped = ((...args: A) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const value = cache.get(key) as R;
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const value = fn(...args);
    cache.set(key, value);
    if (cache.size > limit) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) cache.delete(oldestKey);
    }
    return value;
  }) as Memoized<A, R>;

  wrapped.cacheSize = () => cache.size;
  return wrapped;
}
