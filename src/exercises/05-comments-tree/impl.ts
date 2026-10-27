import type { FlatComment } from "../../data/comments";

export type CommentNode = FlatComment & {
  children: CommentNode[];
};

/**
 * Задача 5a.
 * Перетвори плаский список у дерево за parentId.
 *
 * TODO:
 * - корені — це parentId === null;
 * - вузли без батька (осиротілі) стають коренями;
 * - вузол не може бути батьком сам собі;
 * - порядок дітей — як у вхідному масиві;
 * - не мутуй вхідні об'єкти.
 */
export function buildTree(flat: FlatComment[]): CommentNode[] {
  // TODO: реалізуй побудову дерева
  return flat.map((comment) => ({ ...comment, children: [] }));
}

/** Задача 5b. Скільки нащадків у вузла (без самого вузла)? */
export function countDescendants(_node: CommentNode): number {
  // TODO: рекурсія
  return 0;
}

/**
 * Задача 5c.
 * Пошук по тексту/автору з збереженням батьків.
 *
 * TODO:
 * - вузол залишається, якщо збіг у ньому самому або в будь-якому нащадку;
 * - якщо збіг у самому вузлі — зберігаємо все його піддерево;
 * - порожній запит повертає дерево без змін;
 * - не мутуй вузли.
 */
export function filterTree(nodes: CommentNode[], _query: string): CommentNode[] {
  return nodes;
}
