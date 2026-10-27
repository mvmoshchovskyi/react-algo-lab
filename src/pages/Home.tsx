import { Link } from "react-router";
import { exercises, LEVEL_LABELS } from "../exercises/registry";
import { useTestResults } from "../components/TestResultsContext";

export function Home() {
  const { getStats, refresh, loading } = useTestResults();

  const solved = exercises.filter((exercise) => {
    const stats = getStats(exercise.id);
    return stats.total > 0 && stats.failed === 0;
  }).length;

  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">React 19 · TypeScript · DummyJSON</p>
        <h1>
          Тренажер з алгоритмів <span>у React</span>
        </h1>
        <p className="hero-text">
          10 задач на реальних даних: фільтри, сортування, дерева, debounce, LRU,
          пагінація, нескінченний скрол і віртуалізація. У кожній задачі є TODO, тести,
          підказки та референсне рішення.
        </p>
        <div className="hero-actions">
          <Link className="button" to={`/exercise/${exercises[0]!.id}`}>
            Почати з задачі 01
          </Link>
          <a
            className="button button-ghost"
            href="https://dummyjson.com/docs"
            target="_blank"
            rel="noreferrer"
          >
            DummyJSON API
          </a>
        </div>

        <div className="metrics-row">
          <div className="metric">
            <span className="muted">Задач</span>
            <strong>{exercises.length}</strong>
          </div>
          <div className="metric">
            <span className="muted">Вирішено</span>
            <strong>{solved}</strong>
          </div>
          <div className="metric">
            <span className="muted">Товарів у API</span>
            <strong>194</strong>
          </div>
          <div className="metric">
            <span className="muted">Тести</span>
            <strong>Vitest</strong>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Задачі</h2>
          <button
            type="button"
            className="button button-small button-ghost"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? "Оновлюю…" : "Оновити статус"}
          </button>
        </div>
        <div className="exercise-grid">
          {exercises.map((exercise) => {
            const stats = getStats(exercise.id);
            const done = stats.total > 0 && stats.failed === 0;
            return (
              <Link
                className="exercise-card"
                key={exercise.id}
                to={`/exercise/${exercise.id}`}
              >
                <div className="exercise-card-head">
                  <span className="exercise-number large">{exercise.number}</span>
                  <span className={`level-badge level-${exercise.level}`}>
                    {LEVEL_LABELS[exercise.level]}
                  </span>
                </div>
                <h3>{exercise.title}</h3>
                <p className="muted">{exercise.subtitle}</p>
                <p className="exercise-description">{exercise.description}</p>
                <div className="exercise-card-footer">
                  <span className="tag-row">
                    {exercise.tags.slice(0, 2).map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span
                    className={`test-badge ${done ? "is-passed" : stats.failed ? "is-failed" : ""}`}
                  >
                    {stats.total === 0
                      ? "не запускали"
                      : done
                        ? `${stats.passed}/${stats.total} ✓`
                        : `${stats.failed} failed`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section how-to">
        <h2>Як працювати</h2>
        <div className="how-grid">
          <div className="panel">
            <span className="step-number">1</span>
            <h3>Запусти тести</h3>
            <p className="muted">У сусідньому терміналі:</p>
            <pre className="code-block">
              <code>npm run test:watch</code>
            </pre>
          </div>
          <div className="panel">
            <span className="step-number">2</span>
            <h3>Реалізуй TODO</h3>
            <p className="muted">
              Відкрий задачу, вкладку «Умова», і пиши код у файлі{" "}
              <code>src/exercises/&lt;id&gt;/impl.ts</code>.
            </p>
          </div>
          <div className="panel">
            <span className="step-number">3</span>
            <h3>Онови прогрес</h3>
            <p className="muted">
              Після тестів натисни «Оновити статус» — зелена галочка з'явиться в сайдбарі.
            </p>
            <pre className="code-block">
              <code>npm run check</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>Дебаг</h2>
        <div className="panel debug-list">
          <ul>
            <li>
              <strong>Dev Panel</strong> у шапці: штучна затримка DummyJSON і помилка
              наступного запиту.
            </li>
            <li>
              <strong>Chrome DevTools</strong>: постав breakpoint у{" "}
              <code>src/exercises/*/impl.ts</code> — Vite віддає source maps.
            </li>
            <li>
              <strong>React DevTools</strong>: Profiler покаже зайві рендери в задачах 02,
              04, 06.
            </li>
            <li>
              <strong>VS Code</strong>: готова конфігурація{" "}
              <code>.vscode/launch.json</code> для Chrome.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
