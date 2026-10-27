import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchProductsPage, isAbortError } from "../../api/dummyjson";
import type { Product } from "../../api/types";
import { clampPage, getPageWindow, pageCount, toSkip } from "./impl";

const LIMITS = [10, 20, 50];

function positiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
}

export default function PaginationTask() {
  const [params, setParams] = useSearchParams();
  const page = positiveInt(params.get("page"), 1);
  const limit = LIMITS.includes(Number(params.get("limit")))
    ? Number(params.get("limit"))
    : 20;

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const totalPages = pageCount(total, limit);
  const safePage = clampPage(page, totalPages);
  const skip = toSkip(safePage, limit);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProductsPage({ limit, skip, signal: controller.signal })
      .then((response) => {
        setProducts(response.products);
        setTotal(response.total);
        setLoading(false);

        const maxPage = pageCount(response.total, limit);
        if (page > maxPage) {
          setParams(
            (current) => {
              const next = new URLSearchParams(current);
              next.set("page", String(maxPage));
              next.set("limit", String(limit));
              return next;
            },
            { replace: true },
          );
        }
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught)) return;
        setError(caught instanceof Error ? caught.message : "Невідома помилка");
        setLoading(false);
      });

    return () => controller.abort();
  }, [limit, page, skip, setParams, reloadToken]);

  const windowItems = useMemo(
    () => getPageWindow(safePage, totalPages),
    [safePage, totalPages],
  );

  const goTo = (nextPage: number) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set("page", String(clampPage(nextPage, totalPages)));
      next.set("limit", String(limit));
      return next;
    });
  };

  const changeLimit = (nextLimit: number) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set("limit", String(nextLimit));
      next.set("page", "1");
      return next;
    });
  };

  const firstItem = total === 0 ? 0 : skip + 1;
  const lastItem = Math.min(skip + limit, total);

  return (
    <section className="exercise-workspace">
      <div className="results-head">
        <span>
          {firstItem}–{lastItem} з {total} · сторінка {safePage} / {totalPages}
        </span>
        <label className="inline-field">
          На сторінці:
          <select
            value={limit}
            onChange={(event) => changeLimit(Number(event.target.value))}
          >
            {LIMITS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!products.length && loading ? (
        <div className="state-box">Завантажую сторінку…</div>
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
      ) : (
        <div className={`table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ціна</th>
                <th>Рейтинг</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td className="numeric">{skip + index + 1}</td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td className="numeric">${product.price}</td>
                  <td className="numeric">★ {product.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="pagination" aria-label="Пагінація">
        <button
          type="button"
          className="button button-ghost"
          onClick={() => goTo(safePage - 1)}
          disabled={safePage <= 1 || loading}
        >
          ← Назад
        </button>

        {windowItems.map((item, index) =>
          item === "ellipsis" ? (
            <span className="pagination-ellipsis" key={`ellipsis-${index}`}>
              …
            </span>
          ) : (
            <button
              type="button"
              key={item}
              className={`button page-button ${item === safePage ? "is-active" : ""}`}
              aria-current={item === safePage ? "page" : undefined}
              onClick={() => goTo(item)}
              disabled={loading}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className="button button-ghost"
          onClick={() => goTo(safePage + 1)}
          disabled={safePage >= totalPages || loading}
        >
          Вперед →
        </button>
      </nav>

      <p className="hint-text">
        Спробуй URL <code>?page=999</code> — сторінка має скинутися до останньої. Зміна
        ліміту скидає на першу сторінку.
      </p>
    </section>
  );
}
