import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
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
    <aside className="sidebar ide-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Docin</h1>
        <span className="sidebar-subtitle">Documentation Workspace</span>
      </div>
      <div className="sidebar-tabs">
        <button
          className={activeTab === 'files' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('files')}
        >
          Explorer
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

type FolderNode = {
  name: string;
  path: string;
  children: FolderNode[];
  files: DocumentFile[];
};

function buildFileTree(files: DocumentFile[]): FolderNode[] {
  const root: FolderNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      const folderPath = parts.slice(0, i + 1).join('/');
      let existing = current.find(
        (n) => n.name === folderName && n.path === folderPath
      );
      if (!existing) {
        existing = { name: folderName, path: folderPath, children: [], files: [] };
        current.push(existing);
      }
      current = existing.children;
    }

    const lastFolder = parts.length > 1
      ? findFolder(root, parts.slice(0, -1).join('/'))
      : null;
    if (lastFolder) {
      lastFolder.files.push(file);
    } else {
      root.push({ name: file.name, path: file.path, children: [], files: [file] });
    }
  }

  return root;
}

function findFolder(nodes: FolderNode[], path: string): FolderNode | null {
  for (const node of nodes) {
    if (node.path === path) return node;
    const found = findFolder(node.children, path);
    if (found) return found;
  }
  return null;
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'md':
    case 'mdx':
      return <FileText size={15} className="file-type-icon file-type-md" />;
    case 'json':
      return <FileText size={15} className="file-type-icon file-type-json" />;
    case 'ts':
    case 'tsx':
      return <FileText size={15} className="file-type-icon file-type-ts" />;
    default:
      return <FileText size={15} className="file-type-icon" />;
  }
}

