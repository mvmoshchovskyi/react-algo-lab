import { describe, expect, it } from "vitest";
import type { Product } from "../../api/types";
import { nextSortState, sortRows, type SortState } from "./impl";

function product(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Product ${id}`,
    category: "demo",
    price: 10,
    rating: 4,
    stock: 1,
    ...overrides,
  };
}

const rows: Product[] = [
  product(3, { title: "Banana", price: 10, rating: 4.5, stock: 2 }),
  product(1, { title: "apple", price: 20, rating: 4.5, stock: 0 }),
  product(2, { title: "Cherry", price: 10, rating: 3.2, stock: 8 }),
];

describe("nextSortState", () => {
  it("cycles none → asc → desc → none for the same column", () => {
    const asc: SortState = { key: "price", direction: "asc" };
    const desc: SortState = { key: "price", direction: "desc" };
    expect(nextSortState(null, "price")).toEqual(asc);
    expect(nextSortState(asc, "price")).toEqual(desc);
    expect(nextSortState(desc, "price")).toBeNull();
  });

  it("starts from asc when another column is clicked", () => {
    expect(nextSortState({ key: "price", direction: "desc" }, "rating")).toEqual({
      key: "rating",
      direction: "asc",
    });
  });
});

describe("sortRows", () => {
  it("does not mutate the input and returns a copy when sort is null", () => {
    const snapshot = structuredClone(rows);
    const result = sortRows(rows, null);
    expect(result).toEqual(rows);
    expect(result).not.toBe(rows);
    expect(rows).toEqual(snapshot);
  });

  it("sorts strings with localeCompare", () => {
    const result = sortRows(rows, { key: "title", direction: "asc" }).map(
      (item) => item.id,
    );
    expect(result).toEqual([1, 3, 2]);
  });

  it("sorts numbers and keeps id ascending for equal values", () => {
    const byPrice = sortRows(rows, { key: "price", direction: "asc" }).map(
      (item) => item.id,
    );
    expect(byPrice).toEqual([2, 3, 1]);

    const byPriceDesc = sortRows(rows, { key: "price", direction: "desc" }).map(
      (item) => item.id,
    );
    expect(byPriceDesc).toEqual([1, 2, 3]);

    const byRating = sortRows(rows, { key: "rating", direction: "asc" }).map(
      (item) => item.id,
    );
    expect(byRating).toEqual([2, 1, 3]);
  });
});
