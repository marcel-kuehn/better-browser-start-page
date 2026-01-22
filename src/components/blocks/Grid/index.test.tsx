import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Grid from './index';
import { AppConfigContext } from '@/contexts/AppConfig/context';
import { AppConfig, Widget } from '@/types';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_CONFIG_VERSION } from '@/contexts/AppConfig/constants';
import { Grid as GridType } from './types';

// Mock the WidgetSelectionDialog to control its behavior
vi.mock('@/components/shared/WidgetSelectionDialog', () => ({
  default: ({
    isOpen,
    onOpenChange,
    handleSelectWidget,
  }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    handleSelectWidget: (type: string, span: { rowSpan: number; columnSpan: number }) => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="widget-selection-dialog" role="dialog">
        <button
          data-testid="select-1x1-widget"
          onClick={() => handleSelectWidget('clock-widget', { rowSpan: 1, columnSpan: 1 })}
        >
          Add 1x1 Widget
        </button>
        <button
          data-testid="select-2x2-widget"
          onClick={() => handleSelectWidget('search-widget', { rowSpan: 2, columnSpan: 2 })}
        >
          Add 2x2 Widget
        </button>
        <button
          data-testid="select-3x3-widget"
          onClick={() => handleSelectWidget('search-widget', { rowSpan: 3, columnSpan: 3 })}
        >
          Add 3x3 Widget
        </button>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    );
  },
}));

// Mock BlockRenderer
vi.mock('@/components/shared/BlockRenderer', () => ({
  default: ({ blocks }: { blocks: Widget[] }) => (
    <div data-testid="block-renderer">
      {blocks.map(block => (
        <div key={block.id} data-testid={`widget-${block.id}`}>
          Widget {block.id}
        </div>
      ))}
    </div>
  ),
}));

const createMockContextValue = (isInEditMode = true) => {
  const mockConfig: AppConfig = {
    _v: DEFAULT_CONFIG_VERSION,
    settings: { theme: DEFAULT_THEME },
    elements: [],
  };

  return {
    config: mockConfig,
    isInEditMode,
    updateConfig: vi.fn(),
    updateTheme: vi.fn(),
    updateEditMode: vi.fn(),
    updateElementById: vi.fn(),
    removeElementById: vi.fn(),
    getTheme: () => DEFAULT_THEME,
  };
};

const renderWithContext = (ui: React.ReactElement, contextValue = createMockContextValue()) => {
  return render(<AppConfigContext.Provider value={contextValue}>{ui}</AppConfigContext.Provider>);
};

