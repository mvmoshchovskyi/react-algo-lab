/** Детермінований PRNG, щоб дані для бенчмарків були однакові між запусками. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function generateNumbers(count: number, maxValue: number, seed = 7): number[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => 1 + Math.floor(random() * maxValue));
}

export type MockRow = {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
};

const TITLES = [
  "Навушники",
  "Смартфон",
  "Клавіатура",
  "Монітор",
  "Мишка",
  "Камера",
  "Колонка",
  "Планшет",
  "Годинник",
  "Зарядка",
];

const CATEGORIES = ["electronics", "accessories", "office", "audio"];

export function generateRows(count: number, seed = 42): MockRow[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `${TITLES[index % TITLES.length]} #${index + 1}`,
    price: Math.round((10 + random() * 990) * 100) / 100,
    rating: Math.round((1 + random() * 4) * 10) / 10,
    category: CATEGORIES[index % CATEGORIES.length] ?? "other",
  }));
}
