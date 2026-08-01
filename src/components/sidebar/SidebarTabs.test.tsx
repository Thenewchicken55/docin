import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarTabs } from './SidebarTabs';
import { useWorkspaceStore } from '../../store/workspaceStore';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const mockProps = {
  files: [
    { path: 'docs/intro.md', name: 'intro.md', content: '# Introduction' },
    { path: 'docs/guide.md', name: 'guide.md', content: '# Guide' },
  ],
  selectedPath: 'docs/intro.md',
  onSelect: vi.fn(),
  onAddFile: vi.fn(),
  onRenameFile: vi.fn(),
  onDeleteFile: vi.fn(),
  onComposeClick: vi.fn(),
  markdown: '# Heading 1\n## Heading 2',
};

beforeEach(() => {
  vi.clearAllMocks();
  useWorkspaceStore.getState().reset();
});

describe('SidebarTabs', () => {
  it('renders file list with correct file names', () => {
    render(<SidebarTabs {...mockProps} />);
    expect(screen.getByText('intro.md')).toBeInTheDocument();
    expect(screen.getByText('guide.md')).toBeInTheDocument();
  });

  it('renders outline tab button', () => {
    render(<SidebarTabs {...mockProps} />);
    expect(screen.getByRole('button', { name: /outline/i })).toBeInTheDocument();
  });

  it('tab switching works between Files and Outline', async () => {
    const user = userEvent.setup();
    render(<SidebarTabs {...mockProps} />);

    const outlineTab = screen.getByRole('button', { name: /outline/i });
    await user.click(outlineTab);

    expect(screen.getByRole('button', { name: /explorer/i })).toBeInTheDocument();

    const explorerTab = screen.getByRole('button', { name: /explorer/i });
    await user.click(explorerTab);

    expect(screen.getByText('intro.md')).toBeInTheDocument();
  });

  it('new file button exists', () => {
    render(<SidebarTabs {...mockProps} />);
    expect(screen.getByRole('button', { name: /new file/i })).toBeInTheDocument();
  });

  it('compose button exists', () => {
    render(<SidebarTabs {...mockProps} />);
    expect(screen.getByRole('button', { name: /compose/i })).toBeInTheDocument();
  });

  it('compose button calls onComposeClick', async () => {
    const user = userEvent.setup();
    render(<SidebarTabs {...mockProps} />);
    await user.click(screen.getByRole('button', { name: /compose/i }));
    expect(mockProps.onComposeClick).toHaveBeenCalledTimes(1);
  });
});
