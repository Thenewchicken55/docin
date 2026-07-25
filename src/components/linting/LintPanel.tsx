import { useState } from 'react';
import type { LintError } from '../../lib/linting/referenceParser';

type LintPanelProps = {
  errors: LintError[];
  onJumpToLine?: (line: number) => void;
};

export function LintPanel({ errors, onJumpToLine }: LintPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (errors.length === 0) {
    return (
      <div className="lint-overlay">
        <div className="lint-overlay-content">
          <div className="lint-overlay-status lint-success">
            ✓ No issues found
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lint-overlay">
        <div className="lint-overlay-content">
          <div className="lint-overlay-status lint-error">
            {errors.length} {errors.length === 1 ? 'issue' : 'issues'} found
          </div>
          <div className="lint-overlay-details">
            {errors[0].message}
          </div>
        </div>
        <button
          className="lint-overlay-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>
      {isExpanded && (
        <div className="lint-overlay-panel">
          <ul className="lint-list">
            {errors.map((error, index) => (
              <li key={index} className="lint-item">
                <div className="lint-item-header">
                  <span className="lint-type">{error.type}</span>
                  <span className="lint-line">Line {error.line}</span>
                </div>
                <div className="lint-message">{error.message}</div>
                <div className="lint-reference">{error.reference}</div>
                {onJumpToLine && (
                  <button
                    className="lint-action"
                    onClick={() => onJumpToLine(error.line)}
                  >
                    Jump to line
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
