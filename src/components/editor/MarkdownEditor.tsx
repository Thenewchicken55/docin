import { useEffect, useRef, useState } from 'react';
import { CollapsibleToolbar } from '../toolbar/CollapsibleToolbar';
import type { DocumentFile } from '../../types/workspace';

type MarkdownEditorProps = {
  file: DocumentFile | null;
};

export function MarkdownEditor({ file }: MarkdownEditorProps) {
  const [draft, setDraft] = useState(file?.content ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (file && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [file]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      event.preventDefault();
      // Save functionality would go here
    }
  };

  if (!file) {
    return <div className="editor-card empty-state">Select a document to begin editing.</div>;
  }

  return (
    <div className="editor-card editor-stack">
      <div className="toolbar-row">
        <CollapsibleToolbar onInsert={value => setDraft(current => `${current}\n\n${value}`)} />
      </div>
      <div className="editor-split">
        <div className="editor-panel">
          <h3>Markdown</h3>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
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
