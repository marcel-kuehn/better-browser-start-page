import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ConfigExport from './index';
import { renderWithProviders, createMockConfig } from '@/test/utils';

// Mock CopyButton
vi.mock('../CopyButton', () => ({
  CopyButton: ({ textToCopy, children }: { textToCopy: string; children: React.ReactNode }) => (
    <button data-testid="copy-button" data-copy-text={textToCopy}>
      {children}
    </button>
  ),
}));

describe('ConfigExport', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render export label and copy button', () => {
    renderWithProviders(<ConfigExport />);

    expect(screen.getByText(/export config/i)).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
  });

  it('should export current config as JSON', () => {
    const mockConfig = createMockConfig({
      _v: '0.0.2',
      settings: { theme: 'glassmorphism' },
      elements: [{ id: '1', type: 'test' }],
    });

    // Set config in localStorage to simulate current state
    localStorage.setItem('app_config', JSON.stringify(mockConfig));

    renderWithProviders(<ConfigExport />);

    const copyButton = screen.getByTestId('copy-button');
    const exportedText = copyButton.getAttribute('data-copy-text');

    expect(exportedText).toBeTruthy();
    const parsed = JSON.parse(exportedText!);
    expect(parsed._v).toBe('0.0.2');
    expect(parsed.elements).toHaveLength(1);
  });

  it('should format exported config with indentation', () => {
    const mockConfig = createMockConfig();
    localStorage.setItem('app_config', JSON.stringify(mockConfig));

    renderWithProviders(<ConfigExport />);

    const copyButton = screen.getByTestId('copy-button');
    const exportedText = copyButton.getAttribute('data-copy-text');

    // Should be formatted with 2-space indentation
    expect(exportedText).toContain('\n');
    expect(exportedText).toContain('  '); // 2 spaces
  });
});
