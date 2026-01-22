import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi, beforeEach } from 'vitest';
import i18n from '@/i18n/config';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.open
global.window.open = vi.fn();

// Mock navigator.clipboard for copy functionality tests
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock ResizeObserver for layout components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia for responsive tests
global.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock crypto.randomUUID for consistent test results
beforeEach(() => {
  let uuidCounter = 0;
  vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
    uuidCounter += 1;
    return `test-uuid-${uuidCounter}`;
  });
});

// Initialize i18n for tests
beforeEach(() => {
  if (!i18n.isInitialized) {
    i18n.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {},
        },
      },
    });
  }
});
