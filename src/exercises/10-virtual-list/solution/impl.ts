export type VirtualRange = {
  start: number;
  end: number;
  offsetY: number;
  totalHeight: number;
};

export type VirtualRangeOptions = {
  scrollTop: number;
  viewportHeight: number;
  rowHeight: number;
  total: number;
  overscan?: number;
};

export function getVirtualRange(options: VirtualRangeOptions): VirtualRange {
  const { scrollTop, viewportHeight, rowHeight, total, overscan = 4 } = options;

  if (
    !Number.isFinite(rowHeight) ||
    rowHeight <= 0 ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return { start: 0, end: 0, offsetY: 0, totalHeight: 0 };
  }

  const safeTotal = Math.max(0, Math.trunc(total));
  const safeViewport = Math.max(0, viewportHeight);
  const safeOverscan = Math.max(0, Math.trunc(overscan));
  const totalHeight = safeTotal * rowHeight;
  const maxScrollTop = Math.max(0, totalHeight - safeViewport);
  const safeScrollTop = Math.min(Math.max(0, scrollTop), maxScrollTop);

  const start = Math.max(0, Math.floor(safeScrollTop / rowHeight) - safeOverscan);
  const end = Math.min(
    safeTotal,
    Math.ceil((safeScrollTop + safeViewport) / rowHeight) + safeOverscan,
  );

  return {
    start,
    end: Math.max(start, end),
    offsetY: start * rowHeight,
    totalHeight,
  };
}
