import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LintPanel } from './LintPanel';
import { useWorkspaceStore } from '../../store/workspaceStore';
import type { LintError } from '../../lib/linting/referenceParser';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const mockErrors: LintError[] = [
  {
    type: 'broken_reference',
    reference: '[@sec:missing]',
    line: 5,
    message: 'Broken heading reference: missing not found',
  },
  {
    type: 'duplicate_reference',
    reference: '[@fig:1]',
    line: 10,
    message: 'Duplicate figure reference: [@fig:1]',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  useWorkspaceStore.getState().reset();
});

describe('LintPanel', () => {
  it('shows "No problems detected" when no errors', () => {
    render(<LintPanel errors={[]} />);
    expect(screen.getByText('No problems detected')).toBeInTheDocument();
  });

  it('renders error list when errors exist', () => {
    render(<LintPanel errors={mockErrors} />);
    expect(screen.getByText(/Broken heading reference/)).toBeInTheDocument();
    expect(screen.getByText(/Duplicate figure reference/)).toBeInTheDocument();
  });

  it('shows error type and line number', () => {
    render(<LintPanel errors={mockErrors} />);
    expect(screen.getByText('Ln 5')).toBeInTheDocument();
    expect(screen.getByText('Ln 10')).toBeInTheDocument();
  });

  it('shows error messages', () => {
    render(<LintPanel errors={mockErrors} />);
    expect(screen.getByText('Broken heading reference: missing not found')).toBeInTheDocument();
    expect(screen.getByText('Duplicate figure reference: [@fig:1]')).toBeInTheDocument();
  });

  it('collapse/expand toggle works', async () => {
    const user = userEvent.setup();
    render(<LintPanel errors={mockErrors} />);

    expect(screen.getByText(/Broken heading reference/)).toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: /▼/ });
    await user.click(toggleBtn);

    expect(screen.queryByText(/Broken heading reference/)).not.toBeInTheDocument();

    const expandBtn = screen.getByRole('button', { name: /▶/ });
    await user.click(expandBtn);

    expect(screen.getByText(/Broken heading reference/)).toBeInTheDocument();
  });

  it('shows references for each error', () => {
    render(<LintPanel errors={mockErrors} />);
    expect(screen.getByText('[@sec:missing]')).toBeInTheDocument();
    expect(screen.getByText('[@fig:1]')).toBeInTheDocument();
  });
});
