import { insertSnippet, type SnippetType } from "../../features/markdown/snippets";

type InsertToolbarProps = {
  onInsert: (value: string) => void;
};

export function InsertToolbar({ onInsert }: InsertToolbarProps) {
  const snippets: { type: SnippetType; label: string }[] = [
    { type: "table", label: "Table" },
    { type: "code", label: "Code" },
    { type: "callout", label: "Callout" },
    { type: "checklist", label: "Checklist" },
    { type: "link", label: "Link" },
    { type: "diagram", label: "Diagram" },
  ];

  return (
    <div className="toolbar-card">
      {snippets.map((snippet) => (
        <button
          key={snippet.type}
          type="button"
          onClick={() => onInsert(insertSnippet(snippet.type))}
        >
          Insert {snippet.label}
        </button>
      ))}
    </div>
  );
}
