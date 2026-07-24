import { useState } from 'react';
import { ReferenceToolbar } from '../toolbar/ReferenceToolbar';
import type { DocumentFile } from '../../types/workspace';

type MarkdownEditorProps = {
  file: DocumentFile | null;
};

export function MarkdownEditor({ file }: MarkdownEditorProps) {
  const [draft, setDraft] = useState(file?.content ?? '');

  if (!file) {
    return <div className="editor-card empty-state">Select a document to begin editing.</div>;
  }

  return (
    <div className="editor-card editor-stack">
      <ReferenceToolbar onInsertReference={value => setDraft(current => `${current}\n\n${value}`)} />
      <div className="editor-split">
        <div className="editor-panel">
          <h3>Markdown</h3>
          <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
            spellCheck={false}
            className="markdown-input"
          />
        </div>
        <div className="editor-panel preview-panel">
          <h3>Preview</h3>
          <pre>{draft}</pre>
        </div>
      </div>
    </div>
  );
}
