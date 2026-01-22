import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import BlockRenderer from './index';
import { renderWithProviders } from '@/test/utils';
import {
  WIDGET_TYPE_GRID,
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_APPS,
  WIDGET_TYPE_LINKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_STOPWATCH,
} from '@/constants/widgetTypes';
import { Block } from '@/types';
import { DEFAULT_SEARCH_URL } from '@/components/blocks/SearchWidget/constants';

// Mock the child components to simplify testing
vi.mock('../../blocks/Grid', () => ({
  default: ({ id }: { id: string }) => <div data-testid={`grid-${id}`}>Grid Widget</div>,
}));

vi.mock('../../blocks/SearchWidget', () => ({
  SearchWidget: ({ id }: { id: string }) => <div data-testid={`search-${id}`}>Search Widget</div>,
}));

vi.mock('../../blocks/AppsWidget', () => ({
  AppsWidget: ({ id }: { id: string }) => <div data-testid={`apps-${id}`}>Apps Widget</div>,
}));

vi.mock('../../blocks/LinksWidget', () => ({
  LinksWidget: ({ id }: { id: string }) => <div data-testid={`links-${id}`}>Links Widget</div>,
}));

vi.mock('../../blocks/ClockWidget', () => ({
  ClockWidget: ({ id }: { id: string }) => <div data-testid={`clock-${id}`}>Clock Widget</div>,
}));

vi.mock('../../blocks/StopWatchWidget', () => ({
  default: ({ id }: { id: string }) => <div data-testid={`stopwatch-${id}`}>Stopwatch Widget</div>,
}));

describe('BlockRenderer', () => {
  it('should render grid widget', () => {
    const blocks: Block[] = [
      {
        id: 'grid-1',
        type: WIDGET_TYPE_GRID,
        span: { rowSpan: 4, columnSpan: 4 },
        elements: [],
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('grid-grid-1')).toBeInTheDocument();
    expect(screen.getByText('Grid Widget')).toBeInTheDocument();
  });

  it('should render search widget', () => {
    const blocks: Block[] = [
      {
        id: 'search-1',
        type: WIDGET_TYPE_SEARCH,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('search-search-1')).toBeInTheDocument();
    expect(screen.getByText('Search Widget')).toBeInTheDocument();
  });

  it('should render apps widget', () => {
    const blocks: Block[] = [
      {
        id: 'apps-1',
        type: WIDGET_TYPE_APPS,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        elements: [{ id: '1', url: 'https://example.com' }],
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('apps-apps-1')).toBeInTheDocument();
    expect(screen.getByText('Apps Widget')).toBeInTheDocument();
  });

  it('should render links widget', () => {
    const blocks: Block[] = [
      {
        id: 'links-1',
        type: WIDGET_TYPE_LINKS,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        title: 'My Links',
        elements: [{ id: '1', label: 'Example', url: 'https://example.com' }],
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('links-links-1')).toBeInTheDocument();
    expect(screen.getByText('Links Widget')).toBeInTheDocument();
  });

  it('should render clock widget', () => {
    const blocks: Block[] = [
      {
        id: 'clock-1',
        type: WIDGET_TYPE_CLOCK,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('clock-clock-1')).toBeInTheDocument();
    expect(screen.getByText('Clock Widget')).toBeInTheDocument();
  });

  it('should render stopwatch widget', () => {
    const blocks: Block[] = [
      {
        id: 'stopwatch-1',
        type: WIDGET_TYPE_STOPWATCH,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('stopwatch-stopwatch-1')).toBeInTheDocument();
    expect(screen.getByText('Stopwatch Widget')).toBeInTheDocument();
  });

  it('should render multiple widgets of different types', () => {
    const blocks: Block[] = [
      {
        id: 'search-1',
        type: WIDGET_TYPE_SEARCH,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
      },
      {
        id: 'clock-1',
        type: WIDGET_TYPE_CLOCK,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 },
      },
      {
        id: 'stopwatch-1',
        type: WIDGET_TYPE_STOPWATCH,
        gridArea: { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 },
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('search-search-1')).toBeInTheDocument();
    expect(screen.getByTestId('clock-clock-1')).toBeInTheDocument();
    expect(screen.getByTestId('stopwatch-stopwatch-1')).toBeInTheDocument();
  });

  it('should filter out hidden blocks', () => {
    const blocks: Block[] = [
      {
        id: 'search-1',
        type: WIDGET_TYPE_SEARCH,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
        hidden: true,
      },
      {
        id: 'clock-1',
        type: WIDGET_TYPE_CLOCK,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 },
        hidden: false,
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.queryByTestId('search-search-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('clock-clock-1')).toBeInTheDocument();
  });

  it('should not render blocks without hidden property (treated as visible)', () => {
    const blocks: Block[] = [
      {
        id: 'clock-1',
        type: WIDGET_TYPE_CLOCK,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        // no hidden property
      },
    ];

    renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(screen.getByTestId('clock-clock-1')).toBeInTheDocument();
  });

  it('should return null for unknown widget types', () => {
    const blocks: Block[] = [
      {
        id: 'unknown-1',
        type: 'unknown-type' as Block['type'],
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
      },
    ];

    const { container } = renderWithProviders(<BlockRenderer blocks={blocks} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render empty when blocks array is empty', () => {
    const blocks: Block[] = [];

    const { container } = renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(container.firstChild).toBeNull();
  });

  it('should handle all blocks being hidden', () => {
    const blocks: Block[] = [
      {
        id: 'search-1',
        type: WIDGET_TYPE_SEARCH,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        elements: [{ id: '1', url: DEFAULT_SEARCH_URL }],
        hidden: true,
      },
      {
        id: 'clock-1',
        type: WIDGET_TYPE_CLOCK,
        gridArea: { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 },
        hidden: true,
      },
    ];

    const { container } = renderWithProviders(<BlockRenderer blocks={blocks} />);

    expect(container.firstChild).toBeNull();
  });
});
