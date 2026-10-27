import { useEffect, useMemo, useReducer, useState } from "react";
import { fetchAllProducts, isAbortError } from "../../api/dummyjson";
import type { Product } from "../../api/types";
import {
  buildProductMap,
  cartReducer,
  cartTotal,
  groupByCategory,
  topCategories,
  uniqueTags,
} from "./impl";

export default function CollectionsTask() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, dispatch] = useReducer(cartReducer, {});
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

  const byId = useMemo(() => buildProductMap(products), [products]);
  const groups = useMemo(() => groupByCategory(products), [products]);
  const tags = useMemo(() => uniqueTags(products), [products]);
  const top = useMemo(() => topCategories(groups, 5), [groups]);
  const total = cartTotal(cart, byId);
  const cartLines = Object.entries(cart)
    .map(([id, quantity]) => ({ product: byId.get(Number(id)), quantity }))
    .filter((line): line is { product: Product; quantity: number } =>
      Boolean(line.product),
    );

  return (
    <section className="exercise-workspace">
      <div className="collections-layout">
        <div className="panel">
          <h3>Кошик</h3>
          {cartLines.length === 0 ? (
            <p className="muted">Порожньо. Додай товар із каталогу.</p>
          ) : (
            <ul className="cart-list">
              {cartLines.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>{product.title}</span>
                  <span className="cart-controls">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "remove", id: product.id })}
                    >
                      −
                    </button>
                    <strong>{quantity}</strong>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "add", id: product.id })}
                    >
                      +
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-total">
            <span>Разом</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => dispatch({ type: "clear" })}
          >
            Очистити кошик
          </button>
        </div>

        <div className="panel">
          <h3>Топ категорій</h3>
          <ol className="bar-list">
            {top.map((entry) => (
              <li key={entry.category}>
                <span>{entry.category}</span>
                <span
                  className="bar"
                  style={{ width: `${Math.min(100, entry.count * 8)}%` }}
                />
                <strong>{entry.count}</strong>
              </li>
            ))}
          </ol>
          <h3>Теги ({tags.length})</h3>
          <div className="tag-cloud">
            {tags.slice(0, 28).map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
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
        <div className="product-grid">
          {products.slice(0, 24).map((product) => (
            <article className="product-card" key={product.id}>
              <img src={product.thumbnail} alt="" loading="lazy" />
              <div className="product-card-body">
                <h3>{product.title}</h3>
                <p className="muted">{product.category}</p>
                <div className="product-card-meta">
                  <strong>${product.price}</strong>
                  <button
                    type="button"
                    className="button button-small"
                    onClick={() => dispatch({ type: "add", id: product.id })}
                  >
                    Додати
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
