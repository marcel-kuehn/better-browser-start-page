import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigImportSettings from './index';
import { renderWithProviders } from '@/test/utils';
import { parseConfigFile } from './helpers';

// Mock the helpers
vi.mock('./helpers', () => ({
  parseConfigFile: vi.fn(),
}));

describe('ConfigImport', () => {
  let mockFileReader: {
    readAsText: () => void;
    result: string | null;
    error: Error | null;
    onload: ((event: { target?: { result: string } }) => void) | null;
    onerror: (() => void) | null;
  };

  beforeEach(() => {
    mockFileReader = {
      readAsText: vi.fn(),
      result: null,
      error: null,
      onload: null,
      onerror: null,
    };

    global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render file input and replace button', () => {
    renderWithProviders(<ConfigImportSettings />);

    expect(screen.getByLabelText(/import config/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /replace current config/i })).toBeInTheDocument();
  });

  it('should disable replace button when no file is uploaded', () => {
    renderWithProviders(<ConfigImportSettings />);

    const replaceButton = screen.getByRole('button', { name: /replace current config/i });
    expect(replaceButton).toBeDisabled();
  });

  it('should parse config file on file selection', async () => {
    const user = userEvent.setup();
    const mockConfig = { _v: '0.0.2', elements: [] };
    vi.mocked(parseConfigFile).mockResolvedValue(mockConfig);

    renderWithProviders(<ConfigImportSettings />);

    const file = new File([JSON.stringify(mockConfig)], 'config.json', {
      type: 'application/json',
    });
    const input = screen.getByLabelText(/import config/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(parseConfigFile).toHaveBeenCalledWith(file);
    });
  });

  it('should enable replace button after successful file parse', async () => {
    const user = userEvent.setup();
    const mockConfig = { _v: '0.0.2', elements: [] };
    vi.mocked(parseConfigFile).mockResolvedValue(mockConfig);

    renderWithProviders(<ConfigImportSettings />);

    const file = new File([JSON.stringify(mockConfig)], 'config.json', {
      type: 'application/json',
    });
    const input = screen.getByLabelText(/import config/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      const replaceButton = screen.getByRole('button', { name: /replace current config/i });
      expect(replaceButton).not.toBeDisabled();
    });
  });

  it('should show error alert for invalid JSON', async () => {
    const user = userEvent.setup();
    vi.mocked(parseConfigFile).mockRejectedValue(new Error('Invalid JSON'));

    renderWithProviders(<ConfigImportSettings />);

    const file = new File(['invalid json'], 'config.json', {
      type: 'application/json',
    });
    const input = screen.getByLabelText(/import config/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });

  it('should update config when replace button is clicked', async () => {
    const user = userEvent.setup();
    const mockConfig = { _v: '0.0.2', elements: [{ id: '1', type: 'test' }] };
    vi.mocked(parseConfigFile).mockResolvedValue(mockConfig);

    renderWithProviders(<ConfigImportSettings />);

    const file = new File([JSON.stringify(mockConfig)], 'config.json', {
      type: 'application/json',
    });
    const input = screen.getByLabelText(/import config/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      const replaceButton = screen.getByRole('button', { name: /replace current config/i });
      expect(replaceButton).not.toBeDisabled();
    });

    const replaceButton = screen.getByRole('button', { name: /replace current config/i });
    await user.click(replaceButton);

    // Config should be updated (tested via localStorage)
    await waitFor(() => {
      const saved = localStorage.getItem('app_config');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.elements).toHaveLength(1);
    });
  });
});
