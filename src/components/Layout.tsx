import { Link, NavLink, Outlet } from "react-router";
import { exercises } from "../exercises/registry";
import { useTestResults } from "./TestResultsContext";
import { DevPanel } from "./DevPanel";

export function Layout() {
  const { getStats, loading, refresh } = useTestResults();

  const solved = exercises.filter((exercise) => {
    const stats = getStats(exercise.id);
    return stats.total > 0 && stats.failed === 0;
  }).length;
  const progress = Math.round((solved / exercises.length) * 100);

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">{"{ }"}</span>
          <span>
            <strong>Algo Lab</strong>
            <small>алгоритми в React</small>
          </span>
        </Link>
        <div className="topbar-actions">
          <DevPanel />
        </div>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <div className="progress-card">
            <div className="progress-head">
              <span>Прогрес</span>
              <strong>
                {solved} / {exercises.length}
              </strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <button
              type="button"
              className="button button-small button-ghost"
              onClick={refresh}
              disabled={loading}
            >
              {loading ? "Читаю…" : "Оновити статус тестів"}
            </button>
          </div>

          <NavLink
            to="/"
            end
            aria-label="Огляд"
            className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
          >
            <span className="exercise-number">—</span>
            <span className="nav-title">Огляд</span>
          </NavLink>

          <nav className="exercise-nav" aria-label="Задачі">
            {exercises.map((exercise) => {
              const stats = getStats(exercise.id);
              const statusClass =
                stats.total === 0
                  ? "is-empty"
                  : stats.failed > 0
                    ? "is-failed"
                    : "is-passed";
              return (
                <NavLink
                  key={exercise.id}
                  to={`/exercise/${exercise.id}`}
                  aria-label={`${exercise.number}. ${exercise.title}`}
                  className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
                >
                  <span className="exercise-number">{exercise.number}</span>
                  <span className="nav-title">{exercise.title}</span>
                  <span className={`status-dot ${statusClass}`} aria-hidden="true">
                    {stats.total === 0 ? "·" : stats.failed > 0 ? "✕" : "✓"}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <p className="sidebar-note">
            Дані — реальний <a href="https://dummyjson.com/docs">DummyJSON</a>. Потрібен
            інтернет для задач 01–03, 07, 08.
          </p>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
