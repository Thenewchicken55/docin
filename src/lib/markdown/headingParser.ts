export type Heading = {
  level: number;
  text: string;
  slug: string;
};

export function parseHeadings(markdown: string): Heading[] {
  return markdown
    .split(/\r?\n/)
    .filter(line => /^#{1,6}\s+/.test(line))
    .map(line => {
      const match = line.match(/^(#{1,6})\s+(.*?)\s*$/);
      if (!match) {
        return null;
      }

      const level = match[1].length;
      const text = match[2].trim();
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      return { level, text, slug };
    })
    .filter((heading): heading is Heading => heading !== null);
}
