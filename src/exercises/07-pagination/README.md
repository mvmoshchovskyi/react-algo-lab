# 07. Pagination

## Мета

Offset-пагінація з реального API + алгоритм вікна сторінок з еліпсисами.

## Дані

`GET /products?limit=20&skip=N` → `{ products, total, skip, limit }`. Зараз 194 товари.

## Що зробити

- `pageCount(total, limit)` — порожній список = 1 сторінка;
- `clampPage(page, totalPages)` — 1..totalPages, `NaN` → 1;
- `toSkip(page, limit)` — `(page - 1) * limit`, без від'ємних;
- `getPageWindow(current, totalPages, siblings = 1)` — вікно з еліпсисами:
  - `current=6, total=20` → `[1, "…", 5, 6, 7, "…", 20]`;
  - `total <= 7` → усі сторінки;
  - перша й остання завжди видимі;
  - некоректний current клампиться.

## Підказки

<details>
<summary>Підказка 1</summary>

Збери `Set` з `1`, `totalPages` і `current ± siblings`, відсортуй, а потім вставляй `"ellipsis"`, якщо різниця між сусідніми сторінками більша за 1.
</details>

<details>
<summary>Підказка 2</summary>

`skip` рахуй від вже клампнутої сторінки, інакше `?page=999` відправить запит далеко за межі.
</details>

## Перевірка

```bash
npm test -- 07-pagination
```

## Дебаг

Відкрий `?page=999`. У Network побачиш запит зі `skip` за межами, потім коригування URL. Увімкни затримку 1500 мс — таблиця має лишатися на екрані, лише приглушуватися.
