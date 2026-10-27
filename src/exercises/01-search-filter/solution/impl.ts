import type { Product } from "../../../api/types";

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

export function applyFilters(products: Product[], filters: SearchFilters): Product[] {
  const query = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    const searchableFields = [
      product.title,
      product.category,
      product.brand,
      ...(product.tags ?? []),
    ];

    const searchQuery =
      !query || searchableFields.some((field) => field?.toLowerCase().includes(query));

    const searchCategory = !filters.category || product.category === filters.category;

    const searchMinPrice = filters.minPrice === null || filters.minPrice <= product.price;

    const searchMaxPrice = filters.maxPrice === null || filters.maxPrice >= product.price;

    const searchMinRating =
      filters.minRating === 0 || filters.minRating <= product.rating;

    return (
      searchQuery && searchCategory && searchMinPrice && searchMaxPrice && searchMinRating
    );
  });
}
