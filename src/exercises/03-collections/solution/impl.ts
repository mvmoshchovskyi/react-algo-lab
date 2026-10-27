import type { Product } from "../../../api/types";

export type CartState = Record<number, number>;

export type CartAction =
  { type: "add"; id: number } | { type: "remove"; id: number } | { type: "clear" };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      return { ...state, [action.id]: (state[action.id] ?? 0) + 1 };
    }
    case "remove": {
      const current = state[action.id] ?? 0;
      if (current === 0) return state;
      const next = { ...state };
      if (current === 1) delete next[action.id];
      else next[action.id] = current - 1;
      return next;
    }
    case "clear":
      return {};
  }
}

export function groupByCategory(products: Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    const group = groups.get(product.category);
    if (group) group.push(product);
    else groups.set(product.category, [product]);
  }
  return groups;
}

export function uniqueTags(products: Product[]): string[] {
  const tags = new Set<string>();
  for (const product of products) {
    for (const tag of product.tags ?? []) {
      tags.add(tag.toLowerCase());
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function topCategories(
  groups: Map<string, Product[]>,
  limit: number,
): { category: string; count: number }[] {
  return [...groups.entries()]
    .map(([category, items]) => ({ category, count: items.length }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, Math.max(0, limit));
}

export function buildProductMap(products: Product[]): Map<number, Product> {
  return new Map(products.map((product) => [product.id, product]));
}

export function cartTotal(cart: CartState, byId: Map<number, Product>): number {
  let total = 0;
  for (const [id, quantity] of Object.entries(cart)) {
    const product = byId.get(Number(id));
    if (product) total += product.price * quantity;
  }
  return total;
}
