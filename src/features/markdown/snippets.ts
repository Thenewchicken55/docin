export type SnippetType =
  | "table"
  | "code"
  | "callout"
  | "checklist"
  | "link"
  | "diagram";

export function insertSnippet(type: SnippetType): string {
  switch (type) {
    case "table":
      return `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;

    case "code":
      return `\`\`\`javascript
// Your code here
\`\`\``;

    case "callout":
      return `> [!NOTE]
> This is a callout block. Use it for important information.`;

    case "checklist":
      return `- [ ] Task 1
- [ ] Task 2
- [ ] Task 3`;

    case "link":
      return `[Link text](https://example.com)`;

    case "diagram":
      return `\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\``;

    default:
      return "";
  }
}
