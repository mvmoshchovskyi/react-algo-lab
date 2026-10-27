import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCategories, fetchProductsPage, isAbortError } from "../../api/dummyjson";
import type { Category } from "../../api/types";
import { hasMore, useInfiniteList } from "./impl";

export default function InfiniteScrollTask() {
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch((caught: unknown) => {
        if (!isAbortError(caught)) console.error(caught);
      });
    return () => controller.abort();
  }, []);

  const loadPage = useCallback(
    async (skip: number, limit: number, signal: AbortSignal) => {
      const response = await fetchProductsPage({
        skip,
        limit,
        category: category === "all" ? undefined : category,
        signal,
      });
      return { items: response.products, total: response.total };
    },
    [category],
  );

  const { items, total, status, error, loadMore, retry } = useInfiniteList(loadPage, {
    pageSize: 20,
    resetKey: category,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && status !== "loading" && status !== "done" && status !== "error") {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, status]);

  const done = status === "done" || !hasMore(items.length, total);

  return (
    <section className="exercise-workspace">
      <div className="panel filters-panel">
        <div className="field">
          <label htmlFor="infinite-category">Категорія</label>
          <select
            id="infinite-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Усі категорії</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="metric">
          <span className="muted">Завантажено</span>
          <strong>
            {items.length} / {total}
          </strong>
        </div>
      </div>

      {items.length === 0 && status === "loading" ? (
        <div className="state-box">Завантажую першу сторінку…</div>
      ) : error ? (
        <div className="state-box state-error">
          <p>{error}</p>
          <button type="button" className="button" onClick={() => void retry()}>
            Спробувати ще раз
          </button>
        </div>
      ) : (
        <ul className="infinite-list">
          {items.map((product) => (
            <li key={product.id}>
              <img src={product.thumbnail} alt="" loading="lazy" />
              <div>
                <strong>{product.title}</strong>
                <span className="muted">
                  {product.category} · ★ {product.rating}
                </span>
              </div>
              <span>${product.price}</span>
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {status === "loading" && items.length > 0 ? (
        <p className="muted centered">Завантажую наступну сторінку…</p>
      ) : null}

      {status === "error" ? null : done && items.length > 0 ? (
        <p className="muted centered">
          Це все — {items.length} товарів. Більше сторінок немає.
        </p>
      ) : (
        <div className="centered">
          <button
            type="button"
            className="button button-ghost"
            onClick={() => void loadMore()}
            disabled={status === "loading"}
          >
            Завантажити ще
          </button>
        </div>
      )}

      <p className="hint-text">
        У Dev Panel натисни «Зламати наступний запит» і проскроль донизу — з'явиться
        помилка з retry. Зміна категорії посеред завантаження скасовує попередній запит.
      </p>
    </section>
  );
}
