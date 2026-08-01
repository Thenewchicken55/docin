import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompositionModal } from './CompositionModal';
import { useWorkspaceStore } from '../../store/workspaceStore';
import type { DocumentFile } from '../../types/workspace';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const mockFiles: DocumentFile[] = [
  { path: 'docs/intro.md', name: 'intro.md', content: '# Introduction' },
  { path: 'docs/guide.md', name: 'guide.md', content: '# Guide' },
];

const defaultProps = {
  isOpen: false,
  onClose: vi.fn(),
  files: mockFiles,
  selectedPaths: ['docs/intro.md'],
  onTogglePath: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  useWorkspaceStore.getState().reset();
});

describe('CompositionModal', () => {
  it('does not render when closed', () => {
    render(<CompositionModal {...defaultProps} />);
    expect(screen.queryByText('Compose Document')).not.toBeInTheDocument();
  });

  it('renders when open with file list', () => {
    render(<CompositionModal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Compose Document')).toBeInTheDocument();
    expect(screen.getByText('intro.md')).toBeInTheDocument();
    expect(screen.getByText('guide.md')).toBeInTheDocument();
  });

  it('shows file checkboxes', () => {
    render(<CompositionModal {...defaultProps} isOpen={true} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('copy button exists', () => {
    render(<CompositionModal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument();
  });

  it('download button exists', () => {
    render(<CompositionModal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Download .md')).toBeInTheDocument();
  });

  it('close button calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CompositionModal {...defaultProps} isOpen={true} onClose={onClose} />);
    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('checkbox click calls onTogglePath', async () => {
    const user = userEvent.setup();
    const onTogglePath = vi.fn();
    render(
      <CompositionModal
        {...defaultProps}
        isOpen={true}
        onTogglePath={onTogglePath}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    expect(onTogglePath).toHaveBeenCalledWith('docs/guide.md');
  });
});
