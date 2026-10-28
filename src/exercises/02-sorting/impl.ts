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
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };

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
  const result = [...rows];



  if (_sort === null) {
    return result;
  }

  const { key, direction } = _sort;

  const multiplier = direction === 'asc' ? 1 : -1;

  return result.sort((a, b) => {
    const comparison = key === "title" ? a.title.localeCompare(b.title) : a[key] - b[key];

    return comparison === 0 ? a.id - b.id : comparison * multiplier;
  });
}
