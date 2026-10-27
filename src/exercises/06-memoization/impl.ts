export type Memoized<A extends unknown[], R> = ((...args: A) => R) & {
  cacheSize: () => number;
};

/**
 * Задача 6a.
 * Мемоізація з LRU-обмеженням.
 *
 * TODO:
 * - однакові аргументи → результат із кешу, fn не викликається;
 * - різні аргументи → новий виклик;
 * - максимум maxSize записів, найстаріший витісняється;
 * - успішний cache hit робить запис «свіжим» (LRU, а не FIFO);
 * - cacheSize() повертає поточну кількість записів.
 *
 * Підказка: ключ можна зробити через JSON.stringify(args).
 * Обмеження: підходить для примітивів і простих об'єктів.
 */
export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  _maxSize = 50,
): Memoized<A, R> {
  // TODO: реалізуй кеш
  const wrapped = ((...args: A) => fn(...args)) as Memoized<A, R>;
  wrapped.cacheSize = () => 0;
  return wrapped;
}
