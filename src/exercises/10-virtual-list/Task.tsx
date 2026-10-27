import { useMemo, useRef, useState } from "react";
import { generateRows } from "../../data/generate";
import { getVirtualRange } from "./impl";

const ROW_HEIGHT = 52;
const VIEWPORT_HEIGHT = 420;
const OVERSCAN = 4;

export default function VirtualListTask() {
  const rows = useMemo(() => generateRows(10_000), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [jumpTo, setJumpTo] = useState("5000");

  const range = getVirtualRange({
    scrollTop,
    viewportHeight: VIEWPORT_HEIGHT,
    rowHeight: ROW_HEIGHT,
    total: rows.length,
    overscan: OVERSCAN,
  });

  const visible = rows.slice(range.start, range.end);

  const jump = () => {
    const index = Math.max(0, Math.min(rows.length - 1, Number(jumpTo) || 0));
    if (containerRef.current) {
      containerRef.current.scrollTop = index * ROW_HEIGHT;
    }
  };

  return (
    <section className="exercise-workspace">
      <div className="metrics-row">
        <div className="metric">
          <span className="muted">Усього рядків</span>
          <strong>{rows.length.toLocaleString("uk-UA")}</strong>
        </div>
        <div className="metric">
          <span className="muted">У DOM</span>
          <strong>{visible.length}</strong>
        </div>
        <div className="metric">
          <span className="muted">Діапазон</span>
          <strong>
            {range.start}–{range.end}
          </strong>
        </div>
        <div className="metric">
          <span className="muted">scrollTop</span>
          <strong>{Math.round(scrollTop)}</strong>
        </div>
      </div>

      <div className="filters-row">
        <div className="field">
          <label htmlFor="virtual-jump">Перейти до рядка</label>
          <input
            id="virtual-jump"
            type="number"
            min={0}
            max={rows.length - 1}
            value={jumpTo}
            onChange={(event) => setJumpTo(event.target.value)}
          />
        </div>
        <button type="button" className="button" onClick={jump}>
          Скроль до рядка
        </button>
      </div>

      <div
        ref={containerRef}
        className="virtual-viewport"
        style={{ height: VIEWPORT_HEIGHT }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div className="virtual-spacer" style={{ height: range.totalHeight }}>
          <div style={{ transform: `translateY(${range.offsetY}px)` }}>
            {visible.map((row) => (
              <div className="virtual-row" key={row.id} style={{ height: ROW_HEIGHT }}>
                <span className="muted">#{row.id}</span>
                <strong>{row.title}</strong>
                <span>{row.category}</span>
                <span>${row.price}</span>
                <span>★ {row.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="hint-text">
        Прокрути список: у DOM має бути лише ~
        {Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2} рядків замість 10 000.
        Перевір у React DevTools, що кількість `virtual-row` не росте.
      </p>
    </section>
  );
}
