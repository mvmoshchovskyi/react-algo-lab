import { useMemo, useState } from "react";
import { flatComments } from "../../data/comments";
import { buildTree, countDescendants, filterTree, type CommentNode } from "./impl";

type CommentItemProps = {
  node: CommentNode;
  depth: number;
  expanded: Set<number>;
  onToggle: (id: number) => void;
};

function CommentItem({ node, depth, expanded, onToggle }: CommentItemProps) {
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(node.id);
  const descendants = hasChildren ? countDescendants(node) : 0;

  return (
    <li className="comment-node">
      <div
        className="comment-body"
        style={{ marginLeft: `${Math.min(depth, 4) * 18}px` }}
      >
        <div className="avatar" aria-hidden="true">
          {node.author.slice(0, 1)}
        </div>
        <div>
          <div className="comment-head">
            <strong>{node.author}</strong>
            <span className="muted">
              {new Date(node.createdAt).toLocaleDateString("uk-UA")} · ♥ {node.likes}
            </span>
          </div>
          <p>{node.text}</p>
          {hasChildren && (
            <button
              type="button"
              className="link-button"
              onClick={() => onToggle(node.id)}
            >
              {isOpen ? "Згорнути" : "Розгорнути"} ({descendants})
            </button>
          )}
        </div>
      </div>
      {hasChildren && isOpen && (
        <ul className="comment-children">
          {node.children.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CommentsTreeTask() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const tree = useMemo(() => buildTree(flatComments), []);
  const filtered = useMemo(() => filterTree(tree, query), [tree, query]);

  const toggle = (id: number) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(flatComments.map((comment) => comment.id)));

  return (
    <section className="exercise-workspace">
      <div className="panel">
        <div className="filters-row">
          <div className="field field-wide">
            <label htmlFor="comment-search">Пошук по коментарях</label>
            <input
              id="comment-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Непорожній запит має зберегти батьків…"
            />
          </div>
          <button type="button" className="button button-ghost" onClick={expandAll}>
            Розгорнути все
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setExpanded(new Set())}
          >
            Згорнути все
          </button>
        </div>
        <div className="metrics-row">
          <div className="metric">
            <span className="muted">Усього коментарів</span>
            <strong>{flatComments.length}</strong>
          </div>
          <div className="metric">
            <span className="muted">Коренів</span>
            <strong>{tree.length}</strong>
          </div>
          <div className="metric">
            <span className="muted">Після фільтра</span>
            <strong>{filtered.length}</strong>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="state-box">
          {tree.length === 0
            ? "Дерево порожнє — реалізуй buildTree."
            : "Нічого не знайдено."}
        </div>
      ) : (
        <ul className="comment-tree">
          {filtered.map((node) => (
            <CommentItem
              key={node.id}
              node={node}
              depth={0}
              expanded={expanded}
              onToggle={toggle}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
