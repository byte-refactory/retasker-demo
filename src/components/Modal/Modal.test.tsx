import userEvent from '@testing-library/user-event';
import Modal from './Modal';
import { renderWithTheme } from '../../test/renderWithTheme';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';

describe('Modal', () => {
  it('renders children when open', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    renderWithTheme(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Should not be visible</div>
      </Modal>
    );
    expect(screen.queryByText('Should not be visible')).not.toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    // Overlay has role="presentation" and covers the modal
    const overlay = screen.getByRole('presentation');
    await user.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
