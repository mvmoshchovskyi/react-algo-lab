export type PageItem = number | "ellipsis";

export function pageCount(total: number, limit: number): number {
  if (!Number.isFinite(limit) || limit <= 0) return 1;
  if (!Number.isFinite(total) || total <= 0) return 1;
  return Math.max(1, Math.ceil(total / limit));
}

export function clampPage(page: number, totalPages: number): number {
  const maxPage = Math.max(1, Math.floor(totalPages) || 1);
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), maxPage);
}

export function toSkip(page: number, limit: number): number {
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
  return (safePage - 1) * Math.max(0, Math.trunc(limit));
}

export function getPageWindow(
  current: number,
  totalPages: number,
  siblings = 1,
): PageItem[] {
  if (!Number.isFinite(totalPages) || totalPages <= 0) return [];

  const pagesCount = Math.max(1, Math.trunc(totalPages));
  if (pagesCount <= 7) {
    return Array.from({ length: pagesCount }, (_, index) => index + 1);
  }

  const currentPage = clampPage(current, pagesCount);
  const siblingsCount = Math.max(0, Math.trunc(siblings));
  const visible = new Set<number>([1, pagesCount]);

  for (
    let page = currentPage - siblingsCount;
    page <= currentPage + siblingsCount;
    page += 1
  ) {
    if (page >= 1 && page <= pagesCount) visible.add(page);
  }

  const sorted = [...visible].sort((a, b) => a - b);
  const result: PageItem[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index]!;
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) result.push("ellipsis");
    result.push(page);
  }

  return result;
}
