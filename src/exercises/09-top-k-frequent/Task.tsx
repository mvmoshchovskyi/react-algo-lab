import { useMemo, useState } from "react";
import { generateNumbers } from "../../data/generate";
import { topKFrequent } from "./impl";

const PRESETS = [
  { label: "[1,1,1,2,2,3], k=2", nums: [1, 1, 1, 2, 2, 3], k: 2 },
  { label: "[4,4,5,5,6], k=2", nums: [4, 4, 5, 5, 6], k: 2 },
  { label: "[1], k=1", nums: [1], k: 1 },
];

export default function TopKFrequentTask() {
  const [nums, setNums] = useState<number[]>(() => generateNumbers(100_000, 2_000, 21));
  const [k, setK] = useState(15);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [computed, setComputed] = useState<{ value: number; count: number }[]>([]);

  const result = useMemo(() => topKFrequent(nums, k), [nums, k]);

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const number of nums) map.set(number, (map.get(number) ?? 0) + 1);
    return map;
  }, [nums]);

  const run = () => {
    const startedAt = performance.now();
    const top = topKFrequent(nums, k);
    const duration = performance.now() - startedAt;
    setElapsed(duration);
    setComputed(
      top.map((value) => ({
        value,
        count: counts.get(value) ?? 0,
      })),
    );
  };

  const maxCount = Math.max(1, ...computed.map((item) => item.count));

  return (
    <section className="exercise-workspace">
      <div className="panel">
        <h3>topKFrequent</h3>
        <p className="muted">
          {nums.length.toLocaleString("uk-UA")} чисел у діапазоні 1..2000. k = {k}.
        </p>
        <div className="filters-row">
          <div className="field">
            <label htmlFor="top-k">k</label>
            <input
              id="top-k"
              type="number"
              min={1}
              max={counts.size}
              value={k}
              onChange={(event) => setK(Math.max(1, Number(event.target.value) || 1))}
            />
          </div>
          <button type="button" className="button" onClick={run}>
            Запустити бенчмарк
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setNums(generateNumbers(100_000, 2_000, Date.now() % 100_000))}
          >
            Нові дані
          </button>
        </div>
        <div className="metrics-row">
          <div className="metric">
            <span className="muted">Час</span>
            <strong>{elapsed === null ? "—" : `${elapsed.toFixed(2)} мс`}</strong>
          </div>
          <div className="metric">
            <span className="muted">Унікальних чисел</span>
            <strong>{counts.size.toLocaleString("uk-UA")}</strong>
          </div>
          <div className="metric">
            <span className="muted">Перший елемент</span>
            <strong>{result[0] ?? "—"}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Малі приклади</h3>
        <div className="filters-row">
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.label}
              className="button button-ghost"
              onClick={() => {
                setNums(preset.nums);
                setK(preset.k);
                setElapsed(null);
                setComputed([]);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p>
          <code>
            topKFrequent([{nums.slice(0, 12).join(", ")}
            {nums.length > 12 ? ", …" : ""}], {k}) = [{result.slice(0, 12).join(", ")}
            {result.length > 12 ? ", …" : ""}]
          </code>
        </p>
      </div>

      {computed.length > 0 && (
        <div className="panel">
          <h3>Результат</h3>
          <ol className="bar-list">
            {computed.map((item) => (
              <li key={item.value}>
                <span>{item.value}</span>
                <span
                  className="bar"
                  style={{ width: `${Math.max(2, (item.count / maxCount) * 100)}%` }}
                />
                <strong>{item.count}</strong>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="hint-text">
        Перевір tie-break: [4,4,5,5,6], k=2 → [4,5], а не [5,4]. Для 100 000 елементів
        bucket sort має бути швидшим за сортування всіх унікальних значень.
      </p>
    </section>
  );
}
