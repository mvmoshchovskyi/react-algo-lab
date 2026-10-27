import {
  armFailNext,
  resetDevSettings,
  setDelay,
  useDevSettings,
} from "../api/devSettings";
import { clearApiCache } from "../api/dummyjson";

export function DevPanel() {
  const { delay, failNext } = useDevSettings();

  return (
    <div className="dev-panel" aria-label="Інструменти дебагу">
      <label className="inline-field">
        Delay
        <select value={delay} onChange={(event) => setDelay(Number(event.target.value))}>
          <option value={0}>0 мс</option>
          <option value={300}>300 мс</option>
          <option value={800}>800 мс</option>
          <option value={1500}>1500 мс</option>
        </select>
      </label>

      <button
        type="button"
        className={`button button-small ${failNext ? "button-danger" : "button-ghost"}`}
        onClick={armFailNext}
        disabled={failNext}
        title="Наступний запит до DummyJSON отримає 500"
      >
        {failNext ? "Зламаю наступний" : "Зламати next"}
      </button>

      <button
        type="button"
        className="button button-small button-ghost"
        onClick={() => {
          clearApiCache();
          resetDevSettings();
        }}
        title="Скинути delay, failNext і кеш запитів"
      >
        Reset
      </button>
    </div>
  );
}
