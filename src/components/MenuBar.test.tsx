import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuBar } from './MenuBar';

describe('MenuBar', () => {
  it('opens a menu with ARIA roles and closes on Escape', () => {
    render(<MenuBar />);
    const file = screen.getByRole('menuitem', { name: 'File' });
    expect(file.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(file);
    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('marks toggle items as menuitemcheckbox', () => {
    render(<MenuBar />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.getByRole('menuitemcheckbox', { name: /Auto-Save/ })).toBeTruthy();
  });
});
