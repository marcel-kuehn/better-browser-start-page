import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from './index';
import { renderWithProviders } from '@/test/utils';

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render the tabs list', () => {
    renderWithProviders(<Settings />);

    expect(screen.getByTestId('settings-tabs')).toBeInTheDocument();
  });

  it('should render both tab triggers', () => {
    renderWithProviders(<Settings />);

    expect(screen.getByTestId('settings-tab-appearance')).toBeInTheDocument();
    expect(screen.getByTestId('settings-tab-data')).toBeInTheDocument();
  });

  it('should have Appearance tab as default active tab', () => {
    renderWithProviders(<Settings />);

    const appearanceTab = screen.getByTestId('settings-tab-appearance');
    expect(appearanceTab).toHaveAttribute('data-state', 'active');
  });

  it('should show Appearance tab content by default', () => {
    renderWithProviders(<Settings />);

    // ThemeSettings should be visible (renders a Theme label)
    expect(screen.getByText('Theme')).toBeInTheDocument();
    // LanguageSettings should be visible
    expect(screen.getByText('Language')).toBeInTheDocument();
    // BackgroundSettings should be visible
    expect(screen.getByText(/custom background/i)).toBeInTheDocument();
  });

  it('should not show Data tab content when Appearance tab is active', () => {
    renderWithProviders(<Settings />);

    // ConfigImport and ConfigExport labels should not be visible
    expect(screen.queryByText(/import configuration/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/export configuration/i)).not.toBeInTheDocument();
  });

  it('should switch to Data tab when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);

    const dataTab = screen.getByTestId('settings-tab-data');
    await user.click(dataTab);

    expect(dataTab).toHaveAttribute('data-state', 'active');
  });

  it('should show Data tab content when Data tab is active', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);

    const dataTab = screen.getByTestId('settings-tab-data');
    await user.click(dataTab);

    // ConfigImport and ConfigExport labels should be visible
    expect(screen.getByText(/import configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/export configuration/i)).toBeInTheDocument();
  });

  it('should hide Appearance tab content when Data tab is active', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);

    const dataTab = screen.getByTestId('settings-tab-data');
    await user.click(dataTab);

    // ThemeSettings and LanguageSettings labels should not be visible
    expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    expect(screen.queryByText('Language')).not.toBeInTheDocument();
  });

  it('should switch back to Appearance tab when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);

    // First click Data tab
    const dataTab = screen.getByTestId('settings-tab-data');
    await user.click(dataTab);

    // Then click Appearance tab
    const appearanceTab = screen.getByTestId('settings-tab-appearance');
    await user.click(appearanceTab);

    expect(appearanceTab).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('should have correct tab labels', () => {
    renderWithProviders(<Settings />);

    expect(screen.getByTestId('settings-tab-appearance')).toHaveTextContent('Appearance');
    expect(screen.getByTestId('settings-tab-data')).toHaveTextContent('Data');
  });
});