describe('Grid component - Widget Placement Validation', () => {
  const defaultGridProps: GridType = {
    id: 'grid-1',
    type: 'grid',
    span: { rowSpan: 4, columnSpan: 4 },
    elements: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  describe('AddWidgetButton rendering', () => {
    it('should render add widget buttons for all empty cells in edit mode', () => {
      const contextValue = createMockContextValue(true);
      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      // 4x4 grid with no widgets = 16 empty cells = 16 add buttons
      const addButtons = screen.getAllByRole('button', { name: /add widget at row/i });
      expect(addButtons).toHaveLength(16);
    });

    it('should not render add widget button for occupied cells', () => {
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'widget-1',
          type: 'clock-widget',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // 4x4 grid with 1 widget occupying 1 cell = 15 add buttons
      const addButtons = screen.getAllByRole('button', { name: /add widget at row/i });
      expect(addButtons).toHaveLength(15);

      // Specifically, position (1,1) should not have an add button
      expect(
        screen.queryByRole('button', { name: 'Add widget at row 1, column 1' })
      ).not.toBeInTheDocument();
    });

    it('should not render add widget buttons for cells occupied by multi-cell widget', () => {
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'widget-1',
          type: 'search-widget',
          gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 }, // 2x2 widget
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // 4x4 grid with 2x2 widget = 16 - 4 = 12 add buttons
      const addButtons = screen.getAllByRole('button', { name: /add widget at row/i });
      expect(addButtons).toHaveLength(12);

      // Positions (1,1), (1,2), (2,1), (2,2) should not have add buttons
      expect(
        screen.queryByRole('button', { name: 'Add widget at row 1, column 1' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Add widget at row 1, column 2' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Add widget at row 2, column 1' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Add widget at row 2, column 2' })
      ).not.toBeInTheDocument();
    });

    it('should not render add widget buttons when not in edit mode', () => {
      const contextValue = createMockContextValue(false);
      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      const addButtons = screen.queryAllByRole('button', { name: /add widget at row/i });
      expect(addButtons).toHaveLength(0);
    });
  });

  describe('Widget placement - out of bounds', () => {
    it('should show alert when trying to add 2x2 widget at bottom-right corner of 4x4 grid', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      // Click add button at position (4,4) - bottom-right corner
      const addButton = screen.getByRole('button', { name: 'Add widget at row 4, column 4' });
      await user.click(addButton);

      // Dialog should open
      expect(screen.getByTestId('widget-selection-dialog')).toBeInTheDocument();

      // Try to add 2x2 widget (would extend to row 6, column 6 - out of bounds)
      const selectButton = screen.getByTestId('select-2x2-widget');
      await user.click(selectButton);

      // Should show alert
      expect(window.alert).toHaveBeenCalled();

      // Widget should not be added
      expect(contextValue.updateElementById).not.toHaveBeenCalled();
    });

    it('should show alert when trying to add 3x3 widget at position (3,3) on 4x4 grid', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      // Click add button at position (3,3)
      const addButton = screen.getByRole('button', { name: 'Add widget at row 3, column 3' });
      await user.click(addButton);

      // Try to add 3x3 widget (would extend to row 6, column 6 - out of bounds)
      const selectButton = screen.getByTestId('select-3x3-widget');
      await user.click(selectButton);

      expect(window.alert).toHaveBeenCalled();
      expect(contextValue.updateElementById).not.toHaveBeenCalled();
    });

    it('should allow 1x1 widget at any position on 4x4 grid', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      // Click add button at position (4,4)
      const addButton = screen.getByRole('button', { name: 'Add widget at row 4, column 4' });
      await user.click(addButton);

      // Add 1x1 widget
      const selectButton = screen.getByTestId('select-1x1-widget');
      await user.click(selectButton);

      // Should succeed
      expect(window.alert).not.toHaveBeenCalled();
      expect(contextValue.updateElementById).toHaveBeenCalled();
    });
  });

  describe('Widget placement - collision detection', () => {
    it('should show alert when trying to add widget that collides with existing widget', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'existing-widget',
          type: 'clock-widget',
          gridArea: { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 },
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // Click add button at position (1,1)
      const addButton = screen.getByRole('button', { name: 'Add widget at row 1, column 1' });
      await user.click(addButton);

      // Try to add 2x2 widget (would collide with existing widget at (2,2))
      const selectButton = screen.getByTestId('select-2x2-widget');
      await user.click(selectButton);

      expect(window.alert).toHaveBeenCalled();
      expect(contextValue.updateElementById).not.toHaveBeenCalled();
    });

    it('should allow widget placement when no collision occurs', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'existing-widget',
          type: 'clock-widget',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // Click add button at position (3,3) - far from existing widget
      const addButton = screen.getByRole('button', { name: 'Add widget at row 3, column 3' });
      await user.click(addButton);

      // Add 1x1 widget - should succeed
      const selectButton = screen.getByTestId('select-1x1-widget');
      await user.click(selectButton);

      expect(window.alert).not.toHaveBeenCalled();
      expect(contextValue.updateElementById).toHaveBeenCalled();
    });

    it('should allow widget adjacent to but not overlapping existing widget', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'existing-widget',
          type: 'clock-widget',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // Click add button at position (1,2) - immediately to the right
      const addButton = screen.getByRole('button', { name: 'Add widget at row 1, column 2' });
      await user.click(addButton);

      // Add 1x1 widget - should succeed (adjacent but not overlapping)
      const selectButton = screen.getByTestId('select-1x1-widget');
      await user.click(selectButton);

      expect(window.alert).not.toHaveBeenCalled();
      expect(contextValue.updateElementById).toHaveBeenCalled();
    });
  });

  describe('Widget placement - combined scenarios', () => {
    it('should reject widget that is both out of bounds and colliding', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'existing-widget',
          type: 'search-widget',
          gridArea: { rowStart: 3, rowEnd: 5, columnStart: 3, columnEnd: 5 },
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // Click add button at position (2,2)
      const addButton = screen.getByRole('button', { name: 'Add widget at row 2, column 2' });
      await user.click(addButton);

      // Try to add 3x3 widget - would both collide AND go out of bounds
      const selectButton = screen.getByTestId('select-3x3-widget');
      await user.click(selectButton);

      expect(window.alert).toHaveBeenCalled();
      expect(contextValue.updateElementById).not.toHaveBeenCalled();
    });

    it('should successfully add widget when space is available', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);

      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      // Click add button at position (1,1)
      const addButton = screen.getByRole('button', { name: 'Add widget at row 1, column 1' });
      await user.click(addButton);

      // Add 2x2 widget - should fit in 4x4 grid
      const selectButton = screen.getByTestId('select-2x2-widget');
      await user.click(selectButton);

      expect(window.alert).not.toHaveBeenCalled();
      expect(contextValue.updateElementById).toHaveBeenCalledWith('grid-1', {
        elements: expect.arrayContaining([
          expect.objectContaining({
            type: 'search-widget',
            gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
          }),
        ]),
      });
    });

    it('should allow 2x2 widget at position (3,3) on 4x4 grid (exactly fits)', async () => {
      const user = userEvent.setup();
      const contextValue = createMockContextValue(true);

      renderWithContext(<Grid {...defaultGridProps} />, contextValue);

      // Click add button at position (3,3)
      const addButton = screen.getByRole('button', { name: 'Add widget at row 3, column 3' });
      await user.click(addButton);

      // Add 2x2 widget - should fit at position (3,3) extending to (5,5) on a 4x4 grid
      const selectButton = screen.getByTestId('select-2x2-widget');
      await user.click(selectButton);

      expect(window.alert).not.toHaveBeenCalled();
      expect(contextValue.updateElementById).toHaveBeenCalled();
    });
  });

  describe('Grid with multiple existing widgets', () => {
    it('should correctly handle grid with multiple widgets', async () => {
      const contextValue = createMockContextValue(true);
      const elements: Widget[] = [
        {
          id: 'widget-1',
          type: 'clock-widget',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
        {
          id: 'widget-2',
          type: 'clock-widget',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 3, columnEnd: 4 },
        },
        {
          id: 'widget-3',
          type: 'clock-widget',
          gridArea: { rowStart: 3, rowEnd: 4, columnStart: 1, columnEnd: 2 },
        },
      ];

      renderWithContext(<Grid {...defaultGridProps} elements={elements} />, contextValue);

      // Should have 16 - 3 = 13 add buttons
      const addButtons = screen.getAllByRole('button', { name: /add widget at row/i });
      expect(addButtons).toHaveLength(13);

      // Position (2,2) should have an add button (not occupied)
      expect(
        screen.getByRole('button', { name: 'Add widget at row 2, column 2' })
      ).toBeInTheDocument();
    });
  });
});
