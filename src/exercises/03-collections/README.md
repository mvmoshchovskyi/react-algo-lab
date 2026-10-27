# 03. Map, Set та колекції

## Мета

Practика `Map`/`Set`: O(1) пошук за id, дедуплікація, групування, підрахунок.

## Дані

194 товари DummyJSON з тегами та категоріями.

## Що зробити

- `cartReducer` — додавання/видалення/очищення без мутацій;
- `groupByCategory` — `Map`, порядок категорій як у вхідному масиві;
- `uniqueTags` — без урахування регістру, нижній регістр, алфавітний порядок;
- `topCategories` — за кількістю, за рівної кількості — за алфавітом;
- `buildProductMap` — `Map<id, Product>`;
- `cartTotal` — сума через `Map`, без `find` у циклі.

## Підказки

<details>
<summary>Підказка 1</summary>

Для cartReducer копіюй об'єкт: `const next = { ...state }`, а потім змінюй `next`.
</details>

<details>
<summary>Підказка 2</summary>

`uniqueTags` можна зробити через `Set`, але регістр треба нормалізувати до додавання.
</details>

<details>
<summary>Підказка 3</summary>

`topCategories`: `Array.from(groups, ([category, items]) => ({ category, count: items.length }))`.
</details>

## Перевірка

```bash
npm test -- 03-collections
```

## Дебаг

Додай один товар двічі й подивись у React DevTools, що `cart` — новий об'єкт, а старий не змінився. Перевір у консолі `new Map(...)` для 194 товарів.
