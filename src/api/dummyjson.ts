import type { Category, Product, ProductsResponse } from "./types";
import { consumeFailNext, getDelay } from "./devSettings";

const BASE_URL = "https://dummyjson.com";
const CACHE_TTL = 60_000;

const PRODUCT_FIELDS =
  "id,title,description,category,price,rating,stock,tags,brand,thumbnail";

type CacheEntry = { data: unknown; createdAt: number };
const cache = new Map<string, CacheEntry>();

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

type RequestOptions = {
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
  cache?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params = {}, signal, cache: useCache = true } = options;
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const delay = getDelay();
  if (delay > 0) url.searchParams.set("delay", String(delay));

  if (consumeFailNext()) {
    const errorUrl = new URL("/http/500", BASE_URL);
    if (delay > 0) errorUrl.searchParams.set("delay", String(delay));
    const errorResponse = await fetch(errorUrl, { signal });
    throw new ApiError(
      `Симульована помилка ${errorResponse.status}`,
      errorResponse.status,
    );
  }

  const cacheKey = `${url.pathname}${url.search}`;
  if (useCache && delay === 0 && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (entry && Date.now() - entry.createdAt < CACHE_TTL) {
      return entry.data as T;
    }
    cache.delete(cacheKey);
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new ApiError(`DummyJSON відповів ${response.status}`, response.status);
  }

  const data = (await response.json()) as T;
  if (useCache && delay === 0) {
    cache.set(cacheKey, { data, createdAt: Date.now() });
  }
  return data;
}

export function clearApiCache() {
  cache.clear();
}

export function fetchAllProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return request<ProductsResponse>("/products", {
    params: { limit: 0, select: PRODUCT_FIELDS },
    signal,
  });
}

export function fetchProductsPage(options: {
  limit: number;
  skip: number;
  category?: string;
  signal?: AbortSignal;
}): Promise<ProductsResponse> {
  const { limit, skip, category, signal } = options;
  const path = category
    ? `/products/category/${encodeURIComponent(category)}`
    : "/products";
  return request<ProductsResponse>(path, {
    params: { limit, skip, select: PRODUCT_FIELDS },
    signal,
  });
}

export function searchProducts(
  query: string,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  if (!query.trim()) return fetchAllProducts(signal);
  return request<ProductsResponse>("/products/search", {
    params: { q: query.trim(), limit: 0, select: PRODUCT_FIELDS },
    signal,
  });
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const categories = await request<Category[]>("/products/categories", { signal });
  return categories.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
}

/** Корисно для експериментів у консолі / майбутніх задач. */
export function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  return request<Product>(`/products/${id}`, { signal });
}
