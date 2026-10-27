import type { Product } from "../../api/types";

export type CartState = Record<number, number>;

export type CartAction =
  { type: "add"; id: number } | { type: "remove"; id: number } | { type: "clear" };

/**
 * Задача 3.
 * Кошик зберігає кількість кожного товару: { [productId]: quantity }.
 *
 * TODO:
 * - add збільшує кількість на 1;
 * - remove зменшує на 1 і видаляє ключ, коли кількість стає 0;
 * - clear повертає порожній об'єкт;
 * - не мутуй state.
 */
export function cartReducer(state: CartState, _action: CartAction): CartState {
  // TODO: реалізуй reducer
  return state;
}

/** TODO: згрупуй товари за category, зберігаючи порядок появи категорій. */
export function groupByCategory(_products: Product[]): Map<string, Product[]> {
  return new Map();
}

/** TODO: унікальні теги без урахування регістру, відсортовані за алфавітом, у нижньому регістрі. */
export function uniqueTags(_products: Product[]): string[] {
  return [];
}

/** TODO: топ категорій за кількістю товарів; за рівної кількості — за алфавітом. */
export function topCategories(
  _groups: Map<string, Product[]>,
  _limit: number,
): { category: string; count: number }[] {
  return [];
}

/** TODO: побудуй Map<id, Product> для O(1) пошуку. */
export function buildProductMap(_products: Product[]): Map<number, Product> {
  return new Map();
}

/** TODO: порахуй суму кошика через Map, не шукаючи товар через find у циклі. */
export function cartTotal(_cart: CartState, _byId: Map<number, Product>): number {
  return 0;
}
