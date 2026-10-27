import type { ComponentType } from "react";
import SearchFilterTask from "./01-search-filter/Task";
import SortingTask from "./02-sorting/Task";
import CollectionsTask from "./03-collections/Task";
import DebounceThrottleTask from "./04-debounce-throttle/Task";
import CommentsTreeTask from "./05-comments-tree/Task";
import MemoizationTask from "./06-memoization/Task";
import PaginationTask from "./07-pagination/Task";
import InfiniteScrollTask from "./08-infinite-scroll/Task";
import TopKFrequentTask from "./09-top-k-frequent/Task";
import VirtualListTask from "./10-virtual-list/Task";

import searchFilterReadme from "./01-search-filter/README.md?raw";
import sortingReadme from "./02-sorting/README.md?raw";
import collectionsReadme from "./03-collections/README.md?raw";
import debounceReadme from "./04-debounce-throttle/README.md?raw";
import commentsReadme from "./05-comments-tree/README.md?raw";
import memoizationReadme from "./06-memoization/README.md?raw";
import paginationReadme from "./07-pagination/README.md?raw";
import infiniteReadme from "./08-infinite-scroll/README.md?raw";
import topKReadme from "./09-top-k-frequent/README.md?raw";
import virtualReadme from "./10-virtual-list/README.md?raw";

import searchFilterSolution from "./01-search-filter/solution/impl.ts?raw";
import sortingSolution from "./02-sorting/solution/impl.ts?raw";
import collectionsSolution from "./03-collections/solution/impl.ts?raw";
import debounceSolution from "./04-debounce-throttle/solution/impl.ts?raw";
import commentsSolution from "./05-comments-tree/solution/impl.ts?raw";
import memoizationSolution from "./06-memoization/solution/impl.ts?raw";
import paginationSolution from "./07-pagination/solution/impl.ts?raw";
import infiniteSolution from "./08-infinite-scroll/solution/impl.ts?raw";
import topKSolution from "./09-top-k-frequent/solution/impl.ts?raw";
import virtualSolution from "./10-virtual-list/solution/impl.ts?raw";

export type ExerciseLevel = "base" | "middle" | "advanced" | "bonus";

export type ExerciseMeta = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  level: ExerciseLevel;
  tags: string[];
  readme: string;
  solution: string;
  Task: ComponentType;
};

export const LEVEL_LABELS: Record<ExerciseLevel, string> = {
  base: "база",
  middle: "середній",
  advanced: "складно",
  bonus: "бонус",
};

export const exercises: ExerciseMeta[] = [
  {
    id: "01-search-filter",
    number: "01",
    title: "Search & Filter",
    subtitle: "Фільтри, URL, useMemo",
    description: "Фільтрація 194 товарів за запитом, категорією, ціною та рейтингом.",
    level: "base",
    tags: ["filter", "useMemo", "URLSearchParams"],
    readme: searchFilterReadme,
    solution: searchFilterSolution,
    Task: SearchFilterTask,
  },
  {
    id: "02-sorting",
    number: "02",
    title: "Sortable Table",
    subtitle: "Стабільне сортування без мутацій",
    description: "Цикл asc → desc → none, tie-break за id, aria-sort і копія масиву.",
    level: "base",
    tags: ["sort", "immutability", "a11y"],
    readme: sortingReadme,
    solution: sortingSolution,
    Task: SortingTask,
  },
  {
    id: "03-collections",
    number: "03",
    title: "Map & Set",
    subtitle: "Колекції та O(1) lookup",
    description:
      "Кошик на useReducer, групування, дедуплікація тегів і Map<id, Product>.",
    level: "base",
    tags: ["Map", "Set", "useReducer"],
    readme: collectionsReadme,
    solution: collectionsSolution,
    Task: CollectionsTask,
  },
  {
    id: "04-debounce-throttle",
    number: "04",
    title: "Debounce & Throttle",
    subtitle: "Контроль частоти подій",
    description:
      "Власні хуки debounce/throttle, leading + trailing, cleanup, AbortController.",
    level: "middle",
    tags: ["custom hooks", "timers", "abort"],
    readme: debounceReadme,
    solution: debounceSolution,
    Task: DebounceThrottleTask,
  },
  {
    id: "05-comments-tree",
    number: "05",
    title: "Comments Tree",
    subtitle: "Flat → nested, рекурсія",
    description: "Побудова дерева через Map, підрахунок нащадків, фільтр із батьками.",
    level: "middle",
    tags: ["recursion", "tree", "Map"],
    readme: commentsReadme,
    solution: commentsSolution,
    Task: CommentsTreeTask,
  },
  {
    id: "06-memoization",
    number: "06",
    title: "Memoization & LRU",
    subtitle: "Кеш, useMemo, React.memo",
    description: "LRU-кеш на Map, замір часу, стабільні callback і лічильники рендерів.",
    level: "middle",
    tags: ["memoize", "LRU", "React.memo"],
    readme: memoizationReadme,
    solution: memoizationSolution,
    Task: MemoizationTask,
  },
  {
    id: "07-pagination",
    number: "07",
    title: "Pagination",
    subtitle: "Offset-пагінація та вікно сторінок",
    description: "skip/limit, URL, клампінг невалідної сторінки, еліпсиси.",
    level: "middle",
    tags: ["pagination", "URL", "math"],
    readme: paginationReadme,
    solution: paginationSolution,
    Task: PaginationTask,
  },
  {
    id: "08-infinite-scroll",
    number: "08",
    title: "Infinite Scroll",
    subtitle: "IntersectionObserver + skip/limit",
    description: "Накопичення сторінок, дедуплікація, abort, retry і кінець списку.",
    level: "advanced",
    tags: ["IntersectionObserver", "abort", "race conditions"],
    readme: infiniteReadme,
    solution: infiniteSolution,
    Task: InfiniteScrollTask,
  },
  {
    id: "09-top-k-frequent",
    number: "09",
    title: "Top K Frequent",
    subtitle: "Map + bucket sort",
    description: "Top-k елементів за частотою з tie-break і бенчмарком на 100 000 чисел.",
    level: "advanced",
    tags: ["bucket sort", "Map", "O(n)"],
    readme: topKReadme,
    solution: topKSolution,
    Task: TopKFrequentTask,
  },
  {
    id: "10-virtual-list",
    number: "10",
    title: "Virtual List",
    subtitle: "Віконний рендеринг 10 000 рядків",
    description: "Розрахунок видимого діапазону, overscan і absolute positioning.",
    level: "bonus",
    tags: ["virtualization", "scroll", "math"],
    readme: virtualReadme,
    solution: virtualSolution,
    Task: VirtualListTask,
  },
];

export function findExercise(id: string | undefined): ExerciseMeta | undefined {
  return exercises.find((exercise) => exercise.id === id);
}
