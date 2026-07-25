import { parseHeadings } from '../markdown/headingParser';

export interface Reference {
  type: 'heading' | 'figure';
  slug: string;
  line: number;
  text: string;
}

export interface LintError {
  type: 'broken_reference' | 'duplicate_reference';
  reference: string;
  line: number;
  message: string;
}

export function extractReferences(markdown: string): Reference[] {
  const references: Reference[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line, index) => {
    // Match heading references [@sec:slug]
    const headingRefMatch = line.match(/\[@sec:([^\]]+)\]/);
    if (headingRefMatch) {
      references.push({
        type: 'heading',
        slug: headingRefMatch[1],
        line: index + 1,
        text: headingRefMatch[0],
      });
    }

    // Match figure references [@fig:number]
    const figRefMatch = line.match(/\[@fig:(\d+)\]/);
    if (figRefMatch) {
      references.push({
        type: 'figure',
        slug: figRefMatch[1],
        line: index + 1,
        text: figRefMatch[0],
      });
    }
  });

  return references;
}

export function extractDefinedTargets(markdown: string): { headings: Set<string>; figures: Set<number> } {
  const headings = parseHeadings(markdown);
  const headingSlugs = new Set(headings.map(h => h.slug));
  
  const figures = new Set<number>();
  const lines = markdown.split('\n');
  
  lines.forEach(line => {
    // Match figure definitions (images with captions)
    const figMatch = line.match(/\*Figure (\d+):/);
    if (figMatch) {
      figures.add(parseInt(figMatch[1], 10));
    }
  });

  return { headings: headingSlugs, figures };
}

export function lintReferences(markdown: string): LintError[] {
  const references = extractReferences(markdown);
  const { headings, figures } = extractDefinedTargets(markdown);
  const errors: LintError[] = [];
  const seenReferences = new Map<string, number>();

  references.forEach(ref => {
    const refKey = `${ref.type}:${ref.slug}`;
    
    // Check for duplicates
    if (seenReferences.has(refKey)) {
      errors.push({
        type: 'duplicate_reference',
        reference: ref.text,
        line: ref.line,
        message: `Duplicate ${ref.type} reference: ${ref.text}`,
      });
    } else {
      seenReferences.set(refKey, ref.line);
    }

    // Check for broken references
    if (ref.type === 'heading' && !headings.has(ref.slug)) {
      errors.push({
        type: 'broken_reference',
        reference: ref.text,
        line: ref.line,
        message: `Broken heading reference: ${ref.slug} not found`,
      });
    }

    if (ref.type === 'figure' && !figures.has(parseInt(ref.slug, 10))) {
      errors.push({
        type: 'broken_reference',
        reference: ref.text,
        line: ref.line,
        message: `Broken figure reference: figure ${ref.slug} not found`,
      });
    }
  });

  return errors;
}
