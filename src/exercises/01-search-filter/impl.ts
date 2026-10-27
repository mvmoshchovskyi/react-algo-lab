import type { Product } from "../../api/types";

export type SearchFilters = {
  query: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number;
};

export const emptyFilters: SearchFilters = {
  query: "",
  category: "",
  minPrice: null,
  maxPrice: null,
  minRating: 0,
};

/**
 * Задача 1.
 * Відфільтруй товари за запитом, категорією, діапазоном цін і рейтингом.
 *
 * TODO:
 * - query шукається без урахування регістру в title, category, brand і tags;
 * - порожній query / category означає «без фільтра»;
 * - межі ціни включні;
 * - minRating = 0 означає «без фільтра»;
 * - не мутуй вхідний масив.
 */
export function applyFilters(products: Product[], filters: SearchFilters): Product[] {
  const query = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    const searchableFields = [
      product.title,
      product.category,
      product.brand,
      ...(product.tags ?? []),
    ];

    const matchesQuery =
      !query || searchableFields.some((value) => value?.toLowerCase().includes(query));

    const matchesCategory = !filters.category || product.category === filters.category;

    const matchesMinPrice =
      filters.minPrice === null || product.price >= filters.minPrice;

    const matchesMaxPrice =
      filters.maxPrice === null || product.price <= filters.maxPrice;

    const matchesMinRating =
      filters.minRating === 0 || product.rating >= filters.minRating;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinRating
    );
  });
}
