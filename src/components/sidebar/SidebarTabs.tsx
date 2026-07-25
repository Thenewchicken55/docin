import { useState } from 'react';
import type { DocumentFile } from '../../types/workspace';
import { OutlinePanel } from './OutlinePanel';

type SidebarTabsProps = {
  files: DocumentFile[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onAddFile: (name: string) => void;
  onRenameFile: (oldPath: string, newName: string) => void;
  onDeleteFile: (path: string) => void;
  onComposeClick: () => void;
  markdown: string;
  onInsertReference?: (slug: string) => void;
};

export function SidebarTabs({
  files,
  selectedPath,
  onSelect,
  onAddFile,
  onRenameFile,
  onDeleteFile,
  onComposeClick,
  markdown,
  onInsertReference,
}: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'outline'>('files');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Docin</h1>
        <p>Documentation workspace</p>
      </div>
      <div className="sidebar-tabs">
        <button
          className={activeTab === 'files' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('files')}
        >
          Files
        </button>
        <button
          className={activeTab === 'outline' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('outline')}
        >
          Outline
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === 'files' ? (
          <FileExplorer
            files={files}
            selectedPath={selectedPath}
            onSelect={onSelect}
            onAddFile={onAddFile}
            onRenameFile={onRenameFile}
            onDeleteFile={onDeleteFile}
          />
        ) : (
          <OutlinePanel
            markdown={markdown}
            onInsertReference={onInsertReference}
          />
        )}
      </div>
      <div className="sidebar-footer">
        <button className="compose-button" onClick={onComposeClick}>
          Compose
        </button>
      </div>
    </aside>
  );
}

type FileExplorerProps = {
  files: DocumentFile[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onAddFile: (name: string) => void;
  onRenameFile: (oldPath: string, newName: string) => void;
  onDeleteFile: (path: string) => void;
};

function FileExplorer({
  files,
  selectedPath,
  onSelect,
  onAddFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renameTarget, setRenameTarget] = useState<string | null>(null);

  const handleAddFile = () => {
    if (newFileName.trim()) {
      onAddFile(newFileName.trim());
      setNewFileName('');
      setShowAddDialog(false);
    }
  };

  const handleRenameFile = () => {
    if (renameTarget && newFileName.trim()) {
      onRenameFile(renameTarget, newFileName.trim());
      setNewFileName('');
      setRenameTarget(null);
      setShowRenameDialog(false);
    }
  };

  const openRenameDialog = (path: string) => {
    setRenameTarget(path);
    setNewFileName(files.find(f => f.path === path)?.name || '');
    setShowRenameDialog(true);
  };

  return (
    <>
      <button className="add-file-button" onClick={() => setShowAddDialog(true)}>
        + New File
      </button>
      <nav>
        {files.map(file => (
          <div key={file.path} className="file-item">
            <button
              className={file.path === selectedPath ? 'nav-item active' : 'nav-item'}
              onClick={() => onSelect(file.path)}
            >
              {file.name}
            </button>
            <div className="file-actions">
              <button
                className="file-action-button"
                onClick={() => openRenameDialog(file.path)}
                title="Rename"
              >
                ✎
              </button>
              <button
                className="file-action-button"
                onClick={() => onDeleteFile(file.path)}
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </nav>

      {showAddDialog && (
        <div className="dialog-backdrop" onClick={() => setShowAddDialog(false)}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <h3>Create New File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              placeholder="filename.md"
              className="dialog-input"
              autoFocus
            />
            <div className="dialog-actions">
              <button className="secondary-button" onClick={() => setShowAddDialog(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={handleAddFile}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showRenameDialog && (
        <div className="dialog-backdrop" onClick={() => setShowRenameDialog(false)}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <h3>Rename File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              placeholder="new-name.md"
              className="dialog-input"
              autoFocus
            />
            <div className="dialog-actions">
              <button className="secondary-button" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={handleRenameFile}>
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
