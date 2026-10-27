import { describe, expect, it } from "vitest";
import type { Product } from "../../api/types";
import { applyFilters, emptyFilters, type SearchFilters } from "./impl";

function product(overrides: Partial<Product> & { id: number }): Product {
  return {
    title: `Product ${overrides.id}`,
    category: "beauty",
    price: 10,
    rating: 4,
    stock: 5,
    tags: [],
    brand: "Demo",
    ...overrides,
  };
}

const products: Product[] = [
  product({
    id: 1,
    title: "Apple iPhone",
    category: "smartphones",
    price: 999,
    rating: 4.8,
    brand: "Apple",
    tags: ["mobile"],
  }),
  product({
    id: 2,
    title: "Samsung Galaxy",
    category: "smartphones",
    price: 799,
    rating: 4.2,
    brand: "Samsung",
    tags: ["android"],
  }),
  product({
    id: 3,
    title: "Essence Mascara",
    category: "beauty",
    price: 9.99,
    rating: 2.5,
    brand: "Essence",
    tags: ["makeup"],
  }),
  product({
    id: 4,
    title: "Budget Phone",
    category: "smartphones",
    price: 199,
    rating: 3.4,
    brand: "NoName",
    tags: ["mobile", "budget"],
  }),
];

const filters = (overrides: Partial<SearchFilters> = {}): SearchFilters => ({
  ...emptyFilters,
  ...overrides,
});

describe("applyFilters", () => {
  it("returns all products for empty filters without mutating the source", () => {
    const snapshot = structuredClone(products);
    expect(applyFilters(products, filters())).toEqual(products);
    expect(products).toEqual(snapshot);
  });

  it("searches case-insensitively across title, brand and tags", () => {
    expect(
      applyFilters(products, filters({ query: "APPLE" })).map((item) => item.id),
    ).toEqual([1]);
    expect(
      applyFilters(products, filters({ query: "samsung" })).map((item) => item.id),
    ).toEqual([2]);
    expect(
      applyFilters(products, filters({ query: "budget" })).map((item) => item.id),
    ).toEqual([4]);
  });

  it("filters by category", () => {
    expect(
      applyFilters(products, filters({ category: "smartphones" })).map((item) => item.id),
    ).toEqual([1, 2, 4]);
  });

  it("includes price bounds and applies rating together", () => {
    expect(
      applyFilters(products, filters({ minPrice: 199, maxPrice: 799 })).map(
        (item) => item.id,
      ),
    ).toEqual([2, 4]);
    expect(
      applyFilters(products, filters({ category: "smartphones", minRating: 4 })).map(
        (item) => item.id,
      ),
    ).toEqual([1, 2]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(applyFilters(products, filters({ query: "nokia" }))).toEqual([]);
  });
});
