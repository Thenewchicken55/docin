import { useMemo, useState } from 'react';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { OutlinePanel } from './components/sidebar/OutlinePanel';
import { WorkspaceSidebar } from './components/sidebar/WorkspaceSidebar';
import { getSelectedFile, starterFiles } from './lib/files/workspace';
import type { DocumentFile } from './types/workspace';

function App() {
  const [files] = useState<DocumentFile[]>(starterFiles);
  const [selectedPath, setSelectedPath] = useState<string | null>(starterFiles[0].path);

  const selectedFile = useMemo(
    () => getSelectedFile(files, selectedPath),
    [files, selectedPath]
  );

  return (
    <div className="app-shell">
      <WorkspaceSidebar files={files} selectedPath={selectedPath} onSelect={setSelectedPath} />
      <main className="editor-pane">
        <header className="editor-header">
          <h2>{selectedFile?.name ?? 'Untitled'}</h2>
          <span>Authoring workspace</span>
        </header>
        <div className="editor-content">
          <OutlinePanel markdown={selectedFile?.content ?? ''} />
          <MarkdownEditor file={selectedFile} />
        </div>
      </main>
    </div>
  );
}

export default App;
