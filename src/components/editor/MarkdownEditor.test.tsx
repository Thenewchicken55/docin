import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarkdownEditor } from './MarkdownEditor';
import { useWorkspaceStore } from '../../store/workspaceStore';
import type { DocumentFile } from '../../types/workspace';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const mockFile: DocumentFile = {
  path: 'docs/test.md',
  name: 'test.md',
  content: '# Hello World\n\nThis is a test file.',
};

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('MarkdownEditor', () => {
  it('renders empty state when no file selected', () => {
    render(<MarkdownEditor file={null} />);
    expect(screen.getByText('No file selected')).toBeInTheDocument();
    expect(screen.getByText(/Select a file from the sidebar/)).toBeInTheDocument();
  });

  it('renders CodeMirror editor when file is provided', () => {
    const { container } = render(<MarkdownEditor file={mockFile} />);
    const cmEditor = container.querySelector('.cm-editor');
    expect(cmEditor).toBeInTheDocument();
  });

  it('shows file name in footer', () => {
    render(<MarkdownEditor file={mockFile} />);
    expect(screen.getByText('test.md')).toBeInTheDocument();
  });

  it('shows mode toggle buttons', () => {
    render(<MarkdownEditor file={mockFile} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /split/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
  });

  it('shows correct mode as active', () => {
    useWorkspaceStore.getState().setEditorMode('edit');
    const { rerender } = render(<MarkdownEditor file={mockFile} />);
    const editBtn = screen.getByRole('button', { name: /edit/i });
    expect(editBtn.className).toContain('active');

    useWorkspaceStore.getState().setEditorMode('preview');
    rerender(<MarkdownEditor file={mockFile} />);
    const previewBtn = screen.getByRole('button', { name: /preview/i });
    expect(previewBtn.className).toContain('active');
  });

  it('mode toggle buttons update store on click', async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor file={mockFile} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(useWorkspaceStore.getState().editorMode).toBe('edit');

    await user.click(screen.getByRole('button', { name: /preview/i }));
    expect(useWorkspaceStore.getState().editorMode).toBe('preview');

    await user.click(screen.getByRole('button', { name: /split/i }));
    expect(useWorkspaceStore.getState().editorMode).toBe('split');
  });
});
