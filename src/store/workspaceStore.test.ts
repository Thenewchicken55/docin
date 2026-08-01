import { describe, expect, it, beforeEach } from 'vitest';
import { useWorkspaceStore } from './workspaceStore';

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('workspaceStore', () => {
  it('has initial state with starter files', () => {
    const state = useWorkspaceStore.getState();
    expect(state.files.length).toBeGreaterThan(0);
    expect(state.selectedPath).toBeDefined();
    expect(state.editorMode).toBe('split');
    expect(state.theme).toBe('dark');
    expect(state.autoSave).toBe(true);
  });

  it('adds a new file', () => {
    const store = useWorkspaceStore.getState();
    store.addFile('test.md');
    const state = useWorkspaceStore.getState();
    expect(state.files.some((f) => f.name === 'test.md')).toBe(true);
    expect(state.selectedPath).toBe('docs/test.md');
  });

  it('renames a file', () => {
    const store = useWorkspaceStore.getState();
    const firstPath = store.files[0].path;
    store.renameFile(firstPath, 'renamed.md');
    const state = useWorkspaceStore.getState();
    expect(state.files.some((f) => f.name === 'renamed.md')).toBe(true);
  });

  it('deletes a file', () => {
    const store = useWorkspaceStore.getState();
    const initialLength = store.files.length;
    const firstPath = store.files[0].path;
    store.deleteFile(firstPath);
    const state = useWorkspaceStore.getState();
    expect(state.files.length).toBe(initialLength - 1);
  });

  it('updates file content', () => {
    const store = useWorkspaceStore.getState();
    const firstPath = store.files[0].path;
    store.updateFileContent(firstPath, '# Updated Content');
    const state = useWorkspaceStore.getState();
    const file = state.files.find((f) => f.path === firstPath);
    expect(file?.content).toBe('# Updated Content');
    expect(state.isDirty).toBe(true);
  });

  it('toggles editor mode', () => {
    const store = useWorkspaceStore.getState();
    store.setEditorMode('edit');
    expect(useWorkspaceStore.getState().editorMode).toBe('edit');
    store.setEditorMode('preview');
    expect(useWorkspaceStore.getState().editorMode).toBe('preview');
  });

  it('marks saved resets dirty state', () => {
    const store = useWorkspaceStore.getState();
    store.updateFileContent(store.files[0].path, 'changed');
    expect(useWorkspaceStore.getState().isDirty).toBe(true);
    store.markSaved();
    expect(useWorkspaceStore.getState().isDirty).toBe(false);
    expect(useWorkspaceStore.getState().lastSaved).toBeDefined();
  });

  it('toggles line numbers', () => {
    const store = useWorkspaceStore.getState();
    const initial = store.showLineNumbers;
    store.toggleLineNumbers();
    expect(useWorkspaceStore.getState().showLineNumbers).toBe(!initial);
  });

  it('toggles word wrap', () => {
    const store = useWorkspaceStore.getState();
    const initial = store.wordWrap;
    store.toggleWordWrap();
    expect(useWorkspaceStore.getState().wordWrap).toBe(!initial);
  });

  it('toggles auto-save', () => {
    const store = useWorkspaceStore.getState();
    const initial = store.autoSave;
    store.toggleAutoSave();
    expect(useWorkspaceStore.getState().autoSave).toBe(!initial);
  });

  it('sets font size within bounds', () => {
    const store = useWorkspaceStore.getState();
    store.setFontSize(20);
    expect(useWorkspaceStore.getState().fontSize).toBe(20);
  });

  it('resets to initial state', () => {
    const store = useWorkspaceStore.getState();
    store.addFile('extra.md');
    store.setFontSize(24);
    store.reset();
    const state = useWorkspaceStore.getState();
    expect(state.files.length).toBe(2);
    expect(state.fontSize).toBe(14);
  });
});
