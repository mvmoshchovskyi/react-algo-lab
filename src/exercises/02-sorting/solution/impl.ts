import type { Product, SortDirection } from "../../../api/types";

export type SortKey = "title" | "price" | "rating" | "stock";

export type SortState = { key: SortKey; direction: SortDirection } | null;

export function nextSortState(current: SortState, key: SortKey): SortState {
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}

function compareValues(a: Product, b: Product, key: SortKey): number {
  const left = a[key];
  const right = b[key];
  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right);
  }
  return Number(left) - Number(right);
}

export function sortRows(rows: Product[], sort: SortState): Product[] {
  const copy = [...rows];
  if (!sort) return copy;

  copy.sort((a, b) => {
    const primary = compareValues(a, b, sort.key);
    if (primary !== 0) return sort.direction === "asc" ? primary : -primary;
    return a.id - b.id;
  });

  return copy;
}
