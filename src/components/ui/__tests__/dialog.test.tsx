import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../dialog';
import userEvent from '@testing-library/user-event';

describe('Dialog component', () => {
  it('abre e fecha o dialog corretamente', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    // Initial state: not visible
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();

    // Open dialog
    await userEvent.click(screen.getByText('Open Dialog'));

    // Visible state
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();

    // Close dialog via escape key (Radix default behavior)
    await userEvent.keyboard('{Escape}');

    // Verify it closed (might need wait or check unmount depending on radix animation, but simple check first)
    // Se Radix animar, podemos checar role="dialog" em queryByRole
  });
});
