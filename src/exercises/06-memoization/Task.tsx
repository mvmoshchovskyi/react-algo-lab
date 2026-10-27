import { memo, useCallback, useMemo, useRef, useState } from "react";
import { generateNumbers } from "../../data/generate";
import { memoize } from "./impl";

const NUMBERS = generateNumbers(30_000, 5_000, 11);

function isPrime(value: number): boolean {
  if (value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function computeStats(numbers: number[]): { primes: number; sum: number } {
  let primes = 0;
  let sum = 0;
  for (const number of numbers) {
    if (isPrime(number)) {
      primes += 1;
      sum += number * number;
    }
  }
  return { primes, sum };
}

type MemoRowProps = {
  label: string;
  onSelect: (id: number) => void;
};

const MemoRow = memo(function MemoRow({ label, onSelect }: MemoRowProps) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div className="memo-row">
      <button type="button" className="button button-small" onClick={() => onSelect(1)}>
        {label}
      </button>
      <span className="render-badge">рендерів: {renders.current}</span>
    </div>
  );
});

export default function MemoizationTask() {
  const [result, setResult] = useState<{ primes: number; sum: number } | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [cacheSize, setCacheSize] = useState(0);

  const cachedCompute = useMemo(() => memoize(computeStats, 3), []);

  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [stableCallback, setStableCallback] = useState(true);
  const parentRenders = useRef(0);
  parentRenders.current += 1;

  const handleSelect = useCallback((id: number) => setSelected(id), []);
  const handleSelectUnstable = (id: number) => setSelected(id);

  const run = () => {
    const startedAt = performance.now();
    const next = cachedCompute(NUMBERS);
    setElapsed(performance.now() - startedAt);
    setResult(next);
    setCacheSize(cachedCompute.cacheSize());
  };

  return (
    <section className="exercise-workspace">
      <div className="panel">
        <h3>Memoize + LRU</h3>
        <p className="muted">
          {NUMBERS.length.toLocaleString("uk-UA")} чисел, пошук простих і сума квадратів.
          Перший виклик повільний, повторний має бути майже миттєвим.
        </p>
        <div className="filters-row">
          <button type="button" className="button" onClick={run}>
            Порахувати
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => {
              setResult(null);
              setElapsed(null);
              setCacheSize(0);
            }}
          >
            Скинути результат
          </button>
        </div>
        <div className="metrics-row">
          <div className="metric">
            <span className="muted">Час</span>
            <strong>{elapsed === null ? "—" : `${elapsed.toFixed(2)} мс`}</strong>
          </div>
          <div className="metric">
            <span className="muted">Простих чисел</span>
            <strong>{result?.primes ?? "—"}</strong>
          </div>
          <div className="metric">
            <span className="muted">Сума квадратів</span>
            <strong>{result?.sum.toLocaleString("uk-UA") ?? "—"}</strong>
          </div>
          <div className="metric">
            <span className="muted">Записів у кеші</span>
            <strong>{cacheSize}</strong>
          </div>
        </div>
        <p className="hint-text">
          Натисни «Порахувати» двічі: другий раз має бути ~0 мс, бо аргумент той самий.
        </p>
      </div>

      <div className="panel">
        <h3>React.memo + useCallback</h3>
        <p className="muted">
          Батько: {parentRenders.current} рендерів · обраний id: {selected ?? "—"}
        </p>
        <div className="filters-row">
          <button
            type="button"
            className="button"
            onClick={() => setTick((value) => value + 1)}
          >
            Оновити батька ({tick})
          </button>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={stableCallback}
              onChange={(event) => setStableCallback(event.target.checked)}
            />
            стабільний onSelect
          </label>
        </div>
        <MemoRow
          label="Дочірній компонент"
          onSelect={stableCallback ? handleSelect : handleSelectUnstable}
        />
        <p className="hint-text">
          Зі стабільним callback дитина не рендериться при зміні батька. Вимкни галочку —
          лічильник почне рости.
        </p>
      </div>
    </section>
  );
}
