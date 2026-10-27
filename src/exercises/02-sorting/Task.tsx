import { useEffect, useMemo, useState } from "react";
import { fetchAllProducts, isAbortError } from "../../api/dummyjson";
import type { Product } from "../../api/types";
import { nextSortState, sortRows, type SortKey, type SortState } from "./impl";

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "title", label: "Назва", numeric: false },
  { key: "price", label: "Ціна", numeric: true },
  { key: "rating", label: "Рейтинг", numeric: true },
  { key: "stock", label: "На складі", numeric: true },
];

function ariaSort(sort: SortState, key: SortKey): "ascending" | "descending" | "none" {
  if (!sort || sort.key !== key) return "none";
  return sort.direction === "asc" ? "ascending" : "descending";
}

export default function SortingTask() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchAllProducts(controller.signal)
      .then((response) => {
        setProducts(response.products);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught)) return;
        setError(caught instanceof Error ? caught.message : "Невідома помилка");
        setLoading(false);
      });
    return () => controller.abort();
  }, [reloadToken]);

  const sorted = useMemo(() => sortRows(products, sort), [products, sort]);

  return (
    <section className="exercise-workspace">
      <div className="results-head">
        <span>
          {sort ? (
            <>
              Сортування:{" "}
              <strong>{COLUMNS.find((column) => column.key === sort.key)?.label}</strong>{" "}
              {sort.direction === "asc" ? "↑" : "↓"}
            </>
          ) : (
            "Без сортування — клікни заголовок"
          )}
        </span>
        <span className="muted">Tie-break: id за зростанням</span>
      </div>

      {loading ? (
        <div className="state-box">Завантажую товари…</div>
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
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.key} aria-sort={ariaSort(sort, column.key)}>
                    <button
                      type="button"
                      className="sort-button"
                      onClick={() =>
                        setSort((current) => nextSortState(current, column.key))
                      }
                    >
                      {column.label}
                      <span aria-hidden="true">
                        {sort?.key === column.key
                          ? sort.direction === "asc"
                            ? " ↑"
                            : " ↓"
                          : " ↕"}
                      </span>
                    </button>
                  </th>
                ))}
                <th>Категорія</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td className="numeric">${product.price}</td>
                  <td className="numeric">★ {product.rating}</td>
                  <td className="numeric">{product.stock}</td>
                  <td>{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