function FolderNodeComponent({
  node,
  selectedPath,
  onSelect,
  onRenameFile,
  onDeleteFile,
  depth,
  focusedPath,
  onFocus,
}: {
  node: FolderNode;
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onRenameFile: (oldPath: string, newName: string) => void;
  onDeleteFile: (path: string) => void;
  depth: number;
  focusedPath: string | null;
  onFocus: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasSubItems = node.children.length > 0 || node.files.length > 0;
  const isFolderFocused = focusedPath === node.path;

  return (
    <div role="treeitem" aria-expanded={hasSubItems ? expanded : undefined} aria-level={depth + 1}>
      <button
        className={`tree-item tree-folder ${isFolderFocused ? 'focused' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          onFocus(node.path);
          if (hasSubItems) setExpanded(!expanded);
        }}
        tabIndex={-1}
        data-path={node.path}
      >
        <span className="tree-chevron">
          {hasSubItems && (
            <ChevronRight
              size={14}
              className={expanded ? 'chevron-expanded' : 'chevron-collapsed'}
            />
          )}
        </span>
        <span className="tree-icon">
          {expanded ? (
            <FolderOpen size={15} className="folder-icon folder-open" />
          ) : (
            <Folder size={15} className="folder-icon" />
          )}
        </span>
        <span className="tree-name">{node.name}</span>
      </button>
      {expanded && (
        <div role="group">
          {node.children.map((child) => (
            <FolderNodeComponent
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
              depth={depth + 1}
              focusedPath={focusedPath}
              onFocus={onFocus}
            />
          ))}
          {node.files.map((file) => (
            <FileItem
              key={file.path}
              file={file}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
              depth={depth + 1}
              focusedPath={focusedPath}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileItem({
  file,
  selectedPath,
  onSelect,
  onRenameFile,
  onDeleteFile,
  depth,
  focusedPath,
  onFocus,
}: {
  file: DocumentFile;
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onRenameFile: (oldPath: string, newName: string) => void;
  onDeleteFile: (path: string) => void;
  depth: number;
  focusedPath: string | null;
  onFocus: (path: string) => void;
}) {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);

  const isActive = file.path === selectedPath;
  const isFocused = file.path === focusedPath;

  const handleRename = () => {
    if (renameValue.trim() && renameValue.trim() !== file.name) {
      onRenameFile(file.path, renameValue.trim());
    }
    setShowRenameDialog(false);
  };

  return (
    <>
      <div
        className={`tree-item tree-file ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        role="treeitem"
        aria-selected={isActive}
        aria-level={depth + 1}
        data-path={file.path}
      >
        <button
          className="tree-file-button"
          onClick={() => {
            onFocus(file.path);
            onSelect(file.path);
          }}
          tabIndex={-1}
        >
          {getFileIcon(file.name)}
          <span className="tree-name">{file.name}</span>
        </button>
        <div className="file-actions">
          <button
            className="file-action-button"
            onClick={(e) => {
              e.stopPropagation();
              setRenameValue(file.name);
              setShowRenameDialog(true);
            }}
            title="Rename"
          >
            <Pencil size={13} />
          </button>
          <button
            className="file-action-button file-action-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFile(file.path);
            }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <Dialog.Root open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-backdrop" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title>Rename File</Dialog.Title>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="new-name.md"
              className="dialog-input"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
            <div className="dialog-actions">
              <Dialog.Close asChild>
                <button className="secondary-button">Cancel</button>
              </Dialog.Close>
              <button className="primary-button" onClick={handleRename}>
                Rename
              </button>
            </div>
            <Dialog.Close asChild>
              <button className="dialog-close-x" aria-label="Close">
                <X size={16} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function FileExplorer({
  files,
  selectedPath,
  onSelect,
  onAddFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [focusedPath, setFocusedPath] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  const tree = buildFileTree(files);

  const flatPaths = useCallback((): string[] => {
    const paths: string[] = [];
    const walk = (nodes: FolderNode[]) => {
      for (const node of nodes) {
        paths.push(node.path);
        walk(node.children);
        for (const f of node.files) {
          paths.push(f.path);
        }
      }
    };
    walk(tree);
    return paths;
  }, [tree]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!treeRef.current?.contains(document.activeElement) &&
          document.activeElement !== treeRef.current) return;

      const paths = flatPaths();
      if (paths.length === 0) return;

      const currentIndex = focusedPath ? paths.indexOf(focusedPath) : -1;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = currentIndex < paths.length - 1 ? currentIndex + 1 : 0;
          setFocusedPath(paths[next]);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : paths.length - 1;
          setFocusedPath(paths[prev]);
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (focusedPath) {
            const isFile = files.some((f) => f.path === focusedPath);
            if (isFile) onSelect(focusedPath);
          }
          break;
        }
      }
    };

    const el = treeRef.current;
    el?.addEventListener('keydown', handler);
    return () => el?.removeEventListener('keydown', handler);
  }, [focusedPath, files, flatPaths, onSelect]);

  const handleAddFile = () => {
    if (newFileName.trim()) {
      onAddFile(newFileName.trim());
      setNewFileName('');
      setShowAddDialog(false);
    }
  };

  return (
    <>
      <button className="add-file-button" onClick={() => setShowAddDialog(true)}>
        <Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
        New File
      </button>
      <div
        className="file-tree"
        ref={treeRef}
        role="tree"
        aria-label="File explorer"
        tabIndex={0}
      >
        {tree.map((node) =>
          node.files.length > 0 && node.children.length === 0 && node.files.length === 1 ? (
            <FileItem
              key={node.files[0].path}
              file={node.files[0]}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
              depth={0}
              focusedPath={focusedPath}
              onFocus={setFocusedPath}
            />
          ) : (
            <FolderNodeComponent
              key={node.path}
              node={node}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
              depth={0}
              focusedPath={focusedPath}
              onFocus={setFocusedPath}
            />
          )
        )}
      </div>

      <Dialog.Root open={showAddDialog} onOpenChange={setShowAddDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-backdrop" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title>Create New File</Dialog.Title>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.md"
              className="dialog-input"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
            />
            <div className="dialog-actions">
              <Dialog.Close asChild>
                <button className="secondary-button">Cancel</button>
              </Dialog.Close>
              <button className="primary-button" onClick={handleAddFile}>
                Create
              </button>
            </div>
            <Dialog.Close asChild>
              <button className="dialog-close-x" aria-label="Close">
                <X size={16} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
