import { describe, expect, it } from 'vitest';
import {
  extractReferences,
  extractDefinedTargets,
  lintReferences,
} from './referenceParser';

describe('referenceParser', () => {
  describe('extractReferences', () => {
    it('extracts heading references', () => {
      const markdown = 'See [@sec:intro] for details.';
      const refs = extractReferences(markdown);
      expect(refs).toHaveLength(1);
      expect(refs[0].type).toBe('heading');
      expect(refs[0].slug).toBe('intro');
      expect(refs[0].line).toBe(1);
    });

    it('extracts figure references', () => {
      const markdown = 'See [@fig:1] below.';
      const refs = extractReferences(markdown);
      expect(refs).toHaveLength(1);
      expect(refs[0].type).toBe('figure');
      expect(refs[0].slug).toBe('1');
    });

    it('extracts multiple references from different lines', () => {
      const markdown = 'See [@sec:intro]\nAnd [@fig:2]';
      const refs = extractReferences(markdown);
      expect(refs).toHaveLength(2);
      expect(refs[0].line).toBe(1);
      expect(refs[1].line).toBe(2);
    });

    it('returns empty array for markdown with no references', () => {
      expect(extractReferences('# Hello\n\nNo refs here.')).toEqual([]);
    });
  });

  describe('extractDefinedTargets', () => {
    it('extracts heading slugs', () => {
      const markdown = '# Introduction\n## Architecture';
      const targets = extractDefinedTargets(markdown);
      expect(targets.headings.has('introduction')).toBe(true);
      expect(targets.headings.has('architecture')).toBe(true);
    });

    it('extracts figure numbers', () => {
      const markdown = '![alt](img.png)\n\n*Figure 1: System diagram*';
      const targets = extractDefinedTargets(markdown);
      expect(targets.figures.has(1)).toBe(true);
    });

    it('returns empty sets for empty markdown', () => {
      const targets = extractDefinedTargets('');
      expect(targets.headings.size).toBe(0);
      expect(targets.figures.size).toBe(0);
    });
  });

  describe('lintReferences', () => {
    it('detects broken heading references', () => {
      const markdown = 'See [@sec:nonexistent] for details.';
      const errors = lintReferences(markdown);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('broken_reference');
      expect(errors[0].reference).toContain('[@sec:nonexistent]');
    });

    it('detects broken figure references', () => {
      const markdown = 'See [@fig:99] below.';
      const errors = lintReferences(markdown);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('broken_reference');
    });

    it('detects duplicate references', () => {
      const markdown = '[@sec:intro]\n[@sec:intro]';
      const errors = lintReferences(markdown);
      const duplicateErrors = errors.filter((e) => e.type === 'duplicate_reference');
      expect(duplicateErrors.length).toBeGreaterThanOrEqual(1);
    });

    it('returns no errors for valid references', () => {
      const markdown = '# Introduction\n\nSee [@sec:introduction] for details.';
      const errors = lintReferences(markdown);
      expect(errors).toHaveLength(0);
    });

    it('handles markdown with no references', () => {
      const errors = lintReferences('# Hello\n\nNo references here.');
      expect(errors).toHaveLength(0);
    });
  });
});
