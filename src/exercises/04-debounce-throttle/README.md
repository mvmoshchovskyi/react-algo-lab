# 04. Debounce & Throttle

## Мета

Написати власні хуки контролю частоти та зрозуміти різницю між debounce і throttle.

## Що зробити

`useDebouncedValue(value, delay)`:

- значення оновлюється після паузи `delay`;
- кожна нова зміна скидає таймер;
- cleanup при розмонтуванні.

`useThrottledCallback(callback, limit)`:

- перший виклик — одразу (leading);
- виклики протягом `limit` мс запам'ятовуються, виконується останній (trailing);
- callback завжди актуальний через `ref`;
- таймер очищається на unmount.

## Дані

Пошук іде в реальний DummyJSON (`/products/search`). У Dev Panel є штучна затримка.

## Підказки

<details>
<summary>Підказка 1</summary>

Для debounce: `setTimeout` + `clearTimeout` у cleanup ефекту.
</details>

<details>
<summary>Підказка 2</summary>

Для throttle тримай `waitingRef`, `pendingRef` і `timerRef`. Після таймера, якщо є pending — запусти його знову.
</details>

<details>
<summary>Підказка 3</summary>

`useThrottledCallback` має повертати стабільну функцію через `useCallback`, інакше ефекти в `useThrottledValue` зацикляться.
</details>

## Перевірка

```bash
npm test -- 04-debounce-throttle
```

## Дебаг

Постав затримку 1500 мс, швидко введи `phone` і подивись Network: зайві запити мають бути canceled. На mousemove порівняй raw / debounced / throttled.
