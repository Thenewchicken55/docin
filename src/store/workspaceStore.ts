import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentFile } from '../types/workspace';
import { starterFiles } from '../lib/files/workspace';

export type EditorMode = 'edit' | 'preview' | 'split';

export type Theme = 'dark' | 'light' | 'auto';

export interface WorkspaceState {
  files: DocumentFile[];
  selectedPath: string | null;
  compositionPaths: string[];
  editorMode: EditorMode;
  theme: Theme;
  fontSize: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
  autoSave: boolean;
  lastSaved: number | null;
  isDirty: boolean;

  setSelectedPath: (path: string | null) => void;
  addFile: (name: string) => void;
  renameFile: (oldPath: string, newName: string) => void;
  deleteFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  setEditorMode: (mode: EditorMode) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  toggleLineNumbers: () => void;
  toggleWordWrap: () => void;
  toggleAutoSave: () => void;
  setCompositionPaths: (paths: string[]) => void;
  toggleCompositionPath: (path: string) => void;
  markSaved: () => void;
  reset: () => void;
}

const initialState = {
  files: starterFiles,
  selectedPath: starterFiles[0]?.path ?? null,
  compositionPaths: starterFiles.map(f => f.path),
  editorMode: 'split' as EditorMode,
  theme: 'dark' as Theme,
  fontSize: 14,
  showLineNumbers: true,
  wordWrap: true,
  autoSave: true,
  lastSaved: null,
  isDirty: false,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedPath: (path) => set({ selectedPath: path }),

      addFile: (name) => {
        const newPath = `docs/${name}`;
        const newFile: DocumentFile = { path: newPath, name, content: '' };
        set(state => ({
          files: [...state.files, newFile],
          selectedPath: newPath,
        }));
      },

      renameFile: (oldPath, newName) => {
        const newPath = `docs/${newName}`;
        set(state => ({
          files: state.files.map(f =>
            f.path === oldPath ? { ...f, path: newPath, name: newName } : f
          ),
          selectedPath: state.selectedPath === oldPath ? newPath : state.selectedPath,
        }));
      },

      deleteFile: (path) => {
        set(state => {
          const remaining = state.files.filter(f => f.path !== path);
          return {
            files: remaining,
            selectedPath:
              state.selectedPath === path
                ? remaining[0]?.path ?? null
                : state.selectedPath,
          };
        });
      },

      updateFileContent: (path, content) => {
        set(state => ({
          files: state.files.map(f =>
            f.path === path ? { ...f, content } : f
          ),
          isDirty: true,
        }));
      },

      setEditorMode: (mode) => set({ editorMode: mode }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (size) => set({ fontSize: size }),
      toggleLineNumbers: () => set(state => ({ showLineNumbers: !state.showLineNumbers })),
      toggleWordWrap: () => set(state => ({ wordWrap: !state.wordWrap })),
      toggleAutoSave: () => set(state => ({ autoSave: !state.autoSave })),
      setCompositionPaths: (paths) => set({ compositionPaths: paths }),
      toggleCompositionPath: (path) =>
        set(state => ({
          compositionPaths: state.compositionPaths.includes(path)
            ? state.compositionPaths.filter(p => p !== path)
            : [...state.compositionPaths, path],
        })),
      markSaved: () => set({ isDirty: false, lastSaved: Date.now() }),
      reset: () => set(initialState),
    }),
    { name: 'docin-workspace' }
  )
);
