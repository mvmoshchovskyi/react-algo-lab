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

/**
 * Задача 10 (бонус).
 * Порахуй, які рядки рендерити для віртуального списку.
 *
 * TODO:
 * - start = floor(scrollTop / rowHeight) - overscan, не менше 0;
 * - end = ceil((scrollTop + viewportHeight) / rowHeight) + overscan, не більше total;
 * - offsetY = start * rowHeight (для absolute positioning);
 * - totalHeight = total * rowHeight;
 * - захистись від rowHeight <= 0, total <= 0, від'ємного scrollTop;
 * - scrollTop за межами списку клампиться.
 */
export function getVirtualRange(_options: VirtualRangeOptions): VirtualRange {
  // TODO
  return { start: 0, end: 0, offsetY: 0, totalHeight: 0 };
}
