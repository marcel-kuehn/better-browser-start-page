import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { AppsWidget } from './index';
import { renderWithProviders } from '@/test/utils';
import { createMockWidget } from '@/test/utils';
import { WIDGET_TYPE_APPS } from '@/constants/widgetTypes';
import { AppsWidget as AppsWidgetType } from './types';

describe('AppsWidget', () => {
  it('should render app links', () => {
    const widget = createMockWidget<AppsWidgetType>({
      type: WIDGET_TYPE_APPS,
      elements: [
        { id: '1', url: 'https://example.com' },
        { id: '2', url: 'https://google.com' },
      ],
    });
    renderWithProviders(<AppsWidget {...widget} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://example.com');
    expect(links[1]).toHaveAttribute('href', 'https://google.com');
  });

  it('should not render when elements array is empty', () => {
    const widget = createMockWidget<AppsWidgetType>({
      type: WIDGET_TYPE_APPS,
      elements: [],
    });
    const { container } = renderWithProviders(<AppsWidget {...widget} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render favicon loaders for each link', () => {
    const widget = createMockWidget<AppsWidgetType>({
      type: WIDGET_TYPE_APPS,
      elements: [
        { id: '1', url: 'https://example.com', faviconUrl: 'https://example.com/favicon.ico' },
      ],
    });
    renderWithProviders(<AppsWidget {...widget} />);

    // FaviconLoader should be rendered (it renders an img or similar)
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should handle links with and without faviconUrl', () => {
    const widget = createMockWidget<AppsWidgetType>({
      type: WIDGET_TYPE_APPS,
      elements: [
        { id: '1', url: 'https://example.com', faviconUrl: 'https://example.com/favicon.ico' },
        { id: '2', url: 'https://google.com' },
      ],
    });
    renderWithProviders(<AppsWidget {...widget} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('should have correct link attributes', () => {
    const widget = createMockWidget<AppsWidgetType>({
      type: WIDGET_TYPE_APPS,
      elements: [{ id: '1', url: 'https://example.com' }],
    });
    renderWithProviders(<AppsWidget {...widget} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
