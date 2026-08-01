import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';
import { useWorkspaceStore } from '../store/workspaceStore';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('StatusBar', () => {
  it('shows selected file name', () => {
    render(<StatusBar />);
    expect(screen.getByText('intro.md')).toBeInTheDocument();
  });

  it('shows word count', () => {
    render(<StatusBar />);
    const wordCount = screen.getByText(/words/);
    expect(wordCount).toBeInTheDocument();
    const text = wordCount.textContent ?? '';
    const count = parseInt(text, 10);
    expect(count).toBeGreaterThan(0);
  });

  it('shows character count', () => {
    render(<StatusBar />);
    const charCount = screen.getByText(/chars/);
    expect(charCount).toBeInTheDocument();
    const text = charCount.textContent ?? '';
    const count = parseInt(text, 10);
    expect(count).toBeGreaterThan(0);
  });

  it('shows editor mode', () => {
    render(<StatusBar />);
    expect(screen.getByText('split')).toBeInTheDocument();
  });

  it('shows dirty state when file is modified', () => {
    const store = useWorkspaceStore.getState();
    store.updateFileContent(store.files[0].path, 'modified content');
    render(<StatusBar />);
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('shows saved state when not dirty', () => {
    render(<StatusBar />);
    expect(screen.getByText(/Saved/)).toBeInTheDocument();
  });

  it('shows no file when none selected', () => {
    useWorkspaceStore.getState().setSelectedPath(null);
    render(<StatusBar />);
    expect(screen.getByText('No file')).toBeInTheDocument();
  });
});
