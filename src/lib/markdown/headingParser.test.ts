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
});
