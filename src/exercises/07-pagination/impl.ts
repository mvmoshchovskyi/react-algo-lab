export type PageItem = number | "ellipsis";

/**
 * Задача 7a.
 * Скільки всього сторінок? Порожній список — 1 сторінка.
 * limit <= 0 не має ламати обчислення.
 */
export function pageCount(_total: number, _limit: number): number {
  // TODO
  return 1;
}

/** Задача 7b. Обмеж page діапазоном 1..totalPages. */
export function clampPage(_page: number, _totalPages: number): number {
  // TODO
  return 1;
}

/** Задача 7c. skip = (page - 1) * limit, без від'ємних значень. */
export function toSkip(_page: number, _limit: number): number {
  // TODO
  return 0;
}

/**
 * Задача 7d.
 * Вікно сторінок з еліпсисами.
 *
 * Приклад: current=6, totalPages=20, siblings=1
 *   [1, "ellipsis", 5, 6, 7, "ellipsis", 20]
 *
 * TODO:
 * - перша й остання сторінки завжди видимі;
 * - навколо current — siblings сторінок з кожного боку;
 * - якщо між видимими сторінками пропуск > 1 — встав "ellipsis";
 * - якщо totalPages <= 7 — поверни всі сторінки без еліпсисів;
 * - некоректний current клампиться.
 */
export function getPageWindow(
  _current: number,
  _totalPages: number,
  _siblings = 1,
): PageItem[] {
  // TODO
  return [1];
}
