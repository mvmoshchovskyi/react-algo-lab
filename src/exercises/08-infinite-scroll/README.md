# 08. Infinite Scroll

## Мета

Накопичувальний список з `IntersectionObserver`, `skip`/`limit`, abort і retry.

## Дані

`GET /products?limit=20&skip=N` (або `/products/category/{slug}?limit=20&skip=N`). Зараз 194 товари.

## Що зробити

- `getNextSkip(loadedCount, pageSize)` — наступний offset;
- `mergeUnique(existing, incoming)` — без дублікатів за `id`, існуючий порядок зберігається;
- `hasMore(loadedCount, total)`;
- `useInfiniteList(loadPage, { pageSize, resetKey })`:
  - автозавантаження першої сторінки;
  - жодних паралельних запитів;
  - reset при зміні `resetKey` (категорії);
  - `AbortController` на зміну фільтра/unmount;
  - retry після помилки не втрачає завантажене;
  - `done`, коли все завантажено або прийшла порожня сторінка.

`IntersectionObserver` уже підключений у `Task.tsx` — тобі лишилося реалізувати hook.

## Підказки

<details>
<summary>Підказка 1</summary>

`skipRef` зберігає кількість уже отриманих елементів. Не рахуй `skip` з `items.length` у замиканні — воно застаріє.
</details>

<details>
<summary>Підказка 2</summary>

Для захисту від паралельних запитів: `loadingRef`. Для захисту від застарілих відповідей: `generationRef` або перевірка `controller.signal.aborted`.
</details>

<details>
<summary>Підказка 3</summary>

`mergeUnique`: спочатку `Set(existing.map(item => item.id))`, потім додавай лише нові.
</details>

## Перевірка

```bash
npm test -- 08-infinite-scroll
```

## Дебаг

Dev Panel → затримка 800 мс, швидкий скрол. У Network не має бути двох одночасних запитів. Перемкни категорію під час завантаження — старий запит має скасуватися. Натисни «Зламати наступний запит» і проскроль — з'явиться error + retry.
