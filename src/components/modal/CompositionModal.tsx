import { useState } from 'react';
import type { DocumentFile } from '../../types/workspace';

type CompositionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  files: DocumentFile[];
  selectedPaths: string[];
  onTogglePath: (path: string) => void;
};

export function CompositionModal({
  isOpen,
  onClose,
  files,
  selectedPaths,
  onTogglePath,
}: CompositionModalProps) {
  const [documentTitle, setDocumentTitle] = useState('');

  if (!isOpen) return null;

  const selectedFiles = files.filter(file => selectedPaths.includes(file.path));
  const composedContent = selectedFiles.map(file => file.content).filter(Boolean).join('\n\n');

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(composedContent);
  };

  const handleDownload = () => {
    const filename = documentTitle.trim() ? `${documentTitle.trim().toLowerCase().replace(/\s+/g, '-')}.md` : 'composed-document.md';
    const blob = new Blob([composedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Compose Document</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="composition-section">
            <h3>Document Title</h3>
            <input
              type="text"
              value={documentTitle}
              onChange={e => setDocumentTitle(e.target.value)}
              placeholder="Enter document title..."
              className="document-title-input"
            />
          </div>
          <div className="composition-section">
            <h3>Select Files</h3>
            <ul className="file-list">
              {files.map(file => {
                const isSelected = selectedPaths.includes(file.path);
                return (
                  <li key={file.path}>
                    <label>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onTogglePath(file.path)}
                      />
                      {file.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="composition-section">
            <h3>Preview</h3>
            <pre className="composed-preview">{composedContent || 'No files selected'}</pre>
          </div>
        </div>
        <div className="modal-footer">
          <button className="secondary-button" onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </button>
          <button className="secondary-button" onClick={handleDownload}>
            Download .md
          </button>
          <button className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
