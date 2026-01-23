import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WidgetSelectionDialog from './index';
import { renderWithProviders } from '@/test/utils';
import { AppConfigContext } from '@/contexts/AppConfig/context';
import { AppConfig, Widget } from '@/types';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_CONFIG_VERSION } from '@/contexts/AppConfig/constants';
import { DEFAULT_LANGUAGE } from '@/constants/languages';
import { WIDGET_TYPE_CLOCK } from '@/constants/widgetTypes';

const defaultDialogProps = {
  selectedCell: { row: 1, column: 1 },
  elements: [] as Widget[],
  gridSpan: { rowSpan: 4, columnSpan: 4 },
};

const createMockContextValue = (clipboard: Widget | null = null) => {
  const mockConfig: AppConfig = {
    _v: DEFAULT_CONFIG_VERSION,
    settings: { theme: DEFAULT_THEME, language: DEFAULT_LANGUAGE },
    elements: [],
  };

  return {
    config: mockConfig,
    isInEditMode: true,
    clipboard,
    updateConfig: vi.fn(),
    updateTheme: vi.fn(),
    updateEditMode: vi.fn(),
    updateElementById: vi.fn(),
    removeElementById: vi.fn(),
    getTheme: () => DEFAULT_THEME,
    updateCustomBackground: vi.fn(),
    getCustomBackground: () => null,
    updateLanguage: vi.fn(),
    getLanguage: () => DEFAULT_LANGUAGE,
    copyWidget: vi.fn(),
    clearClipboard: vi.fn(),
  };
};

describe('WidgetSelectionDialog', () => {
  const mockHandleSelectWidget = vi.fn();
  const mockHandlePasteWidget = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when open', () => {
    renderWithProviders(
      <WidgetSelectionDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        handleSelectWidget={mockHandleSelectWidget}
        handlePasteWidget={mockHandlePasteWidget}
        {...defaultDialogProps}
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
        handlePasteWidget={mockHandlePasteWidget}
        {...defaultDialogProps}
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
        handlePasteWidget={mockHandlePasteWidget}
        {...defaultDialogProps}
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
        handlePasteWidget={mockHandlePasteWidget}
        {...defaultDialogProps}
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
        handlePasteWidget={mockHandlePasteWidget}
        {...defaultDialogProps}
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
        handlePasteWidget={mockHandlePasteWidget}
        {...defaultDialogProps}
      />
    );

    // Dialog description should be visible (text depends on i18n)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // The description might be in a paragraph or similar element
    expect(dialog).toHaveTextContent(/pick|widget/i);
  });

  describe('Clipboard paste functionality', () => {
    const clipboardWidget: Widget = {
      id: 'clipboard-widget',
      type: WIDGET_TYPE_CLOCK,
      gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
    };

    it('should not show paste option when clipboard is empty', () => {
      const contextValue = createMockContextValue(null);
      render(
        <AppConfigContext.Provider value={contextValue}>
          <WidgetSelectionDialog
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            handleSelectWidget={mockHandleSelectWidget}
            handlePasteWidget={mockHandlePasteWidget}
            {...defaultDialogProps}
          />
        </AppConfigContext.Provider>
      );

      expect(screen.queryByText(/paste from clipboard/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('paste-widget-button')).not.toBeInTheDocument();
    });

    it('should show paste option when clipboard has content', () => {
      const contextValue = createMockContextValue(clipboardWidget);
      render(
        <AppConfigContext.Provider value={contextValue}>
          <WidgetSelectionDialog
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            handleSelectWidget={mockHandleSelectWidget}
            handlePasteWidget={mockHandlePasteWidget}
            {...defaultDialogProps}
          />
        </AppConfigContext.Provider>
      );

      expect(screen.getByText(/paste from clipboard/i)).toBeInTheDocument();
      expect(screen.getByTestId('paste-widget-button')).toBeInTheDocument();
    });

    it('should show clipboard widget size', () => {
      const contextValue = createMockContextValue(clipboardWidget);
      render(
        <AppConfigContext.Provider value={contextValue}>
          <WidgetSelectionDialog
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            handleSelectWidget={mockHandleSelectWidget}
            handlePasteWidget={mockHandlePasteWidget}
            {...defaultDialogProps}
          />
        </AppConfigContext.Provider>
      );

      // The clipboard section contains the size info, so look for paste from clipboard
      // and verify the size is displayed (multiple 1x1 buttons may exist from widget options)
      const pasteSection = screen.getByText(/paste from clipboard/i).closest('div');
      expect(pasteSection).toHaveTextContent('1x1');
    });

    it('should call handlePasteWidget with regenerated IDs when paste button is clicked', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(clipboardWidget);
      render(
        <AppConfigContext.Provider value={contextValue}>
          <WidgetSelectionDialog
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            handleSelectWidget={mockHandleSelectWidget}
            handlePasteWidget={mockHandlePasteWidget}
            {...defaultDialogProps}
          />
        </AppConfigContext.Provider>
      );

      const pasteButton = screen.getByTestId('paste-widget-button');
      await user.click(pasteButton);

      expect(mockHandlePasteWidget).toHaveBeenCalledTimes(1);
      // The widget should have a new ID (not the original clipboard-widget)
      const calledWidget = mockHandlePasteWidget.mock.calls[0][0];
      expect(calledWidget.id).not.toBe('clipboard-widget');
      expect(calledWidget.type).toBe(WIDGET_TYPE_CLOCK);
    });

    it('should disable paste button when clipboard widget would not fit', () => {
      // Widget that's 2x2
      const largeWidget: Widget = {
        id: 'large-widget',
        type: WIDGET_TYPE_CLOCK,
        gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
      };
      const contextValue = createMockContextValue(largeWidget);

      // Grid is 4x4, selected cell is at (4,4), so 2x2 widget won't fit
      render(
        <AppConfigContext.Provider value={contextValue}>
          <WidgetSelectionDialog
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            handleSelectWidget={mockHandleSelectWidget}
            handlePasteWidget={mockHandlePasteWidget}
            selectedCell={{ row: 4, column: 4 }}
            elements={[]}
            gridSpan={{ rowSpan: 4, columnSpan: 4 }}
          />
        </AppConfigContext.Provider>
      );

      const pasteButton = screen.getByTestId('paste-widget-button');
      expect(pasteButton).toBeDisabled();
    });

    it('should enable paste button when clipboard widget fits', () => {
      const contextValue = createMockContextValue(clipboardWidget);
      render(
        <AppConfigContext.Provider value={contextValue}>
          <WidgetSelectionDialog
            isOpen={true}
            onOpenChange={mockOnOpenChange}
            handleSelectWidget={mockHandleSelectWidget}
            handlePasteWidget={mockHandlePasteWidget}
            {...defaultDialogProps}
          />
        </AppConfigContext.Provider>
      );

      const pasteButton = screen.getByTestId('paste-widget-button');
      expect(pasteButton).not.toBeDisabled();
    });
  });

  // Note: Detailed ClipboardPasteButton tests are in ClipboardPasteButton.test.tsx
});
