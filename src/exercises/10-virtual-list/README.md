# 10. Virtual List (бонус)

## Мета

Віртуалізація великого списку: у DOM лише видимі рядки.

## Дані

10 000 локально згенерованих рядків (`generateRows`).

## Що зробити

`getVirtualRange({ scrollTop, viewportHeight, rowHeight, total, overscan })`:

- `start = floor(scrollTop / rowHeight) - overscan`, не менше 0;
- `end = ceil((scrollTop + viewportHeight) / rowHeight) + overscan`, не більше total;
- `offsetY = start * rowHeight`;
- `totalHeight = total * rowHeight`;
- захист від `rowHeight <= 0`, `total <= 0`, від'ємного scrollTop;
- scrollTop за межами — клампиться.

## Підказки

<details>
<summary>Підказка 1</summary>

Спочатку порахуй `totalHeight`, потім `maxScrollTop = max(0, totalHeight - viewportHeight)`.
</details>

<details>
<summary>Підказка 2</summary>

`end` має бути exclusive (`slice(start, end)`), тому додавай 1 до останнього видимого ряду через `ceil`.
</details>

<details>
<summary>Підказка 3</summary>

`offsetY` — це `start * rowHeight`, а не `scrollTop`, інакше рядки «стрибатимуть».
</details>

## Перевірка

```bash
npm test -- 10-virtual-list
```

## Дебаг

Прокрути список і подивись у React DevTools, скільки `virtual-row` у DOM. Перейди на рядок 5000 — скрол має стрибнути, а діапазон оновитися.
