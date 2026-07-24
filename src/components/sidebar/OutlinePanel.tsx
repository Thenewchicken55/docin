import { parseHeadings } from '../../lib/markdown/headingParser';

type OutlinePanelProps = {
  markdown: string;
};

export function OutlinePanel({ markdown }: OutlinePanelProps) {
  const headings = parseHeadings(markdown);

  if (headings.length === 0) {
    return null;
  }

  return (
    <section className="outline-card">
      <h3>Outline</h3>
      <ul>
        {headings.map(heading => (
          <li key={`${heading.slug}-${heading.level}`} className={`level-${heading.level}`}>
            {heading.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
