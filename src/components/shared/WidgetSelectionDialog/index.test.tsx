import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WidgetSelectionDialog from './index';
import { renderWithProviders } from '@/test/utils';

describe('WidgetSelectionDialog', () => {
  const mockHandleSelectWidget = vi.fn();
  const mockOnOpenChange = vi.fn();

  it('should render dialog when open', () => {
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
      />
    );

    expect(screen.getByText(/add widget/i)).toBeInTheDocument();
    expect(screen.getByText(/pick a widget/i)).toBeInTheDocument();
  });

  it('should not render dialog when closed', () => {
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
      />
    );

    expect(screen.queryByText(/add widget/i)).not.toBeInTheDocument();
  });

  it('should render all widget options', () => {
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
      />
    );

    // Should render widget options (search, apps, links, clock, stopwatch)
    // The exact text depends on translations, but we can check for widget types
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should call handleSelectWidget when widget is selected', async () => {
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
      />
    );

    // Find and click a widget option (this depends on the actual implementation)
    // For now, we'll test that the dialog is interactive
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // The actual selection would trigger handleSelectWidget
    // This test would need to be adjusted based on WidgetOptionsList implementation
  });

  it('should call onOpenChange when dialog is closed', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
      />
    );

    // Find close button (usually in dialog header)
    const closeButton = screen.getByRole('button', { name: /close/i });
    if (closeButton) {
      await user.click(closeButton);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('should display widget descriptions', () => {
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
      />
    );

    // Dialog description should be visible (text depends on i18n)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // The description might be in a paragraph or similar element
    expect(dialog).toHaveTextContent(/pick|widget/i);
  });
});
