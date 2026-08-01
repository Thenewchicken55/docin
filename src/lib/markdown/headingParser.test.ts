import { describe, expect, it } from 'vitest';
import { parseHeadings } from './headingParser';

describe('parseHeadings', () => {
  it('extracts headings with the correct levels and slugs', () => {
    const markdown = '# Intro\n\n## Details\n\n### Next Steps';

    expect(parseHeadings(markdown)).toEqual([
      { level: 1, text: 'Intro', slug: 'intro' },
      { level: 2, text: 'Details', slug: 'details' },
      { level: 3, text: 'Next Steps', slug: 'next-steps' }
    ]);
  });

  it('ignores non-heading lines', () => {
    expect(parseHeadings('Plain text\n- list item')).toEqual([]);
  });

  it('handles headings with special characters', () => {
    const markdown = '# Hello World!\n## Section 1.2\n### API (v2)';
    const headings = parseHeadings(markdown);
    expect(headings[0].slug).toBe('hello-world');
    expect(headings[1].slug).toBe('section-12');
    expect(headings[2].slug).toBe('api-v2');
  });

  it('handles empty markdown', () => {
    expect(parseHeadings('')).toEqual([]);
  });

  it('handles markdown with only whitespace', () => {
    expect(parseHeadings('   \n  \n  ')).toEqual([]);
  });

  it('extracts all heading levels 1-6', () => {
    const markdown = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
    const headings = parseHeadings(markdown);
    expect(headings).toHaveLength(6);
    expect(headings.map(h => h.level)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('trims whitespace around heading text', () => {
    const markdown = '#   Spaced Title   ';
    const headings = parseHeadings(markdown);
    expect(headings[0].text).toBe('Spaced Title');
  });
});
