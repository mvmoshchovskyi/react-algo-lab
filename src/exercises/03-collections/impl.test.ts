import { describe, expect, it } from "vitest";
import type { Product } from "../../api/types";
import {
  buildProductMap,
  cartReducer,
  cartTotal,
  groupByCategory,
  topCategories,
  uniqueTags,
} from "./impl";

function product(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Product ${id}`,
    category: "beauty",
    price: 10,
    rating: 4,
    stock: 5,
    tags: [],
    ...overrides,
  };
}

const products = [
  product(1, { category: "beauty", price: 9.99, tags: ["Makeup", "Beauty"] }),
  product(2, { category: "smartphones", price: 799, tags: ["mobile", "beauty"] }),
  product(3, { category: "beauty", price: 19.99, tags: ["makeup", "skincare"] }),
  product(4, { category: "groceries", price: 5, tags: [] }),
];

describe("cartReducer", () => {
  it("adds, increments and removes items immutably", () => {
    const empty = {};
    const one = cartReducer(empty, { type: "add", id: 1 });
    const two = cartReducer(one, { type: "add", id: 1 });
    expect(empty).toEqual({});
    expect(one).toEqual({ 1: 1 });
    expect(two).toEqual({ 1: 2 });

    const back = cartReducer(two, { type: "remove", id: 1 });
    expect(back).toEqual({ 1: 1 });
    expect(cartReducer(back, { type: "remove", id: 1 })).toEqual({});
    expect(cartReducer({ 2: 3 }, { type: "clear" })).toEqual({});
  });

  it("ignores removal of an unknown id", () => {
    expect(cartReducer({ 1: 1 }, { type: "remove", id: 99 })).toEqual({ 1: 1 });
  });
});

describe("collections helpers", () => {
  it("groups products by category preserving insertion order", () => {
    const groups = groupByCategory(products);
    expect([...groups.keys()]).toEqual(["beauty", "smartphones", "groceries"]);
    expect(groups.get("beauty")?.map((item) => item.id)).toEqual([1, 3]);
  });

  it("returns unique lower-case tags sorted alphabetically", () => {
    expect(uniqueTags(products)).toEqual(["beauty", "makeup", "mobile", "skincare"]);
  });

  it("returns top categories with alphabetical tie-break", () => {
    expect(topCategories(groupByCategory(products), 2)).toEqual([
      { category: "beauty", count: 2 },
      { category: "groceries", count: 1 },
    ]);
  });

  it("builds an id map and calculates the cart total", () => {
    const byId = buildProductMap(products);
    expect(byId.get(2)?.title).toBe("Product 2");
    expect(cartTotal({ 1: 2, 2: 1 }, byId)).toBeCloseTo(2 * 9.99 + 799);
    expect(cartTotal({ 99: 3 }, byId)).toBe(0);
  });
});
