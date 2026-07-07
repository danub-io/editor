import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';
import * as nextThemes from 'next-themes';
import React from 'react';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both Sun and Moon icons with appropriate CSS classes to hide/show', () => {
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
    });

    const { container } = render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();

    // Check for both SVG icons
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2);

    const sunSvg = svgs[0];
    const moonSvg = svgs[1];

    expect(sunSvg).toHaveClass('lucide-sun');
    expect(moonSvg).toHaveClass('lucide-moon');
  });

  it('toggles theme from light to dark', () => {
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('toggles theme from dark to light', () => {
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('toggles theme from system to light', () => {
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      themes: ['light', 'dark', 'system'],
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('toggles theme from undefined to light', () => {
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
      themes: ['light', 'dark', 'system'],
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });
});
