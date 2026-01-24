import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyWidgetButton } from './CopyWidgetButton';
import { AppConfigContext } from '@/contexts/AppConfig/context';
import { AppConfig, Widget as WidgetType } from '@/types';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_CONFIG_VERSION } from '@/contexts/AppConfig/constants';
import { DEFAULT_LANGUAGE } from '@/constants/languages';

const createMockContextValue = () => {
  const mockConfig: AppConfig = {
    _v: DEFAULT_CONFIG_VERSION,
    settings: { theme: DEFAULT_THEME, language: DEFAULT_LANGUAGE },
    elements: [],
  };

  return {
    config: mockConfig,
    isInEditMode: true,
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

describe('CopyWidgetButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should call copyWidget when clicked', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue();

    renderWithContext(<CopyWidgetButton widget={defaultWidgetProps} />, contextValue);

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

  it('should show copied state on copy button temporarily after clicking', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue();

    renderWithContext(<CopyWidgetButton widget={defaultWidgetProps} />, contextValue);

    const copyButton = screen.getByTestId('copy-widget-button');

    // Initially, the button should be in default state
    expect(copyButton).toHaveAttribute('data-state', 'default');

    await user.click(copyButton);

    // After click, it should enter copied state
    expect(copyButton).toHaveAttribute('data-state', 'copied');

    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(copyButton).toHaveAttribute('data-state', 'default');
  });

  it('should pass all widget props to copyWidget including custom properties', async () => {
    const user = userEvent.setup();
    const contextValue = createMockContextValue();
    const widgetWithElements: WidgetType = {
      ...defaultWidgetProps,
      elements: [{ id: 'child-1', url: 'https://example.com' }],
    };

    renderWithContext(<CopyWidgetButton widget={widgetWithElements} />, contextValue);

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
    const contextValue = createMockContextValue();
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

    renderWithContext(<CopyWidgetButton widget={searchWidget} />, contextValue);

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
});
