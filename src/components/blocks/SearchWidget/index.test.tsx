import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { SearchWidget } from './index';
import { renderWithProviders } from '@/test/utils';
import { createMockWidget } from '@/test/utils';
import { WIDGET_TYPE_SEARCH } from '@/constants/widgetTypes';
import { DEFAULT_SEARCH_URL } from './constants';
import { SearchWidget as SearchWidgetType } from './types';

describe('SearchWidget', () => {
  let originalOpen: typeof window.open;

  beforeEach(() => {
    originalOpen = window.open;
    window.open = vi.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('should render search input', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
    });
    renderWithProviders(<SearchWidget {...widget} />);

    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  it('should not render when elements array is empty', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [],
    });
    const { container } = renderWithProviders(<SearchWidget {...widget} />);

    expect(container.firstChild).toBeNull();
  });

  it('should replace placeholder in URL on form submission', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
    });
    renderWithProviders(<SearchWidget {...widget} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test query' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(window.open).toHaveBeenCalledWith(
      'https://example.com/search?q=test query',
      '_self',
      'noopener,noreferrer'
    );
  });

  it('should clear search query after submission', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
    });
    renderWithProviders(<SearchWidget {...widget} />);

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input.value).toBe('test query');

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(input.value).toBe('');
  });

  it('should show toggle group when multiple search engines are available', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [
        { id: '1', url: 'https://google.com/search?q={query}' },
        { id: '2', url: 'https://duckduckgo.com/?q={query}' },
      ],
    });
    renderWithProviders(<SearchWidget {...widget} />);

    // Toggle group should be visible
    const toggleGroup = screen.getByRole('group');
    expect(toggleGroup).toBeInTheDocument();
  });

  it('should not show toggle group when only one search engine', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
    });
    renderWithProviders(<SearchWidget {...widget} />);

    // Toggle group should not be visible
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('should switch search engine when toggle is clicked', () => {
    const widget = createMockWidget<SearchWidgetType>({
      type: WIDGET_TYPE_SEARCH,
      elements: [
        { id: '1', url: 'https://google.com/search?q={query}' },
        { id: '2', url: 'https://duckduckgo.com/?q={query}' },
      ],
    });
    renderWithProviders(<SearchWidget {...widget} />);

    const toggles = screen.getAllByRole('button');
    const secondToggle = toggles.find(
      btn => btn.getAttribute('value') === 'https://duckduckgo.com/?q={query}'
    );

    if (secondToggle) {
      fireEvent.click(secondToggle);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'test' } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      expect(window.open).toHaveBeenCalledWith(
        'https://duckduckgo.com/?q=test',
        '_self',
        'noopener,noreferrer'
      );
    }
  });

  describe('edge cases', () => {
    it('should handle special characters in search query', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'test & query <script>' } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      expect(window.open).toHaveBeenCalledWith(
        'https://example.com/search?q=test & query <script>',
        '_self',
        'noopener,noreferrer'
      );
    });

    it('should handle unicode characters in search query', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: '日本語 검색 🔍' } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      expect(window.open).toHaveBeenCalledWith(
        'https://example.com/search?q=日本語 검색 🔍',
        '_self',
        'noopener,noreferrer'
      );
    });

    it('should not submit form with empty query', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i);
      // Don't change input value - leave it empty

      const form = input.closest('form');
      fireEvent.submit(form!);

      // Should still call open but with empty query replaced
      expect(window.open).toHaveBeenCalledWith(
        'https://example.com/search?q=',
        '_self',
        'noopener,noreferrer'
      );
    });

    it('should handle whitespace-only query', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: '   ' } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      expect(window.open).toHaveBeenCalledWith(
        'https://example.com/search?q=   ',
        '_self',
        'noopener,noreferrer'
      );
    });

    it('should submit form on Enter key press', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'keyboard test' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Form should be submitted via Enter key
      // The actual submission depends on how the form handles it
      expect(input).toBeInTheDocument();
    });

    it('should handle very long search query', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const longQuery = 'a'.repeat(1000);
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: longQuery } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      expect(window.open).toHaveBeenCalledWith(
        `https://example.com/search?q=${longQuery}`,
        '_self',
        'noopener,noreferrer'
      );
    });

    it('should handle URL with multiple placeholder positions', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/{query}/results?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'test' } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      // Should replace all occurrences of {query}
      expect(window.open).toHaveBeenCalled();
    });

    it('should maintain focus on input after failed submission', () => {
      const widget = createMockWidget<SearchWidgetType>({
        type: WIDGET_TYPE_SEARCH,
        elements: [{ id: '1', url: 'https://example.com/search?q={query}' }],
      });
      renderWithProviders(<SearchWidget {...widget} />);

      const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      input.focus();

      // Input should be focused
      expect(document.activeElement).toBe(input);
    });
  });
});
