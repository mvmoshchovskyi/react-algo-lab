import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Markdown } from "../components/Markdown";
import { Tabs } from "../components/Tabs";
import { useTestResults } from "../components/TestResultsContext";
import { exercises, findExercise, LEVEL_LABELS } from "../exercises/registry";

export function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const exercise = findExercise(id);
  const { getStats, error, refresh } = useTestResults();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!exercise) {
    return (
      <div className="state-box">
        <h2>Задачу не знайдено</h2>
        <Link className="button" to="/">
          На огляд
        </Link>
      </div>
    );
  }

  const stats = getStats(exercise.id);
  const done = stats.total > 0 && stats.failed === 0;
  const index = exercises.findIndex((item) => item.id === exercise.id);
  const previous = exercises[index - 1];
  const next = exercises[index + 1];
  const TaskComponent = exercise.Task;

  const copySolution = async () => {
    try {
      await navigator.clipboard.writeText(exercise.solution);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="exercise-page">
      <div className="page-head">
        <div className="breadcrumb">
          <Link to="/">Огляд</Link>
          <span>/</span>
          <span>Задача {exercise.number}</span>
        </div>

        <div className="page-title-row">
          <span className="exercise-number xl">{exercise.number}</span>
          <div>
            <h1>{exercise.title}</h1>
            <p className="muted">{exercise.description}</p>
          </div>
          <span className={`level-badge level-${exercise.level}`}>
            {LEVEL_LABELS[exercise.level]}
          </span>
        </div>

        <div className="page-meta">
          <span className="tag-row">
            {exercise.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </span>
          <span
            className={`test-badge ${done ? "is-passed" : stats.failed ? "is-failed" : ""}`}
          >
            {stats.total === 0
              ? "тести ще не запускали"
              : done
                ? `${stats.passed}/${stats.total} passed`
                : `${stats.failed} failed · ${stats.passed} passed`}
          </span>
        </div>
      </div>

      <Tabs defaultValue="task">
        <Tabs.List>
          <Tabs.Trigger value="task">Умова</Tabs.Trigger>
          <Tabs.Trigger value="sandbox">Пісочниця</Tabs.Trigger>
          <Tabs.Trigger value="tests">Тести</Tabs.Trigger>
          <Tabs.Trigger value="solution">Рішення</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="task">
          <div className="panel readme-panel">
            <Markdown source={exercise.readme} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="sandbox">
          <div className="sandbox-note">
            Пиши код у <code>src/exercises/{exercise.id}/impl.ts</code>. UI уже
            підключений і почне працювати після реалізації.
          </div>
          <ErrorBoundary>
            <TaskComponent />
          </ErrorBoundary>
        </Tabs.Panel>

        <Tabs.Panel value="tests">
          <div className="panel">
            <div className="section-head">
              <h3>Результати Vitest</h3>
              <button
                type="button"
                className="button button-small button-ghost"
                onClick={refresh}
              >
                Оновити
              </button>
            </div>

            {error && <p className="muted">{error}</p>}

            {stats.total === 0 ? (
              <p className="muted">
                Для цієї задачі ще немає результатів. Запусти тести й онови статус.
              </p>
            ) : (
              <ul className="test-list">
                {stats.tests.map((test, testIndex) => (
                  <li
                    key={`${test.title}-${testIndex}`}
                    className={`test-${test.status}`}
                  >
                    <span aria-hidden="true">
                      {test.status === "passed"
                        ? "✓"
                        : test.status === "failed"
                          ? "✕"
                          : "·"}
                    </span>
                    <span>{test.title}</span>
                  </li>
                ))}
              </ul>
            )}

            <h4>Команди</h4>
            <pre className="code-block">
              <code>{`npm test -- ${exercise.id}\nnpm run test:watch\nnpm run check`}</code>
            </pre>
            <p className="muted">
              <code>npm run check</code> записує результати в{" "}
              <code>public/test-results.json</code>, після чого прогрес з'являється в
              сайдбарі.
            </p>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="solution">
          <div className="panel solution-panel">
            <div className="section-head">
              <div>
                <h3>Референсне рішення</h3>
                <p className="muted">
                  Краще підглядати після власної спроби. Файл:{" "}
                  <code>src/exercises/{exercise.id}/solution/impl.ts</code>
                </p>
              </div>
              <button
                type="button"
                className="button button-small"
                onClick={copySolution}
              >
                {copied ? "Скопійовано" : "Копіювати"}
              </button>
            </div>
            <pre className="code-block solution-code">
              <code>{exercise.solution}</code>
            </pre>
          </div>
        </Tabs.Panel>
      </Tabs>

      <nav className="page-nav" aria-label="Між задачами">
        {previous ? (
          <Link className="button button-ghost" to={`/exercise/${previous.id}`}>
            ← {previous.number}. {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="button button-ghost" to={`/exercise/${next.id}`}>
            {next.number}. {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
