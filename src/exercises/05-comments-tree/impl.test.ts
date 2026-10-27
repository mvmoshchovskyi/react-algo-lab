import { describe, expect, it } from "vitest";
import type { FlatComment } from "../../data/comments";
import { flatComments } from "../../data/comments";
import { buildTree, countDescendants, filterTree, type CommentNode } from "./impl";

function comment(id: number, parentId: number | null, text = `text ${id}`): FlatComment {
  return {
    id,
    parentId,
    author: `author ${id}`,
    text,
    createdAt: new Date(2026, 0, id).toISOString(),
    likes: 0,
  };
}

function node(id: number, text: string, children: CommentNode[] = []): CommentNode {
  return { ...comment(id, null, text), children };
}

describe("buildTree", () => {
  it("builds 5 roots with 15 descendants each", () => {
    const tree = buildTree(flatComments);
    expect(tree).toHaveLength(5);
    expect(tree.every((root) => root.children.length === 3)).toBe(true);
    expect(tree.reduce((sum, root) => sum + countDescendants(root), 0)).toBe(
      flatComments.length - tree.length,
    );
  });

  it("preserves parent/child links and the source order", () => {
    const tree = buildTree(flatComments);
    const root = tree[0]!;
    expect(root.children.map((child) => child.parentId)).toEqual([
      root.id,
      root.id,
      root.id,
    ]);
    expect(root.children[0]!.children).toHaveLength(2);
  });

  it("keeps orphans as roots and never mutates the input", () => {
    const flat = [comment(1, null), comment(2, 999), comment(3, 3)];
    const snapshot = structuredClone(flat);
    const tree = buildTree(flat);
    expect(tree.map((item) => item.id)).toEqual([1, 2, 3]);
    expect(flat).toEqual(snapshot);
  });
});

describe("countDescendants", () => {
  it("counts all levels without the node itself", () => {
    const tree = node(1, "root", [
      node(2, "child", [node(3, "grand"), node(4, "grand")]),
      node(5, "child"),
    ]);
    expect(countDescendants(tree)).toBe(4);
    expect(countDescendants(tree.children[0]!)).toBe(2);
    expect(countDescendants(tree.children[1]!)).toBe(0);
  });
});

describe("filterTree", () => {
  const tree = node(1, "Root about React", [
    node(2, "Child about Map", [node(4, "Grandchild about hooks")]),
    node(3, "Another child"),
  ]);

  it("returns the same tree for an empty query", () => {
    expect(filterTree([tree], "  ")).toEqual([tree]);
  });

  it("keeps ancestors of a matching descendant", () => {
    const result = filterTree([tree], "hooks");
    expect(result).toHaveLength(1);
    expect(result[0]!.children.map((child) => child.id)).toEqual([2]);
    expect(result[0]!.children[0]!.children.map((child) => child.id)).toEqual([4]);
  });

  it("keeps the whole subtree when the node itself matches", () => {
    const result = filterTree([tree], "map");
    expect(result[0]!.children.map((child) => child.id)).toEqual([2]);
    expect(result[0]!.children[0]!.children.map((child) => child.id)).toEqual([4]);
  });

  it("searches authors too and drops unrelated branches", () => {
    expect(filterTree([tree], "author 3").map((item) => item.id)).toEqual([1]);
    expect(filterTree([tree], "author 3")[0]!.children.map((item) => item.id)).toEqual([
      3,
    ]);
  });
});
