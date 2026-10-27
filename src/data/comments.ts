import type { FlatComment } from "../api/types";

export type { FlatComment } from "../api/types";

const AUTHORS = [
  "Olena",
  "Andrii",
  "Marta",
  "Dmytro",
  "Sofia",
  "Ihor",
  "Kateryna",
  "Bohdan",
];

const TEXTS = [
  "Це справді допомогло, дякую!",
  "А як це працює під капотом?",
  "У мене теж була така проблема.",
  "Можна приклад коду?",
  "Не зовсім зрозуміло про складність.",
  "Класне пояснення, зберіг у закладки.",
  "А що буде, якщо масив порожній?",
  "Перевірив — працює.",
  "Краще винести це в custom hook.",
  "Тут можна обійтися без зайвого рендера.",
  "Дякую за підказку про Map!",
  "А на великих даних це не буде повільно?",
  "Це саме те, що шукав.",
  "Можна ще приклад із вкладеністю?",
  "У мене вийшло лише з третьої спроби.",
  "Варто додати обробку помилок.",
];

let commentId = 0;

function nextComment(parentId: number | null, depth: number): FlatComment {
  commentId += 1;
  const id = commentId;
  return {
    id,
    parentId,
    author: AUTHORS[(id + depth) % AUTHORS.length] ?? "User",
    text: `${TEXTS[id % TEXTS.length]} (${id})`,
    createdAt: new Date(Date.UTC(2026, 8, 1, 9, 0) + id * 65_000).toISOString(),
    likes: (id * 7) % 23,
  };
}

function buildFixture(): FlatComment[] {
  const comments: FlatComment[] = [];
  for (let rootIndex = 0; rootIndex < 5; rootIndex += 1) {
    const root = nextComment(null, 0);
    comments.push(root);
    for (let childIndex = 0; childIndex < 3; childIndex += 1) {
      const child = nextComment(root.id, 1);
      comments.push(child);
      for (let grandChildIndex = 0; grandChildIndex < 2; grandChildIndex += 1) {
        const grandChild = nextComment(child.id, 2);
        comments.push(grandChild);
        const greatGrandChild = nextComment(grandChild.id, 3);
        comments.push(greatGrandChild);
      }
    }
  }
  return comments;
}

/**
 * Плаский список коментарів, адаптований під DummyJSON.
 * DummyJSON віддає коментарі без parentId, тому для задачі про дерево
 * використовуємо локальний детермінований фікстур.
 */
export const flatComments: FlatComment[] = buildFixture();
