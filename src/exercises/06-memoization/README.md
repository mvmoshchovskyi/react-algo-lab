# 06. Memoization / LRU

## Мета

Кешування обчислень і розуміння, коли `useMemo` / `React.memo` / `useCallback` справді допомагають.

## Що зробити

`memoize(fn, maxSize = 50)`:

- кеш за аргументами;
- при повторному виклику `fn` не викликається;
- не більше `maxSize` записів;
- витісняється найдавніше використаний (LRU, не FIFO);
- `cacheSize()` повертає кількість записів.

## Дані

30 000 згенерованих чисел (локально, seeded RNG).

## Підказки

<details>
<summary>Підказка 1</summary>

`Map` зберігає порядок вставки. Щоб зробити запис свіжим: `delete` + `set`.
</details>

<details>
<summary>Підказка 2</summary>

Найстаріший ключ: `cache.keys().next().value`.
</details>

<details>
<summary>Підказка 3</summary>

`JSON.stringify(args)` — простий ключ, але він не працює для функцій, `Map`, циклічних об'єктів. Це нормальне обмеження для задачі.
</details>

## Перевірка

```bash
npm test -- 06-memoization
```

## Дебаг

У React DevTools Profiler подивись, як змінюється кількість рендерів `MemoRow`, коли вмикаєш/вимикаєш стабільний callback. У консолі порівняй час першого й повторного `cachedCompute(NUMBERS)`.
