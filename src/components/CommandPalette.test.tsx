import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './CommandPalette';
import { useWorkspaceStore } from '../store/workspaceStore';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('CommandPalette', () => {
  it('does not render dialog content when closed', () => {
    render(<CommandPalette />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when opened via keyboard shortcut', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.keyboard('{Meta>}{Shift>}p{/Shift}{/Meta}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows file list when open', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.keyboard('{Meta>}{Shift>}p{/Shift}{/Meta}');
    expect(screen.getByText('intro.md')).toBeInTheDocument();
    expect(screen.getByText('architecture.md')).toBeInTheDocument();
  });

  it('shows editor mode commands when open', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.keyboard('{Meta>}{Shift>}p{/Shift}{/Meta}');
    expect(screen.getByText(/Switch to Edit Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Switch to Preview Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Switch to Split Mode/)).toBeInTheDocument();
  });

  it('shows editor setting commands when open', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.keyboard('{Meta>}{Shift>}p{/Shift}{/Meta}');
    expect(screen.getByText(/Increase Font Size/)).toBeInTheDocument();
    expect(screen.getByText(/Decrease Font Size/)).toBeInTheDocument();
    expect(screen.getByText(/Toggle Line Numbers/)).toBeInTheDocument();
    expect(screen.getByText(/Toggle Word Wrap/)).toBeInTheDocument();
    expect(screen.getByText(/Toggle Auto-Save/)).toBeInTheDocument();
  });
});
