import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${keyPrefix}-${index}`}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

/**
 * Мінімальний markdown-рендер для README задач:
 * заголовки, списки, code fences, inline code, details/summary.
 */
export function Markdown({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").startsWith("```")) {
        code.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre className="code-block" key={`code-${key++}`}>
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const text = line.replace(/^#+\s/, "");
      const Tag = (level === 1 ? "h1" : level === 2 ? "h2" : "h3") as "h1" | "h2" | "h3";
      blocks.push(
        <Tag key={`heading-${key++}`} className="markdown-heading">
          {inline(text, `h-${key}`)}
        </Tag>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("- ")) {
        items.push((lines[index] ?? "").slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={`list-${key++}`}>
          {items.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`}>{inline(item, `li-${key}-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.startsWith("<details>")) {
      index += 1;
      continue;
    }
    if (line.startsWith("</details>")) {
      index += 1;
      continue;
    }
    if (line.startsWith("<summary>") && line.endsWith("</summary>")) {
      blocks.push(
        <p className="hint-title" key={`summary-${key++}`}>
          {inline(line.slice(9, -10), `summary-${key}`)}
        </p>,
      );
      index += 1;
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      (lines[index] ?? "").trim() !== "" &&
      !(lines[index] ?? "").startsWith("```") &&
      !/^#{1,6}\s/.test(lines[index] ?? "") &&
      !(lines[index] ?? "").startsWith("- ") &&
      !(lines[index] ?? "").startsWith("<")
    ) {
      paragraph.push(lines[index] ?? "");
      index += 1;
    }
    if (paragraph.length === 0) {
      index += 1;
      continue;
    }
    blocks.push(
      <p key={`paragraph-${key++}`}>{inline(paragraph.join(" "), `p-${key}`)}</p>,
    );
  }

  return <div className="markdown">{blocks}</div>;
}
