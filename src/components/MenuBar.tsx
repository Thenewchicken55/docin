import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';

type MenuBarProps = {
  onNewFile?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenCompose?: () => void;
  onToggleSidebar?: () => void;
};

export function MenuBar({ onNewFile, onOpenCommandPalette, onOpenCompose, onToggleSidebar }: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const setEditorMode = useWorkspaceStore((s) => s.setEditorMode);
  const editorMode = useWorkspaceStore((s) => s.editorMode);
  const setFontSize = useWorkspaceStore((s) => s.setFontSize);
  const fontSize = useWorkspaceStore((s) => s.fontSize);
  const toggleLineNumbers = useWorkspaceStore((s) => s.toggleLineNumbers);
  const toggleWordWrap = useWorkspaceStore((s) => s.toggleWordWrap);
  const toggleAutoSave = useWorkspaceStore((s) => s.toggleAutoSave);
  const autoSave = useWorkspaceStore((s) => s.autoSave);
  const selectedPath = useWorkspaceStore((s) => s.selectedPath);
  const deleteFile = useWorkspaceStore((s) => s.deleteFile);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const close = () => setActiveMenu(null);

  const menus: Record<string, { label: string; items: { label: string; shortcut?: string; action?: () => void; separator?: boolean; checked?: boolean }[] }> = {
    file: {
      label: 'File',
      items: [
        { label: 'New File', shortcut: '⌘N', action: () => { onNewFile?.(); close(); } },
        { label: 'separator', separator: true, action: () => {} },
        { label: 'Save', shortcut: '⌘S', action: () => { useWorkspaceStore.getState().markSaved(); close(); } },
        { label: 'Auto-Save', checked: autoSave, action: () => { toggleAutoSave(); close(); } },
        { label: 'separator', separator: true, action: () => {} },
        { label: 'Delete File', action: () => { if (selectedPath) deleteFile(selectedPath); close(); } },
      ],
    },
    edit: {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', action: () => { close(); } },
        { label: 'Redo', shortcut: '⌘⇧Z', action: () => { close(); } },
        { label: 'separator', separator: true, action: () => {} },
        { label: 'Find', shortcut: '⌘F', action: () => { close(); } },
        { label: 'Replace', shortcut: '⌘H', action: () => { close(); } },
      ],
    },
    view: {
      label: 'View',
      items: [
        { label: 'Edit Mode', shortcut: '⌘1', checked: editorMode === 'edit', action: () => { setEditorMode('edit'); close(); } },
        { label: 'Preview Mode', shortcut: '⌘2', checked: editorMode === 'preview', action: () => { setEditorMode('preview'); close(); } },
        { label: 'Split Mode', shortcut: '⌘3', checked: editorMode === 'split', action: () => { setEditorMode('split'); close(); } },
        { label: 'separator', separator: true, action: () => {} },
        { label: 'Toggle Sidebar', shortcut: '⌘B', action: () => { onToggleSidebar?.(); close(); } },
        { label: 'Toggle Line Numbers', action: () => { toggleLineNumbers(); close(); } },
        { label: 'Toggle Word Wrap', action: () => { toggleWordWrap(); close(); } },
        { label: 'separator', separator: true, action: () => {} },
        { label: 'Increase Font Size', shortcut: '⌘+', action: () => { setFontSize(Math.min(fontSize + 2, 32)); close(); } },
        { label: 'Decrease Font Size', shortcut: '⌘-', action: () => { setFontSize(Math.max(fontSize - 2, 10)); close(); } },
      ],
    },
    insert: {
      label: 'Insert',
      items: [
        { label: 'Command Palette...', shortcut: '⌘⇧P', action: () => { onOpenCommandPalette?.(); close(); } },
        { label: 'separator', separator: true, action: () => {} },
        { label: 'Compose Document', action: () => { onOpenCompose?.(); close(); } },
      ],
    },
    help: {
      label: 'Help',
      items: [
        { label: 'Keyboard Shortcuts', shortcut: '⌘?', action: () => { close(); } },
        { label: 'About Docin', action: () => { close(); } },
      ],
    },
  };

  return (
    <div className="menu-bar" ref={menuBarRef}>
      <div className="menu-bar-logo">Docin</div>
      {Object.entries(menus).map(([key, menu]) => (
        <div key={key} className="menu-bar-item">
          <button
            className={`menu-bar-button ${activeMenu === key ? 'active' : ''}`}
            onClick={() => setActiveMenu(activeMenu === key ? null : key)}
            onMouseEnter={() => activeMenu && setActiveMenu(key)}
          >
            {menu.label}
          </button>
          {activeMenu === key && (
            <div className="menu-dropdown">
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="menu-separator" />
                ) : (
                  <button
                    key={i}
                    className="menu-dropdown-item"
                    onClick={item.action}
                  >
                    {item.checked !== undefined && (
                      <span className="menu-check">{item.checked ? '✓' : ''}</span>
                    )}
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="menu-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
