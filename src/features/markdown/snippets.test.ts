import { describe, expect, it } from "vitest";
import { insertSnippet } from "./snippets";

describe("insertSnippet", () => {
  it("inserts table snippet", () => {
    const result = insertSnippet("table");
    expect(result).toContain("| Column 1 |");
    expect(result).toContain("Cell 1");
  });

  it("inserts code snippet", () => {
    const result = insertSnippet("code");
    expect(result).toContain("```javascript");
    expect(result).toContain("```");
  });

  it("inserts callout snippet", () => {
    const result = insertSnippet("callout");
    expect(result).toContain("[!NOTE]");
    expect(result).toContain("This is a callout block");
  });

  it("inserts checklist snippet", () => {
    const result = insertSnippet("checklist");
    expect(result).toContain("- [ ] Task 1");
    expect(result).toContain("- [ ] Task 2");
  });

  it("inserts link snippet", () => {
    const result = insertSnippet("link");
    expect(result).toContain("[Link text](https://example.com)");
  });

  it("inserts diagram snippet", () => {
    const result = insertSnippet("diagram");
    expect(result).toContain("```mermaid");
    expect(result).toContain("graph TD");
  });
});
