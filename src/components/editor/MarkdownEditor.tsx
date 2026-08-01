import { useCallback, useRef, useEffect } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
import { CollapsibleToolbar } from '../toolbar/CollapsibleToolbar';
import { MarkdownPreview } from '../../lib/markdown/renderer';
import { useWorkspaceStore } from '../../store/workspaceStore';
import type { DocumentFile } from '../../types/workspace';
import clsx from 'clsx';

type MarkdownEditorProps = {
  file: DocumentFile | null;
};

function createExtensions(
  path: string,
  updateFileContent: (path: string, content: string) => void,
  showLineNumbers: boolean,
  markSaved: () => void,
) {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      updateFileContent(path, update.state.doc.toString());
    }
  });

  const saveKeymap = keymap.of([
    {
      key: 'Mod-s',
      run: () => {
        markSaved();
        return true;
      },
    },
  ]);

  return [
    history(),
    drawSelection(),
    indentOnInput(),
    bracketMatching(),
    foldGutter(),
    markdown(),
    oneDark,
    syntaxHighlighting(defaultHighlightStyle),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    saveKeymap,
    updateListener,
    EditorView.lineWrapping,
    ...(showLineNumbers ? [lineNumbers(), highlightActiveLine(), highlightActiveLineGutter()] : []),
    EditorView.theme({
      '&': { height: '100%' },
      '.cm-scroller': { overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.6' },
      '.cm-content': { padding: '12px 0' },
      '.cm-gutters': { background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', color: 'var(--text-muted)' },
      '.cm-activeLineGutter': { background: 'var(--bg-hover)' },
      '.cm-activeLine': { background: 'var(--bg-hover)' },
      '.cm-selectionBackground': { background: 'var(--accent-dim) !important' },
      '.cm-cursor': { borderLeftColor: 'var(--accent)' },
    }),
  ];
}

export function MarkdownEditor({ file }: MarkdownEditorProps) {
  const updateFileContent = useWorkspaceStore((s) => s.updateFileContent);
  const editorMode = useWorkspaceStore((s) => s.editorMode);
  const setEditorMode = useWorkspaceStore((s) => s.setEditorMode);
  const showLineNumbers = useWorkspaceStore((s) => s.showLineNumbers);
  const markSaved = useWorkspaceStore((s) => s.markSaved);

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!file || !editorContainerRef.current) return;

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const state = EditorState.create({
      doc: file.content,
      extensions: createExtensions(file.path, updateFileContent, showLineNumbers, markSaved),
    });

    viewRef.current = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [file, file?.path, file?.content, updateFileContent, showLineNumbers, markSaved]);

  const handleInsert = useCallback(
    (value: string) => {
      const view = viewRef.current;
      if (view) {
        const pos = view.state.selection.main.head;
        view.dispatch({
          changes: { from: pos, insert: '\n\n' + value },
          selection: { anchor: pos + value.length + 2 },
        });
        view.focus();
      }
    },
    []
  );

  const content = file?.content ?? '';

  if (!file) {
    return (
      <div className="editor-empty-state">
        <div className="editor-empty-icon">📝</div>
        <h2>No file selected</h2>
        <p>Select a file from the sidebar or create a new one to get started.</p>
      </div>
    );
  }

  return (
    <div className="editor-card ide-editor">
      <div className="editor-toolbar">
        <CollapsibleToolbar onInsert={handleInsert} />
        <div className="editor-mode-toggle">
          <button
            className={clsx('mode-btn', editorMode === 'edit' && 'active')}
            onClick={() => setEditorMode('edit')}
            title="Edit Mode (⌘1)"
          >
            Edit
          </button>
          <button
            className={clsx('mode-btn', editorMode === 'split' && 'active')}
            onClick={() => setEditorMode('split')}
            title="Split Mode (⌘3)"
          >
            Split
          </button>
          <button
            className={clsx('mode-btn', editorMode === 'preview' && 'active')}
            onClick={() => setEditorMode('preview')}
            title="Preview Mode (⌘2)"
          >
            Preview
          </button>
        </div>
      </div>

      <div className={clsx('editor-split', `mode-${editorMode}`)}>
        {(editorMode === 'edit' || editorMode === 'split') && (
          <div className="editor-panel editor-source-panel">
            <div ref={editorContainerRef} className="cm-editor-container" />
          </div>
        )}

        {(editorMode === 'preview' || editorMode === 'split') && (
          <div className="editor-panel editor-preview-panel">
            <MarkdownPreview content={content} className="preview-content" />
          </div>
        )}
      </div>

      <div className="editor-footer">
        <span className="editor-file-info">{file.name}</span>
        <span className="editor-stat">{content.split('\n').length} lines</span>
        <span className="editor-stat">{content.length} chars</span>
      </div>
    </div>
  );
}
