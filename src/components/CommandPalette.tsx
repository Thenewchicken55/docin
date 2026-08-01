import { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { useWorkspaceStore } from '../store/workspaceStore';

type CommandPaletteProps = {
  onToggleSidebar?: () => void;
};

export function CommandPalette({ onToggleSidebar }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const files = useWorkspaceStore((s) => s.files);
  const addFile = useWorkspaceStore((s) => s.addFile);
  const deleteFile = useWorkspaceStore((s) => s.deleteFile);
  const setSelectedPath = useWorkspaceStore((s) => s.setSelectedPath);
  const setEditorMode = useWorkspaceStore((s) => s.setEditorMode);
  const editorMode = useWorkspaceStore((s) => s.editorMode);
  const toggleLineNumbers = useWorkspaceStore((s) => s.toggleLineNumbers);
  const toggleWordWrap = useWorkspaceStore((s) => s.toggleWordWrap);
  const toggleAutoSave = useWorkspaceStore((s) => s.toggleAutoSave);
  const setFontSize = useWorkspaceStore((s) => s.setFontSize);
  const fontSize = useWorkspaceStore((s) => s.fontSize);
  const [search, setSearch] = useState('');

  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  const runCommand = (fn: () => void) => {
    fn();
    setOpen(false);
    setSearch('');
  };

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command Palette">
      <Command.Input
        placeholder="Type a command or search files..."
        value={search}
        onValueChange={setSearch}
      />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Files">
          {files.map((file) => (
            <Command.Item
              key={file.path}
              value={`file:${file.name}`}
              onSelect={() => runCommand(() => setSelectedPath(file.path))}
            >
              <span className="cmd-icon">📄</span>
              {file.name}
              <span className="cmd-path">{file.path}</span>
            </Command.Item>
          ))}
          <Command.Item
            value="new-file"
            onSelect={() => runCommand(() => {
              const name = prompt('New file name (e.g., notes.md):');
              if (name?.trim()) addFile(name.trim());
            })}
          >
            <span className="cmd-icon">+</span>
            New File...
          </Command.Item>
        </Command.Group>

        <Command.Group heading="View">
          <Command.Item
            value="edit-mode"
            onSelect={() => runCommand(() => setEditorMode('edit'))}
          >
            <span className="cmd-icon">✏️</span>
            Switch to Edit Mode
            {editorMode === 'edit' && <span className="cmd-badge">active</span>}
          </Command.Item>
          <Command.Item
            value="preview-mode"
            onSelect={() => runCommand(() => setEditorMode('preview'))}
          >
            <span className="cmd-icon">👁️</span>
            Switch to Preview Mode
            {editorMode === 'preview' && <span className="cmd-badge">active</span>}
          </Command.Item>
          <Command.Item
            value="split-mode"
            onSelect={() => runCommand(() => setEditorMode('split'))}
          >
            <span className="cmd-icon">⬜</span>
            Switch to Split Mode
            {editorMode === 'split' && <span className="cmd-badge">active</span>}
          </Command.Item>
          <Command.Item
            value="toggle-sidebar"
            onSelect={() => runCommand(() => onToggleSidebar?.())}
          >
            <span className="cmd-icon">📋</span>
            Toggle Sidebar
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Editor">
          <Command.Item
            value="increase-font"
            onSelect={() => runCommand(() => setFontSize(Math.min(fontSize + 2, 32)))}
          >
            <span className="cmd-icon">🔍</span>
            Increase Font Size
          </Command.Item>
          <Command.Item
            value="decrease-font"
            onSelect={() => runCommand(() => setFontSize(Math.max(fontSize - 2, 10)))}
          >
            <span className="cmd-icon">🔎</span>
            Decrease Font Size
          </Command.Item>
          <Command.Item
            value="toggle-line-numbers"
            onSelect={() => runCommand(() => toggleLineNumbers())}
          >
            <span className="cmd-icon">#</span>
            Toggle Line Numbers
          </Command.Item>
          <Command.Item
            value="toggle-word-wrap"
            onSelect={() => runCommand(() => toggleWordWrap())}
          >
            <span className="cmd-icon">↩️</span>
            Toggle Word Wrap
          </Command.Item>
          <Command.Item
            value="toggle-autosave"
            onSelect={() => runCommand(() => toggleAutoSave())}
          >
            <span className="cmd-icon">💾</span>
            Toggle Auto-Save
          </Command.Item>
        </Command.Group>

        <Command.Group heading="File Operations">
          <Command.Item
            value="delete-file"
            onSelect={() => runCommand(() => {
              const path = useWorkspaceStore.getState().selectedPath;
              if (path && confirm('Delete this file?')) deleteFile(path);
            })}
          >
            <span className="cmd-icon">🗑️</span>
            Delete Current File
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
