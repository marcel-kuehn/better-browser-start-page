import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Widget } from './index';
import { AppConfigContext } from '@/contexts/AppConfig/context';
import { AppConfig, Widget as WidgetType } from '@/types';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_CONFIG_VERSION } from '@/contexts/AppConfig/constants';
import { DEFAULT_LANGUAGE } from '@/constants/languages';

const createMockContextValue = (isInEditMode = false) => {
  const mockConfig: AppConfig = {
    _v: DEFAULT_CONFIG_VERSION,
    settings: { theme: DEFAULT_THEME, language: DEFAULT_LANGUAGE },
    elements: [],
  };

  return {
    config: mockConfig,
    isInEditMode,
    clipboard: null,
    updateConfig: vi.fn(),
    updateTheme: vi.fn(),
    updateEditMode: vi.fn(),
    updateElementById: vi.fn(),
    removeElementById: vi.fn(),
    getTheme: () => DEFAULT_THEME as any,
    updateCustomBackground: vi.fn(),
    getCustomBackground: () => null,
    updateLanguage: vi.fn(),
    getLanguage: () => DEFAULT_LANGUAGE as any,
    copyWidget: vi.fn(),
    clearClipboard: vi.fn(),
  };
};

const renderWithContext = (ui: React.ReactElement, contextValue = createMockContextValue()) => {
  return render(<AppConfigContext.Provider value={contextValue}>{ui}</AppConfigContext.Provider>);
};

const defaultWidgetProps: WidgetType = {
  id: 'test-widget-id',
  type: 'clock-widget',
  gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
};

describe('Widget component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should render children', () => {
    const contextValue = createMockContextValue(false);
    renderWithContext(
      <Widget {...defaultWidgetProps}>
        <span data-testid="child-content">Test Content</span>
      </Widget>,
      contextValue
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should apply grid area styles', () => {
    const contextValue = createMockContextValue(false);
    const { container } = renderWithContext(
      <Widget {...defaultWidgetProps}>Content</Widget>,
      contextValue
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.gridArea).toBe('1 / 1 / 2 / 2');
  });

  it('should not show action buttons when not in edit mode', () => {
    const contextValue = createMockContextValue(false);
    renderWithContext(<Widget {...defaultWidgetProps}>Content</Widget>, contextValue);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should show copy and remove buttons in edit mode', () => {
    const contextValue = createMockContextValue(true);
    renderWithContext(<Widget {...defaultWidgetProps}>Content</Widget>, contextValue);

    expect(screen.getByTestId('copy-widget-button')).toBeInTheDocument();
    expect(screen.getByTestId('remove-widget-button')).toBeInTheDocument();
  });

  it('should call removeElementById when remove button is clicked', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue(true);
    renderWithContext(<Widget {...defaultWidgetProps}>Content</Widget>, contextValue);

    // The remove button is the second button (after copy)
    const buttons = screen.getAllByRole('button');
    const removeButton = buttons[1];
    await user.click(removeButton);

    expect(contextValue.removeElementById).toHaveBeenCalledWith('test-widget-id');
  });

  it('should apply custom className', () => {
    const contextValue = createMockContextValue(false);
    const { container } = renderWithContext(
      <Widget {...defaultWidgetProps} className="custom-class">
        Content
      </Widget>,
      contextValue
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });
});
