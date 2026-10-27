import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchAllProducts, fetchCategories, isAbortError } from "../../api/dummyjson";
import type { Category, Product } from "../../api/types";
import { applyFilters, emptyFilters, type SearchFilters } from "./impl";

function readFilters(params: URLSearchParams): SearchFilters {
  const numberParam = (name: string): number | null => {
    const raw = params.get(name);
    if (raw === null || raw === "") return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "",
    minPrice: numberParam("min"),
    maxPrice: numberParam("max"),
    minRating: numberParam("rating") ?? 0,
  };
}

function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice !== null) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("max", String(filters.maxPrice));
  if (filters.minRating > 0) params.set("rating", String(filters.minRating));
  return params;
}

export default function SearchFilterTask() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() => readFilters(searchParams));
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    Promise.all([fetchAllProducts(controller.signal), fetchCategories(controller.signal)])
      .then(([productsResponse, categoryList]) => {
        setProducts(productsResponse.products);
        setCategories(categoryList);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught)) return;
        setError(caught instanceof Error ? caught.message : "Невідома помилка");
        setLoading(false);
      });

    return () => controller.abort();
  }, [reloadToken]);

  useEffect(() => {
    setSearchParams(filtersToParams(filters), { replace: true });
  }, [filters, setSearchParams]);

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);

  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="exercise-workspace">
      <div className="panel filters-panel">
        <div className="field field-wide">
          <label htmlFor="search-query">Пошук</label>
          <input
            id="search-query"
            value={filters.query}
            onChange={(event) => update("query", event.target.value)}
            placeholder="Назва, категорія, бренд або тег…"
          />
        </div>

        <div className="field">
          <label htmlFor="search-category">Категорія</label>
          <select
            id="search-category"
            value={filters.category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="">Усі категорії</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="search-min">Ціна від</label>
          <input
            id="search-min"
            type="number"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              update(
                "minPrice",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </div>

        <div className="field">
          <label htmlFor="search-max">Ціна до</label>
          <input
            id="search-max"
            type="number"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              update(
                "maxPrice",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
        </div>

        <div className="field">
          <label htmlFor="search-rating">Рейтинг від</label>
          <select
            id="search-rating"
            value={filters.minRating}
            onChange={(event) => update("minRating", Number(event.target.value))}
          >
            <option value={0}>Будь-який</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>

        <div className="filters-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setFilters(emptyFilters)}
          >
            Очистити
          </button>
        </div>
      </div>

      <div className="results-head">
        <span>
          Знайдено <strong>{filtered.length}</strong> з {products.length}
        </span>
        <span className="muted">Стан фільтрів синхронізується з URL</span>
      </div>

      {loading ? (
        <div className="product-grid" aria-label="Завантаження">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="product-card skeleton" key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="state-box state-error">
          <p>{error}</p>
          <button
            className="button"
            type="button"
            onClick={() => setReloadToken((value) => value + 1)}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-box">Нічого не знайдено. Спробуй змінити фільтри.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.thumbnail} alt="" loading="lazy" />
              <div className="product-card-body">
                <h3>{product.title}</h3>
                <p className="muted">{product.category}</p>
                <div className="product-card-meta">
                  <strong>${product.price}</strong>
                  <span>★ {product.rating}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
