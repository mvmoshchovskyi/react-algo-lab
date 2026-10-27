import type { Product, SortDirection } from "../../api/types";

export type SortKey = "title" | "price" | "rating" | "stock";

export type SortState = { key: SortKey; direction: SortDirection } | null;

/**
 * Задача 2.
 * Клік по заголовку циклічно змінює стан:
 *   немає сортування → asc → desc → немає сортування.
 * Клік по іншій колонці починає з asc.
 */
export function nextSortState(current: SortState, key: SortKey): SortState {
  // TODO: реалізуй цикл сортування
  void current;
  void key;
  return null;
}

/**
 * Задача 2.
 * Поверни НОВИЙ відсортований масив.
 *
 * TODO:
 * - title сортується через localeCompare;
 * - числа — як числа;
 * - за рівних значень tie-break за id (завжди за зростанням);
 * - sort = null повертає копію у вихідному порядку;
 * - не мутуй вхідний масив.
 */
export function sortRows(rows: Product[], _sort: SortState): Product[] {
  // TODO: реалізуй сортування
  return [...rows];
}
