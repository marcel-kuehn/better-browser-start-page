import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LanguageSettings from './index';
import { AppConfigProvider } from '@/contexts/AppConfig/provider';
import { LOCAL_STORAGE_KEY } from '@/contexts/AppConfig/constants';
import { DEFAULT_THEME } from '@/constants/themes';
import { LANGUAGE_GERMAN } from '@/constants/languages';
import { AppConfig } from '@/types';

describe('LanguageSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderLanguageSettings = () => {
    return render(
      <AppConfigProvider>
        <LanguageSettings />
      </AppConfigProvider>
    );
  };

  it('should render the language selector', () => {
    renderLanguageSettings();

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByTestId('language-select')).toBeInTheDocument();
  });

  it('should show the current language as selected', () => {
    const savedConfig: AppConfig = {
      _v: '0.0.4',
      settings: { theme: DEFAULT_THEME, language: LANGUAGE_GERMAN },
      elements: [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfig));

    renderLanguageSettings();

    const selectTrigger = screen.getByTestId('language-select');
    // When German is selected, the UI shows "Deutsch" (German translation)
    expect(selectTrigger).toHaveTextContent('Deutsch');
  });

  it('should show default language when none is set', () => {
    renderLanguageSettings();

    const selectTrigger = screen.getByTestId('language-select');
    expect(selectTrigger).toHaveTextContent('English');
  });

  it('should have combobox role for accessibility', () => {
    renderLanguageSettings();

    const selectTrigger = screen.getByTestId('language-select');
    expect(selectTrigger).toHaveAttribute('role', 'combobox');
  });

  it('should be labeled for language selection', () => {
    renderLanguageSettings();

    const label = screen.getByText('Language');
    expect(label).toHaveAttribute('for', 'language');
  });
});
