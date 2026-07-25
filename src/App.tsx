import { useMemo, useState } from 'react';
import { CompositionModal } from './components/modal/CompositionModal';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { OutlinePanel } from './components/sidebar/OutlinePanel';
import { WorkspaceSidebar } from './components/sidebar/WorkspaceSidebar';
import { getSelectedFile, starterFiles } from './lib/files/workspace';
import type { DocumentFile } from './types/workspace';

function App() {
  const [files] = useState<DocumentFile[]>(starterFiles);
  const [selectedPath, setSelectedPath] = useState<string | null>(starterFiles[0].path);
  const [isCompositionModalOpen, setIsCompositionModalOpen] = useState(false);
  const [selectedCompositionPaths, setSelectedCompositionPaths] = useState<string[]>(
    starterFiles.map(file => file.path)
  );

  const selectedFile = useMemo(
    () => getSelectedFile(files, selectedPath),
    [files, selectedPath]
  );

  const handleToggleCompositionPath = (path: string) => {
    setSelectedCompositionPaths(current =>
      current.includes(path) ? current.filter(item => item !== path) : [...current, path]
    );
  };

  return (
    <div className="app-shell">
      <WorkspaceSidebar
        files={files}
        selectedPath={selectedPath}
        onSelect={setSelectedPath}
        onComposeClick={() => setIsCompositionModalOpen(true)}
      />
      <main className="editor-pane">
        <header className="editor-header">
          <h2>{selectedFile?.name ?? 'Untitled'}</h2>
          <span>Authoring workspace</span>
        </header>
        <div className="editor-content">
          <div className="side-stack">
            <OutlinePanel markdown={selectedFile?.content ?? ''} />
          </div>
          <MarkdownEditor file={selectedFile} />
        </div>
      </main>
      <CompositionModal
        isOpen={isCompositionModalOpen}
        onClose={() => setIsCompositionModalOpen(false)}
        files={files}
        selectedPaths={selectedCompositionPaths}
        onTogglePath={handleToggleCompositionPath}
      />
    </div>
  );
}

export default App;
