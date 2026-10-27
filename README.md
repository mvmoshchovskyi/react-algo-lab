# Algo Lab — тренажер з алгоритмів у React

Окремий навчальний проєкт: 10 задач на реальних даних [DummyJSON](https://dummyjson.com/docs), TypeScript, React 19, Vite, Vitest. У кожній задачі є:

- умова та підказки;
- стартовий код із `TODO` у `impl.ts`;
- тести, які спочатку падають (TDD);
- референсне рішення в `solution/impl.ts`;
- жива пісочниця в браузері.

## Швидкий старт

```bash
cd algo-lab
npm install
npm run dev
```

Відкрий http://localhost:5173.

У другому терміналі — тести в watch-режимі:

```bash
npm run test:watch
```

Після першого запуску тестів натисни в застосунку **«Оновити статус тестів»** — у сайдбарі з'являться зелені/червоні позначки.

> `npm test` на старті очікувано падає: 50 із 57 тестів перевіряють ще не написані функції. Це нормально.

## Задачі

| #   | Задача               | Дані                         | Що тренуємо                                       |
| --- | -------------------- | ---------------------------- | ------------------------------------------------- |
| 01  | Search & Filter      | DummyJSON `/products`        | `filter`, `useMemo`, URL-стан                     |
| 02  | Sortable Table       | DummyJSON `/products`        | стабільне сортування, імутабельність, `aria-sort` |
| 03  | Map & Set            | DummyJSON `/products`        | `Map`, `Set`, `useReducer`, O(1) lookup           |
| 04  | Debounce & Throttle  | DummyJSON `/products/search` | custom hooks, таймери, cleanup, abort             |
| 05  | Comments Tree        | локальний фікстур            | flat → tree, рекурсія, фільтр із батьками         |
| 06  | Memoization & LRU    | seeded RNG                   | `memoize`, LRU, `useMemo`, `React.memo`           |
| 07  | Pagination           | DummyJSON `/products?skip`   | `skip/limit`, вікно сторінок, еліпсиси            |
| 08  | Infinite Scroll      | DummyJSON `/products?skip`   | `IntersectionObserver`, race conditions, retry    |
| 09  | Top K Frequent       | seeded RNG                   | `Map`, bucket sort, tie-break                     |
| 10  | Virtual List (бонус) | seeded RNG                   | windowing, overscan, scroll math                  |

Усі задачі доступні з дашборда `/` і мають окремий маршрут `/exercise/<id>`.

## Як вирішувати

1. Відкрий задачу → вкладка **«Умова»**.
2. Реалізуй функції/хуки у `src/exercises/<id>/impl.ts`.
3. Дивись результат у вкладці **«Пісочниця»**.
4. Запусти тести:

```bash
npm test -- 07-pagination
```

5. Онови прогрес:

```bash
npm run check
```

`check` запускає Vitest, пише результати в `public/test-results.json` і друкує summary. Після цього натисни «Оновити статус тестів» у UI.

6. Якщо застряг — вкладка **«Рішення»** або `src/exercises/<id>/solution/impl.ts`.

## Скрипти

```bash
npm run dev              # Vite dev server
npm run build            # typecheck + production build
npm run preview          # preview зібраної версії
npm test                 # Vitest, один прогін
npm run test:watch       # Vitest у watch-режимі
npm run check            # тести + public/test-results.json для UI
npm run test:solutions   # тимчасово підміняє impl.ts рішеннями й перевіряє їх
npm run typecheck        # tsc --noEmit
npm run lint             # oxlint
npm run format           # prettier
```

`npm run test:solutions` — корисний спосіб переконатися, що референсні рішення справді проходять усі тести. Скрипт відновлює твої `impl.ts` у `finally`, навіть якщо тести впали.

## Дані

Основне джерело — реальний **DummyJSON** (CORS відкритий, ключ не потрібен):

- `/products?limit=0&select=...` — 194 товари;
- `/products/search?q=...`;
- `/products/category/{slug}`;
- `/products/categories` — 24 категорії.

Спеціальні можливості для дебагу:

- `?delay=1500` — штучна затримка відповіді;
- `https://dummyjson.com/http/500` — відповідь з помилкою (використовується Dev Panel).

Точні `total` можуть змінюватися, бо API спільний. Тести не залежать від абсолютних чисел DummyJSON.

Локально генеруються:

- 80 коментарів для дерева (`src/data/comments.ts`) — в API немає `parentId`;
- 30 000 чисел для memoization, 100 000 для top-k, 10 000 рядків для віртуалізації (`src/data/generate.ts`).

> Задачі 01–03, 07, 08 потребують інтернету. Решта працює офлайн.

## Дебаг

**Dev Panel у шапці:**

- `Delay` — додає `?delay` до запитів;
- `Зламати next` — наступний запит отримає 500;
- `Reset` — скидає delay, failNext і кеш.

**Chrome DevTools:**

- breakpoint у `src/exercises/<id>/impl.ts` — Vite віддає source maps;
- вкладка Network: подивись скасовані (`canceled`) запити в задачі 04 і `?delay=...`.

**VS Code:**

- `.vscode/launch.json` містить конфігурації Chrome для головної та задачі 08;
- запусти `npm run dev`, потім F5 → «algo-lab: Chrome».

**React DevTools:**

- Profiler — задачі 02, 04, 06;
- `MemoRow` у задачі 06 показує кількість рендерів;
- у задачі 10 перевір, що в DOM ~12 рядків, а не 10 000.

**Сценарії для перевірки:**

- 01 — зміни фільтри, перезавантаж сторінку: стан має відновитися з URL;
- 07 — відкрий `?page=999`: сторінка клампиться до останньої;
- 08 — зміни категорію посеред завантаження: старий запит скасовується, дублікатів немає;
- 08 — «Зламати next» + скрол: error state і retry без втрати завантаженого.

## Структура

```
src/
  api/            DummyJSON-клієнт, типи, Dev Panel store
  components/     Layout, Tabs, Markdown, ErrorBoundary, прогрес
  data/           локальні фікстури та seeded-генератори
  exercises/
    <id>/
      README.md     умова задачі
      Task.tsx      готова пісочниця
      impl.ts       твій код (TODO)
      impl.test.ts  тести
      solution/     референс
  pages/          Home, ExercisePage
scripts/          check.mjs, test-solutions.mjs
```

## Правила

- Не змінюй тести, щоб «пройти» — краще реалізуй `impl.ts`.
- Не мутуй React state і вхідні масиви.
- У задачах 04 і 08 звертай увагу на cleanup: таймери, observer, `AbortController`.
- Використовуй `npm run test:solutions`, якщо сумніваєшся, що тест коректний.

## Troubleshooting

**`test-results.json` не з'являється** — запусти `npm run check`. Файл ігнорується git, його треба генерувати локально.

**Тести падають на старті** — так і задумано, це незавершені TODO.

**Запити до DummyJSON не проходять** — перевір інтернет і CORS; API публічний, але може бути недоступний. Задачі 05, 06, 09, 10 працюють без нього.

**У StrictMode два запити** — React у dev-режимі двічі запускає ефекти. У задачі 08 це навмисно перевіряється: зайвий запит має скасовуватися, а не дублювати дані.

**`npm run check` завершується кодом 1** — у якійсь задачі ще є failed-тести. Це очікувано під час навчання.
