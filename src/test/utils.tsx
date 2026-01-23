import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { AppConfigProvider } from '@/contexts/AppConfig/provider';
import { AppConfig, Block, Widget } from '@/types';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_LANGUAGE } from '@/constants/languages';
import { DEFAULT_CONFIG_VERSION } from '@/contexts/AppConfig/constants';

/**
 * Creates a mock AppConfig for testing
 */
export const createMockConfig = (overrides?: Partial<AppConfig>): AppConfig => {
  return {
    _v: DEFAULT_CONFIG_VERSION,
    settings: {
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE,
    },
    elements: [],
    ...overrides,
  };
};

/**
 * Creates a mock Widget for testing
 */
export const createMockWidget = <T extends Widget>(overrides?: Partial<Widget>): T => {
  return {
    id: 'mock-widget-id',
    type: 'search' as T['type'],
    gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
    ...overrides,
  } as T;
};

/**
 * Creates a mock Block for testing
 */
export const createMockBlock = (overrides?: Partial<Block>): Block => {
  return {
    id: 'mock-block-id',
    type: 'grid',
    ...overrides,
  };
};

/**
 * Mocks localStorage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

/**
 * Mocks FileReader API for testing
 */
export const mockFileReader = () => {
  const mockReader = {
    readAsText: vi.fn(),
    result: null as string | null,
    error: null as Error | null,
    onload: null as ((event: { target?: { result: string } }) => void) | null,
    onerror: null as (() => void) | null,
    readyState: 0,
    DONE: 2,
    EMPTY: 0,
    LOADING: 1,
    abort: vi.fn(),
    readAsDataURL: vi.fn(),
    readAsArrayBuffer: vi.fn(),
    readAsBinaryString: vi.fn(),
  };

  return mockReader;
};

/**
 * Renders a component with AppConfigProvider wrapper
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AppConfigProvider>{children}</AppConfigProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export const renderWithProviders = customRender;

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
