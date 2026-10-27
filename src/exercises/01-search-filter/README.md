# 01. Search & Filter

## Мета

Навчитися фільтрувати реальний список товарів і тримати стан фільтрів у URL.

## Дані

`fetchAllProducts()` тягне всі 194 товари з DummyJSON одним запитом. Категорії — з `/products/categories`.

## Що зробити

У `impl.ts` реалізуй `applyFilters(products, filters)`:

- `query` шукається без урахування регістру в `title`, `category`, `brand` і `tags`;
- порожній `query` або `category` — без фільтра;
- `minPrice` / `maxPrice` включні;
- `minRating = 0` — без фільтра;
- вхідний масив не мутується.

## Підказки

<details>
<summary>Підказка 1</summary>

Спочатку нормалізуй запит: `filters.query.trim().toLowerCase()`.
</details>

<details>
<summary>Підказка 2</summary>

Для пошуку збери один рядок із полів товару й тегів, теж у нижньому регістрі.
</details>

<details>
<summary>Підказка 3</summary>

`useMemo` у `Task.tsx` уже підключений — тобі не треба оптимізувати рендер, лише фільтрацію.
</details>

## Перевірка

```bash
npm test -- 01-search-filter
```

## Дебаг

У Dev Panel постав затримку 1500 мс — побачиш skeleton. У Network подивись запити до DummyJSON. Зміни фільтри й перезавантаж сторінку: стан має відновитися з URL.
