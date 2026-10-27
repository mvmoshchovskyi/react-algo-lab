import type { FlatComment } from "../../../data/comments";

export type CommentNode = FlatComment & {
  children: CommentNode[];
};

export function buildTree(flat: FlatComment[]): CommentNode[] {
  const byId = new Map<number, CommentNode>();
  for (const comment of flat) {
    byId.set(comment.id, { ...comment, children: [] });
  }

  const roots: CommentNode[] = [];
  for (const comment of flat) {
    const node = byId.get(comment.id);
    if (!node) continue;
    const parent = comment.parentId === null ? undefined : byId.get(comment.parentId);
    if (parent && parent.id !== node.id) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

export function countDescendants(node: CommentNode): number {
  let total = 0;
  for (const child of node.children) {
    total += 1 + countDescendants(child);
  }
  return total;
}

export function filterTree(nodes: CommentNode[], query: string): CommentNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return nodes;

  return nodes.flatMap((node) => {
    const matches =
      node.text.toLowerCase().includes(normalized) ||
      node.author.toLowerCase().includes(normalized);

    if (matches) return [node];

    const children = filterTree(node.children, normalized);
    return children.length > 0 ? [{ ...node, children }] : [];
  });
}
