import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppConfigProvider } from './provider';
import { useAppConfig } from './useAppConfig';
import { LOCAL_STORAGE_KEY } from './constants';
import { DEFAULT_THEME } from '@/constants/themes';
import { WIDGET_TYPE_SEARCH } from '@/constants/widgetTypes';
import { AppConfig } from '@/types';

// Test component that uses the context
const TestComponent = () => {
  const {
    config,
    isInEditMode,
    updateConfig,
    updateTheme,
    updateEditMode,
    updateElementById,
    removeElementById,
    getTheme,
    updateCustomBackground,
    getCustomBackground,
  } = useAppConfig();

  return (
    <div>
      <div data-testid="config-version">{config._v}</div>
      <div data-testid="edit-mode">{isInEditMode ? 'true' : 'false'}</div>
      <div data-testid="theme">{getTheme()}</div>
      <div data-testid="custom-background">{getCustomBackground() ?? 'none'}</div>
      <div data-testid="elements-count">{config.elements.length}</div>
      <button data-testid="update-config" onClick={() => updateConfig({ ...config, _v: '0.0.3' })}>
        Update Config
      </button>
      <button data-testid="update-theme" onClick={() => updateTheme('glassmorphism-dark')}>
        Update Theme
      </button>
      <button data-testid="toggle-edit" onClick={() => updateEditMode(!isInEditMode)}>
        Toggle Edit
      </button>
      <button
        data-testid="update-background"
        onClick={() => updateCustomBackground('data:image/jpeg;base64,test')}
      >
        Update Background
      </button>
      <button data-testid="clear-background" onClick={() => updateCustomBackground(null)}>
        Clear Background
      </button>
      {config.elements.length > 0 && config.elements[0].id && (
        <button
          data-testid="update-element"
          onClick={() => updateElementById(config.elements[0].id, { type: 'updated' })}
        >
          Update Element
        </button>
      )}
      {config.elements.length > 0 && config.elements[0].id && (
        <button
          data-testid="remove-element"
          onClick={() => removeElementById(config.elements[0].id)}
        >
          Remove Element
        </button>
      )}
    </div>
  );
};

describe('AppConfigProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial config from INITIAL_CONFIG when localStorage is empty', () => {
    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('config-version')).toHaveTextContent('0.0.3');
    expect(screen.getByTestId('theme')).toHaveTextContent(DEFAULT_THEME);
  });

  it('should load config from localStorage on mount', () => {
    const savedConfig: AppConfig = {
      _v: '0.0.3',
      settings: { theme: 'glassmorphism-dark' },
      elements: [{ id: '1', type: 'test' }],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('config-version')).toHaveTextContent('0.0.3');
    expect(screen.getByTestId('theme')).toHaveTextContent('glassmorphism-dark');
    expect(screen.getByTestId('elements-count')).toHaveTextContent('1');
  });

  it('should persist config changes to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    const updateButton = screen.getByTestId('update-config');
    await user.click(updateButton);

    await waitFor(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed._v).toBe('0.0.3');
    });
  });

  it('should update theme and persist to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    const themeButton = screen.getByTestId('update-theme');
    await user.click(themeButton);

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('glassmorphism-dark');
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.settings.theme).toBe('glassmorphism-dark');
    });
  });

  it('should toggle edit mode', async () => {
    const user = userEvent.setup();
    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('edit-mode')).toHaveTextContent('false');

    const toggleButton = screen.getByTestId('toggle-edit');
    await user.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('edit-mode')).toHaveTextContent('true');
    });
  });

  it('should update element by id', async () => {
    const user = userEvent.setup();
    const savedConfig: AppConfig = {
      _v: '0.0.3',
      settings: { theme: DEFAULT_THEME },
      elements: [{ id: 'test-id', type: WIDGET_TYPE_SEARCH }],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    const updateButton = screen.getByTestId('update-element');
    await user.click(updateButton);

    await waitFor(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.elements[0].type).toBe('updated');
    });
  });

  it('should remove element by id', async () => {
    const user = userEvent.setup();
    const savedConfig: AppConfig = {
      _v: '0.0.3',
      settings: { theme: DEFAULT_THEME },
      elements: [{ id: 'test-id', type: WIDGET_TYPE_SEARCH }],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('elements-count')).toHaveTextContent('1');

    const removeButton = screen.getByTestId('remove-element');
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByTestId('elements-count')).toHaveTextContent('0');
    });
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(LOCAL_STORAGE_KEY, 'invalid json');

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    // Should fallback to INITIAL_CONFIG
    expect(screen.getByTestId('config-version')).toHaveTextContent('0.0.3');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should migrate old config versions on load', () => {
    const oldConfig = {
      widgets: [
        {
          id: '1',
          type: 'search',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(oldConfig));

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    // Should be migrated to latest version
    expect(screen.getByTestId('config-version')).toHaveTextContent('0.0.3');
  });

  it('should update custom background and persist to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('custom-background')).toHaveTextContent('none');

    const updateButton = screen.getByTestId('update-background');
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId('custom-background')).toHaveTextContent(
        'data:image/jpeg;base64,test'
      );
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.settings.customBackgroundImage).toBe('data:image/jpeg;base64,test');
    });
  });

  it('should clear custom background and persist to localStorage', async () => {
    const user = userEvent.setup();
    const savedConfig: AppConfig = {
      _v: '0.0.3',
      settings: { theme: DEFAULT_THEME, customBackgroundImage: 'data:image/jpeg;base64,existing' },
      elements: [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('custom-background')).toHaveTextContent(
      'data:image/jpeg;base64,existing'
    );

    const clearButton = screen.getByTestId('clear-background');
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByTestId('custom-background')).toHaveTextContent('none');
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.settings.customBackgroundImage).toBeNull();
    });
  });

  it('should load custom background from localStorage on mount', () => {
    const savedConfig: AppConfig = {
      _v: '0.0.3',
      settings: { theme: DEFAULT_THEME, customBackgroundImage: 'data:image/png;base64,loaded' },
      elements: [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    render(
      <AppConfigProvider>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByTestId('custom-background')).toHaveTextContent(
      'data:image/png;base64,loaded'
    );
  });

  it('should update nested elements recursively', async () => {
    const user = userEvent.setup();
    const savedConfig: AppConfig = {
      _v: '0.0.3',
      settings: { theme: DEFAULT_THEME },
      elements: [
        {
          id: 'parent',
          type: 'grid',
          elements: [{ id: 'child', type: WIDGET_TYPE_SEARCH }],
        },
      ],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    const TestNestedComponent = () => {
      const { config, updateElementById } = useAppConfig();
      const parent = config.elements[0] as { elements?: { id: string; type: string }[] };
      const childId = parent.elements?.[0]?.id;

      return (
        <div>
          <div data-testid="child-type">{parent.elements?.[0]?.type}</div>
          {childId && (
            <button
              data-testid="update-child"
              onClick={() => updateElementById(childId, { type: 'updated-child' })}
            >
              Update Child
            </button>
          )}
        </div>
      );
    };

    render(
      <AppConfigProvider>
        <TestNestedComponent />
      </AppConfigProvider>
    );

    const updateButton = screen.getByTestId('update-child');
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId('child-type')).toHaveTextContent('updated-child');
    });
  });
});
