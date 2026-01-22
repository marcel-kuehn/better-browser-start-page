import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { LinksWidget } from './index';
import { renderWithProviders } from '@/test/utils';
import { createMockWidget } from '@/test/utils';
import { WIDGET_TYPE_LINKS } from '@/constants/widgetTypes';
import { LinksWidget as LinksWidgetType } from './types';

describe('LinksWidget', () => {
  it('should render link categories with title', () => {
    const widget: LinksWidgetType = createMockWidget<LinksWidgetType>({
      type: WIDGET_TYPE_LINKS,
      title: 'My Links',
      elements: [{ id: '1', label: 'Example', url: 'https://example.com' }],
    });
    renderWithProviders(<LinksWidget {...widget} />);

    expect(screen.getByText('My Links')).toBeInTheDocument();
  });

  it('should render links within category', () => {
    const widget: LinksWidgetType = createMockWidget<LinksWidgetType>({
      type: WIDGET_TYPE_LINKS,
      title: 'My Links',
      elements: [
        { id: '1', label: 'Example', url: 'https://example.com' },
        { id: '2', label: 'Google', url: 'https://google.com' },
      ],
    });
    renderWithProviders(<LinksWidget {...widget} />);

    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('should have correct link attributes', () => {
    const widget: LinksWidgetType = createMockWidget<LinksWidgetType>({
      type: WIDGET_TYPE_LINKS,
      title: 'My Links',
      elements: [{ id: '1', label: 'Example', url: 'https://example.com' }],
    });
    renderWithProviders(<LinksWidget {...widget} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render empty list when no elements', () => {
    const widget: LinksWidgetType = createMockWidget<LinksWidgetType>({
      type: WIDGET_TYPE_LINKS,
      title: 'My Links',
      elements: [],
    });
    renderWithProviders(<LinksWidget {...widget} />);

    expect(screen.getByText('My Links')).toBeInTheDocument();
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('should handle links with faviconUrl', () => {
    const widget: LinksWidgetType = createMockWidget<LinksWidgetType>({
      type: WIDGET_TYPE_LINKS,
      title: 'My Links',
      elements: [
        {
          id: '1',
          label: 'Example',
          url: 'https://example.com',
          faviconUrl: 'https://example.com/favicon.ico',
        },
      ],
    });
    renderWithProviders(<LinksWidget {...widget} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
});
