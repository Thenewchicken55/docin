import { useState } from 'react';
import type { LintError } from '../../lib/linting/referenceParser';

type LintPanelProps = {
  errors: LintError[];
  onJumpToLine?: (line: number) => void;
};

export function LintPanel({ errors, onJumpToLine }: LintPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="lint-sidebar">
      <div className="lint-header">
        <h3>Problems</h3>
        <button
          className="lint-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      {errors.length === 0 ? (
        <div className="lint-empty">
          <span className="lint-success-icon">✓</span>
          No problems detected
        </div>
      ) : isExpanded ? (
        <ul className="lint-list">
          {errors.map((error, index) => (
            <li key={index} className="lint-item">
              <div className="lint-item-header">
                <span className={`lint-type lint-type-${error.type}`}>
                  {error.type === 'broken_reference' ? '⚠' : 'ℹ'}
                </span>
                <span className="lint-line">Ln {error.line}</span>
              </div>
              <div className="lint-message">{error.message}</div>
              <div className="lint-reference">{error.reference}</div>
              {onJumpToLine && (
                <button
                  className="lint-action"
                  onClick={() => onJumpToLine(error.line)}
                >
                  Go to line
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
