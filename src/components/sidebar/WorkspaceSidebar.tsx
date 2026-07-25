import type { DocumentFile } from '../../types/workspace';

type WorkspaceSidebarProps = {
  files: DocumentFile[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onComposeClick: () => void;
};

export function WorkspaceSidebar({ files, selectedPath, onSelect, onComposeClick }: WorkspaceSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Docin</h1>
        <p>Documentation workspace</p>
      </div>
      <nav>
        {files.map(file => (
          <button
            key={file.path}
            className={file.path === selectedPath ? 'nav-item active' : 'nav-item'}
            onClick={() => onSelect(file.path)}
          >
            {file.name}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="compose-button" onClick={onComposeClick}>
          Compose
        </button>
      </div>
    </aside>
  );
}
