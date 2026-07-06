import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Breadcrumbs } from '../Breadcrumbs';

// Mock the next/navigation hook
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock the next/link component
vi.mock('next/link', () => {
  return {
    default: ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => {
      return <a href={href} className={className}>{children}</a>;
    }
  };
});

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the base breadcrumbs (Workspace and Project Title)', () => {
    mockUsePathname.mockReturnValue('/projects/test-project-id');

    render(<Breadcrumbs projectTitle="My Test Project" projectId="test-project-id" />);

    // Check Workspace link
    const workspaceLink = screen.getByRole('link', { name: /workspace/i });
    expect(workspaceLink).toBeInTheDocument();
    expect(workspaceLink).toHaveAttribute('href', '/dash');

    // Check Project link
    const projectLink = screen.getByRole('link', { name: /my test project/i });
    expect(projectLink).toBeInTheDocument();
    expect(projectLink).toHaveAttribute('href', '/projects/test-project-id');

    // Check that there is no 3rd level item
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(2);
  });

  it('renders the third level breadcrumb with a known label', () => {
    mockUsePathname.mockReturnValue('/projects/test-project-id/producao');

    render(<Breadcrumbs projectTitle="My Test Project" projectId="test-project-id" />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(3);

    // "producao" should be mapped to "Produção" based on LABELS constant
    expect(screen.getByText('Produção')).toBeInTheDocument();
  });

  it('renders the third level breadcrumb with the raw segment if unknown', () => {
    mockUsePathname.mockReturnValue('/projects/test-project-id/unknown-segment');

    render(<Breadcrumbs projectTitle="My Test Project" projectId="test-project-id" />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(3);

    // "unknown-segment" should be displayed as is
    expect(screen.getByText('unknown-segment')).toBeInTheDocument();
  });

  it('handles paths with trailing slashes gracefully', () => {
    mockUsePathname.mockReturnValue('/projects/test-project-id/mundo/');

    render(<Breadcrumbs projectTitle="My Test Project" projectId="test-project-id" />);

    const listItems = screen.getAllByRole('listitem');
    // should filter out empty string from trailing slash
    expect(listItems.length).toBe(3);

    // "mundo" should be mapped to "Mundo"
    expect(screen.getByText('Mundo')).toBeInTheDocument();
  });
});
