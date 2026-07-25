import { useEffect, useMemo, useState } from 'react';
import { CompositionModal } from './components/modal/CompositionModal';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { OutlinePanel } from './components/sidebar/OutlinePanel';
import { WorkspaceSidebar } from './components/sidebar/WorkspaceSidebar';
import { LintPanel } from './components/linting/LintPanel';
import { getSelectedFile, starterFiles } from './lib/files/workspace';
import { lintReferences } from './lib/linting/referenceParser';
import type { DocumentFile } from './types/workspace';

function App() {
  const [files, setFiles] = useState<DocumentFile[]>(starterFiles);
  const [selectedPath, setSelectedPath] = useState<string | null>(starterFiles[0].path);
  const [isCompositionModalOpen, setIsCompositionModalOpen] = useState(false);
  const [selectedCompositionPaths, setSelectedCompositionPaths] = useState<string[]>(
    starterFiles.map(file => file.path)
  );
  const [lintErrors, setLintErrors] = useState<any[]>([]);

  const selectedFile = useMemo(
    () => getSelectedFile(files, selectedPath),
    [files, selectedPath]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedFile) {
        setLintErrors(lintReferences(selectedFile.content));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedFile?.content]);

  const handleToggleCompositionPath = (path: string) => {
    setSelectedCompositionPaths(current =>
      current.includes(path) ? current.filter(item => item !== path) : [...current, path]
    );
  };

  const handleAddFile = (name: string) => {
    const newPath = `docs/${name}`;
    const newFile: DocumentFile = {
      path: newPath,
      name: name,
      content: '',
    };
    setFiles([...files, newFile]);
    setSelectedPath(newPath);
  };

  const handleRenameFile = (oldPath: string, newName: string) => {
    const newPath = `docs/${newName}`;
    setFiles(files.map(file => 
      file.path === oldPath 
        ? { ...file, path: newPath, name: newName }
        : file
    ));
    if (selectedPath === oldPath) {
      setSelectedPath(newPath);
    }
  };

  const handleDeleteFile = (path: string) => {
    const remainingFiles = files.filter(file => file.path !== path);
    setFiles(remainingFiles);
    if (selectedPath === path && remainingFiles.length > 0) {
      setSelectedPath(remainingFiles[0].path);
    } else if (selectedPath === path) {
      setSelectedPath(null);
    }
  };

  const handleInsertHeadingReference = (slug: string) => {
    if (selectedFile) {
      const reference = `[@sec:${slug}]`;
      // This would need to be integrated with the editor's draft state
      console.log('Insert reference:', reference);
    }
  };

  return (
    <div className="app-shell">
      <WorkspaceSidebar
        files={files}
        selectedPath={selectedPath}
        onSelect={setSelectedPath}
        onComposeClick={() => setIsCompositionModalOpen(true)}
        onAddFile={handleAddFile}
        onRenameFile={handleRenameFile}
        onDeleteFile={handleDeleteFile}
      />
      <main className="editor-pane">
        <header className="editor-header">
          <h2>{selectedFile?.name ?? 'Untitled'}</h2>
          <span>Authoring workspace</span>
        </header>
        <div className="editor-content">
          <div className="side-stack">
            <OutlinePanel
              markdown={selectedFile?.content ?? ''}
              onInsertReference={handleInsertHeadingReference}
            />
            <LintPanel errors={lintErrors} />
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
