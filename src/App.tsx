import { useState, useCallback, useMemo, useEffect } from 'react';
import { Group as ResizablePanelGroup, Panel as ResizablePanel, Separator as ResizableHandle } from 'react-resizable-panels';
import { MenuBar } from './components/MenuBar';
import { SidebarTabs } from './components/sidebar/SidebarTabs';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { LintPanel } from './components/linting/LintPanel';
import { MobileBlocker } from './components/mobile/MobileBlocker';
import { StatusBar } from './components/StatusBar';
import { CommandPalette } from './components/CommandPalette';
import { CompositionModal } from './components/modal/CompositionModal';
import { useWorkspaceStore } from './store/workspaceStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { lintReferences } from './lib/linting/referenceParser';

function App() {
  const files = useWorkspaceStore((s) => s.files);
  const selectedPath = useWorkspaceStore((s) => s.selectedPath);
  const compositionPaths = useWorkspaceStore((s) => s.compositionPaths);
  const addFile = useWorkspaceStore((s) => s.addFile);
  const renameFile = useWorkspaceStore((s) => s.renameFile);
  const deleteFile = useWorkspaceStore((s) => s.deleteFile);
  const setSelectedPath = useWorkspaceStore((s) => s.setSelectedPath);
  const toggleCompositionPath = useWorkspaceStore((s) => s.toggleCompositionPath);
  const theme = useWorkspaceStore((s) => s.theme);

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    const resolved = theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  }, [theme]);

  const selectedFile = useMemo(
    () => files.find((f) => f.path === selectedPath) ?? files[0] ?? null,
    [files, selectedPath]
  );

  const [lintErrors, setLintErrors] = useState<ReturnType<typeof lintReferences>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedFile) {
        setLintErrors(lintReferences(selectedFile.content));
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedFile, selectedFile?.content]);

  const handleNewFile = useCallback(() => {
    const name = prompt('New file name (e.g., notes.md):');
    if (name?.trim()) addFile(name.trim());
  }, [addFile]);

  const handleSave = useCallback(() => {
    useWorkspaceStore.getState().markSaved();
  }, []);

  useKeyboardShortcuts({
    onNewFile: handleNewFile,
    onSave: handleSave,
    onToggleSidebar: () => setSidebarVisible((v) => !v),
  });

  const lintCount = lintErrors.length;

  return (
    <>
      <MobileBlocker />
      <div className="app-shell-ide">
        <MenuBar
          onNewFile={handleNewFile}
          onToggleSidebar={() => setSidebarVisible((v) => !v)}
          onOpenCompose={() => setIsComposeOpen(true)}
        />
        <div className="app-main">
          <ResizablePanelGroup orientation="horizontal" className="app-workspace">
            {sidebarVisible && (
              <>
                <ResizablePanel defaultSize={22} minSize={15} maxSize={35}>
                  <SidebarTabs
                    files={files}
                    selectedPath={selectedPath}
                    onSelect={setSelectedPath}
                    onAddFile={(name) => addFile(name)}
                    onRenameFile={renameFile}
                    onDeleteFile={deleteFile}
                    onComposeClick={() => setIsComposeOpen(true)}
                    markdown={selectedFile?.content ?? ''}
                  />
                </ResizablePanel>
                <ResizableHandle className="resize-handle" />
              </>
            )}
            <ResizablePanel defaultSize={sidebarVisible ? 56 : 75} minSize={40}>
              <main className="editor-pane">
                <MarkdownEditor file={selectedFile} />
              </main>
            </ResizablePanel>
            {lintCount > 0 && (
              <>
                <ResizableHandle className="resize-handle" />
                <ResizablePanel defaultSize={22} minSize={15} maxSize={30}>
                  <LintPanel errors={lintErrors} />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        <StatusBar />
        <CommandPalette onToggleSidebar={() => setSidebarVisible((v) => !v)} />
        <CompositionModal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          files={files}
          selectedPaths={compositionPaths}
          onTogglePath={toggleCompositionPath}
        />
      </div>
    </>
  );
}

export default App;
