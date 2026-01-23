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
    getTheme: () => DEFAULT_THEME,
    updateCustomBackground: vi.fn(),
    getCustomBackground: () => null,
    updateLanguage: vi.fn(),
    getLanguage: () => DEFAULT_LANGUAGE,
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

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('should call copyWidget when copy button is clicked', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue(true);
    renderWithContext(<Widget {...defaultWidgetProps}>Content</Widget>, contextValue);

    const copyButton = screen.getByRole('button', { name: /copy widget/i });
    await user.click(copyButton);

    expect(contextValue.copyWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-widget-id',
        type: 'clock-widget',
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
      })
    );
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

  it('should pass all widget props to copyWidget including custom properties', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue(true);
    const widgetWithElements: WidgetType = {
      ...defaultWidgetProps,
      elements: [{ id: 'child-1', url: 'https://example.com' }],
    };

    renderWithContext(<Widget {...widgetWithElements}>Content</Widget>, contextValue);

    const copyButton = screen.getByRole('button', { name: /copy widget/i });
    await user.click(copyButton);

    expect(contextValue.copyWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-widget-id',
        type: 'clock-widget',
        elements: [{ id: 'child-1', url: 'https://example.com' }],
      })
    );
  });

  it('should pass all widget props including elements and type when copying search widget', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue(true);
    const searchWidget: WidgetType = {
      id: 'search-widget-id',
      type: 'search-widget',
      gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 3 },
      elements: [
        {
          id: 'search-1',
          url: 'https://google.com/search?q={query}',
          faviconUrl: 'https://google.com/favicon.ico',
        },
        {
          id: 'search-2',
          url: 'https://duckduckgo.com/?q={query}',
          faviconUrl: 'https://duckduckgo.com/favicon.ico',
        },
      ],
    };

    renderWithContext(<Widget {...searchWidget}>Search Content</Widget>, contextValue);

    const copyButton = screen.getByRole('button', { name: /copy widget/i });
    await user.click(copyButton);

    expect(contextValue.copyWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'search-widget-id',
        type: 'search-widget',
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 3 },
        elements: [
          {
            id: 'search-1',
            url: 'https://google.com/search?q={query}',
            faviconUrl: 'https://google.com/favicon.ico',
          },
          {
            id: 'search-2',
            url: 'https://duckduckgo.com/?q={query}',
            faviconUrl: 'https://duckduckgo.com/favicon.ico',
          },
        ],
      })
    );
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
