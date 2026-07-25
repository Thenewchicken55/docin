import type { LintError } from '../../lib/linting/referenceParser';

type LintPanelProps = {
  errors: LintError[];
  onJumpToLine?: (line: number) => void;
};

export function LintPanel({ errors, onJumpToLine }: LintPanelProps) {
  if (errors.length === 0) {
    return (
      <section className="lint-card">
        <h3>Lint Status</h3>
        <div className="lint-status lint-success">
          ✓ No issues found
        </div>
      </section>
    );
  }

  return (
    <section className="lint-card">
      <h3>Lint Status</h3>
      <div className="lint-status lint-error">
        {errors.length} {errors.length === 1 ? 'issue' : 'issues'} found
      </div>
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
    </section>
  );
}
