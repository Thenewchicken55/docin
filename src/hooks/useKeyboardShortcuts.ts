import { useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';

type KeyboardShortcutHandlers = {
  onNewFile?: () => void;
  onSave?: () => void;
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
  onTogglePreview?: () => void;
};

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const setEditorMode = useWorkspaceStore((s) => s.setEditorMode);
  const setFontSize = useWorkspaceStore((s) => s.setFontSize);
  const fontSize = useWorkspaceStore((s) => s.fontSize);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
        useWorkspaceStore.getState().markSaved();
      }

      if (mod && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        handlers.onOpenCommandPalette?.();
      }

      if (mod && e.key === 'b') {
        e.preventDefault();
        handlers.onToggleSidebar?.();
      }

      if (mod && e.key === 'n') {
        e.preventDefault();
        handlers.onNewFile?.();
      }

      if (mod && e.key === '1') {
        e.preventDefault();
        setEditorMode('edit');
      }
      if (mod && e.key === '2') {
        e.preventDefault();
        setEditorMode('preview');
      }
      if (mod && e.key === '3') {
        e.preventDefault();
        setEditorMode('split');
      }

      if (mod && e.key === '=') {
        e.preventDefault();
        setFontSize(Math.min(fontSize + 2, 32));
      }
      if (mod && e.key === '-') {
        e.preventDefault();
        setFontSize(Math.max(fontSize - 2, 10));
      }
    },
    [handlers, setEditorMode, setFontSize, fontSize]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
