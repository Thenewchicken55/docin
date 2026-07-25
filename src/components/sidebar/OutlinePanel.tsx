import { useEffect, useState } from 'react';
import { parseHeadings } from '../../lib/markdown/headingParser';

type OutlinePanelProps = {
  markdown: string;
  onInsertReference?: (slug: string) => void;
};

export function OutlinePanel({ markdown, onInsertReference }: OutlinePanelProps) {
  const [headings, setHeadings] = useState(parseHeadings(markdown));

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeadings(parseHeadings(markdown));
    }, 300);
    return () => clearTimeout(timer);
  }, [markdown]);

  if (headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (slug: string) => {
    // Scroll to heading in editor (would need editor ref)
    console.log('Navigate to heading:', slug);
  };

  const handleInsertReference = (slug: string) => {
    if (onInsertReference) {
      onInsertReference(slug);
    }
  };

  return (
    <section className="outline-card">
      <h3>Outline</h3>
      <ul>
        {headings.map(heading => (
          <li key={`${heading.slug}-${heading.level}`} className={`level-${heading.level}`}>
            <div className="outline-item">
              <button
                className="outline-link"
                onClick={() => handleHeadingClick(heading.slug)}
                title="Navigate to heading"
              >
                {heading.text}
              </button>
              {onInsertReference && (
                <button
                  className="outline-action"
                  onClick={() => handleInsertReference(heading.slug)}
                  title="Insert reference"
                >
                  @
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
