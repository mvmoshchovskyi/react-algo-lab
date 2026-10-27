# 02. Sortable Table

## Мета

Стабільне сортування таблиці без мутацій React state.

## Дані

`fetchAllProducts()` — 194 товари DummyJSON.

## Що зробити

`nextSortState(current, key)`:

- немає сортування → `asc` → `desc` → `null`;
- клік по іншій колонці починає з `asc`.

`sortRows(rows, sort)`:

- повертає новий масив;
- `title` — через `localeCompare`;
- числа — як числа;
- рівні значення — tie-break за `id` за зростанням (навіть для `desc`);
- `sort === null` — копія у вихідному порядку.

## Підказки

<details>
<summary>Підказка 1</summary>

Порівняння роби окремо від напрямку: спочатку `cmp`, потім `direction === "asc" ? cmp : -cmp`.
</details>

<details>
<summary>Підказка 2</summary>

Tie-break не можна множити на напрямок, інакше при `desc` рівні елементи теж перевернуться.
</details>

## Перевірка

```bash
npm test -- 02-sorting
```

## Дебаг

Клікни «Ціна» двічі. У React DevTools Profiler подивись, скільки разів рендериться таблиця. Перевір, що після сортування масив `products` у стані не змінився (можна тимчасово залогувати його до/після).
