import { useEffect, useRef, useState } from "react";
import { isAbortError, searchProducts } from "../../api/dummyjson";
import type { Product } from "../../api/types";
import { useDebouncedValue, useThrottledCallback } from "./impl";

export default function DebounceThrottleTask() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  const [moves, setMoves] = useState(0);
  const [throttledMoves, setThrottledMoves] = useState(0);
  const movesRef = useRef(0);

  const debouncedQuery = useDebouncedValue(query, 450);
  const updateThrottledMoves = useThrottledCallback((count: number) => {
    setThrottledMoves(count);
  }, 250);
  const debouncedMoves = useDebouncedValue(moves, 400);

  useEffect(() => {
    const controller = new AbortController();
    setSearching(true);
    setError(null);
    setRequestCount((count) => count + 1);

    searchProducts(debouncedQuery, controller.signal)
      .then((response) => {
        setResults(response.products.slice(0, 8));
        setSearching(false);
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught)) return;
        setError(caught instanceof Error ? caught.message : "Невідома помилка");
        setSearching(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <section className="exercise-workspace">
      <div className="panel">
        <h3>Debounced пошук</h3>
        <div className="field">
          <label htmlFor="debounce-query">Запит</label>
          <input
            id="debounce-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Почни вводити: phone, apple, chair…"
          />
        </div>
        <div className="metrics-row">
          <div className="metric">
            <span className="muted">Введено</span>
            <strong>{query || "—"}</strong>
          </div>
          <div className="metric">
            <span className="muted">Debounced</span>
            <strong>{debouncedQuery || "—"}</strong>
          </div>
          <div className="metric">
            <span className="muted">Запитів до API</span>
            <strong>{requestCount}</strong>
          </div>
        </div>
        {searching ? (
          <p className="muted">Шукаю…</p>
        ) : error ? (
          <p className="state-error">{error}</p>
        ) : (
          <ul className="result-list">
            {results.map((product) => (
              <li key={product.id}>
                <span>{product.title}</span>
                <span className="muted">${product.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h3>Throttle на mousemove</h3>
        <p className="muted">Поводи мишкою над полем — лічильники мають розійтися.</p>
        <div
          className="mousemove-zone"
          onMouseMove={() => {
            movesRef.current += 1;
            setMoves(movesRef.current);
            updateThrottledMoves(movesRef.current);
          }}
        >
          Рухай мишкою тут
        </div>
        <div className="metrics-row">
          <div className="metric">
            <span className="muted">Raw mousemove</span>
            <strong>{moves}</strong>
          </div>
          <div className="metric">
            <span className="muted">Debounced (400 мс)</span>
            <strong>{debouncedMoves}</strong>
          </div>
          <div className="metric">
            <span className="muted">Throttled (250 мс)</span>
            <strong>{throttledMoves}</strong>
          </div>
        </div>
      </div>

      <div className="panel hint-panel">
        <p>
          У Dev Panel увімкни затримку 800–1500 мс і швидко вводь запит. У Network побачиш
          скасовані запити — це працює <code>AbortController</code>.
        </p>
      </div>
    </section>
  );
}
