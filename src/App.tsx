import { useMemo, useState } from 'react';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { CompositionPanel } from './components/sidebar/CompositionPanel';
import { OutlinePanel } from './components/sidebar/OutlinePanel';
import { WorkspaceSidebar } from './components/sidebar/WorkspaceSidebar';
import { getSelectedFile, starterFiles } from './lib/files/workspace';
import { buildCompositionContent } from './lib/workspace/composition';
import type { DocumentFile } from './types/workspace';

function App() {
  const [files] = useState<DocumentFile[]>(starterFiles);
  const [selectedPath, setSelectedPath] = useState<string | null>(starterFiles[0].path);
  const [selectedCompositionPaths, setSelectedCompositionPaths] = useState<string[]>(starterFiles.map(file => file.path));

  const selectedFile = useMemo(
    () => getSelectedFile(files, selectedPath),
    [files, selectedPath]
  );

  const composedContent = useMemo(
    () => buildCompositionContent(files.filter(file => selectedCompositionPaths.includes(file.path)).map(file => file.content)),
    [files, selectedCompositionPaths]
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
          <div className="side-stack">
            <OutlinePanel markdown={selectedFile?.content ?? ''} />
            <CompositionPanel
              files={files}
              selectedPaths={selectedCompositionPaths}
              onTogglePath={path => {
                setSelectedCompositionPaths(current =>
                  current.includes(path) ? current.filter(item => item !== path) : [...current, path]
                );
              }}
            />
          </div>
          <MarkdownEditor file={selectedFile} />
        </div>
        <section className="composition-preview">
          <h3>Composed preview</h3>
          <pre>{composedContent}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;
