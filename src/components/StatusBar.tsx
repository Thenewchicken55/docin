import { Sun, Moon } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import type { Theme } from '../store/workspaceStore';

const themeOrder: Theme[] = ['dark', 'light', 'auto'];

export function StatusBar() {
  const selectedPath = useWorkspaceStore((s) => s.selectedPath);
  const editorMode = useWorkspaceStore((s) => s.editorMode);
  const isDirty = useWorkspaceStore((s) => s.isDirty);
  const lastSaved = useWorkspaceStore((s) => s.lastSaved);
  const files = useWorkspaceStore((s) => s.files);
  const theme = useWorkspaceStore((s) => s.theme);
  const setTheme = useWorkspaceStore((s) => s.setTheme);
  const selectedFile = files.find((f) => f.path === selectedPath);

  const wordCount = selectedFile
    ? selectedFile.content.split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = selectedFile ? selectedFile.content.length : 0;

  const savedText = isDirty
    ? 'Unsaved changes'
    : lastSaved
      ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
      : 'Saved';

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
  };

  return (
    <footer className="status-bar">
      <div className="status-left">
        <span className="status-item">
          {selectedFile?.name ?? 'No file'}
        </span>
        <span className="status-item status-separator">|</span>
        <span className="status-item">{wordCount} words</span>
        <span className="status-item status-separator">|</span>
        <span className="status-item">{charCount} chars</span>
      </div>
      <div className="status-right">
        <button className="status-theme-toggle" onClick={cycleTheme} title={`Theme: ${theme}`}>
          {theme === 'light' ? (
            <Sun size={13} />
          ) : (
            <Moon size={13} />
          )}
          <span className="status-item">{theme}</span>
        </button>
        <span className="status-item status-separator">|</span>
        <span className="status-item">{editorMode}</span>
        <span className="status-item status-separator">|</span>
        <span className={`status-item ${isDirty ? 'status-dirty' : 'status-saved'}`}>
          {savedText}
        </span>
        <span className="status-item status-separator">|</span>
        <span className="status-item">Markdown</span>
      </div>
    </footer>
  );
}
