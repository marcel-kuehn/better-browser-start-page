import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackgroundSettings from './index';
import { renderWithProviders } from '@/test/utils';
import * as helpers from './helpers';
import { LOCAL_STORAGE_KEY } from '@/contexts/AppConfig/constants';

// Mock the helpers
vi.mock('./helpers', () => ({
  convertFileToBase64: vi.fn(),
  isValidImageFile: vi.fn(),
  isFileSizeValid: vi.fn(),
}));

describe('BackgroundSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(helpers.isValidImageFile).mockReturnValue(true);
    vi.mocked(helpers.isFileSizeValid).mockReturnValue(true);
    window.alert = vi.fn();
  });

  it('should render file input and label', () => {
    renderWithProviders(<BackgroundSettings />);

    expect(screen.getByLabelText(/custom background/i)).toBeInTheDocument();
  });

  it('should not show preview or clear button when no custom background is set', () => {
    renderWithProviders(<BackgroundSettings />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear background/i })).not.toBeInTheDocument();
  });

  it('should upload image and update config on valid file selection', async () => {
    const user = userEvent.setup();
    const mockBase64 = 'data:image/jpeg;base64,/9j/4AAQ';
    vi.mocked(helpers.convertFileToBase64).mockResolvedValue(mockBase64);

    renderWithProviders(<BackgroundSettings />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.settings.customBackgroundImage).toBe(mockBase64);
    });
  });

  it('should show alert for invalid image type', async () => {
    const user = userEvent.setup();
    // Reset the mock to return false for this specific test
    vi.mocked(helpers.isValidImageFile).mockReset().mockReturnValue(false);
    vi.mocked(helpers.isFileSizeValid).mockReturnValue(true);

    renderWithProviders(<BackgroundSettings />);

    // Use image/jpeg mime type to pass the accept filter, but mock returns false for validation
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(helpers.isValidImageFile).toHaveBeenCalledWith(file);
      expect(window.alert).toHaveBeenCalled();
    });
  });

  it('should show alert for file that is too large', async () => {
    const user = userEvent.setup();
    vi.mocked(helpers.isFileSizeValid).mockReturnValue(false);

    renderWithProviders(<BackgroundSettings />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });

  it('should show preview when custom background is set', async () => {
    const user = userEvent.setup();
    const mockBase64 = 'data:image/jpeg;base64,/9j/4AAQ';
    vi.mocked(helpers.convertFileToBase64).mockResolvedValue(mockBase64);

    renderWithProviders(<BackgroundSettings />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockBase64);
    });
  });

  it('should show clear button when custom background is set', async () => {
    const user = userEvent.setup();
    const mockBase64 = 'data:image/jpeg;base64,/9j/4AAQ';
    vi.mocked(helpers.convertFileToBase64).mockResolvedValue(mockBase64);

    renderWithProviders(<BackgroundSettings />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear background/i })).toBeInTheDocument();
    });
  });

  it('should clear custom background when clear button is clicked', async () => {
    const user = userEvent.setup();
    const mockBase64 = 'data:image/jpeg;base64,/9j/4AAQ';
    vi.mocked(helpers.convertFileToBase64).mockResolvedValue(mockBase64);

    renderWithProviders(<BackgroundSettings />);

    // First upload an image
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear background/i })).toBeInTheDocument();
    });

    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear background/i });
    await user.click(clearButton);

    await waitFor(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.settings.customBackgroundImage).toBeNull();
    });
  });

  it('should show alert when file conversion fails', async () => {
    const user = userEvent.setup();
    vi.mocked(helpers.convertFileToBase64).mockRejectedValue(new Error('Conversion failed'));

    renderWithProviders(<BackgroundSettings />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/custom background/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
