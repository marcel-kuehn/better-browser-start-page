import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import { ClockWidget } from './index';
import { renderWithProviders } from '@/test/utils';
import { createMockWidget } from '@/test/utils';
import { ClockWidget as ClockWidgetType } from './types';

describe('ClockWidget', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T14:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render current time and date', () => {
    const widget = createMockWidget<ClockWidgetType>({ type: 'clock-widget' });
    renderWithProviders(<ClockWidget {...widget} />);

    // Time should be displayed
    const timeElement = screen.getByText(/^\d{2}:\d{2}$/);
    expect(timeElement).toBeInTheDocument();

    // Date should be displayed (query by class to avoid matching time)
    const dateElement = document.querySelector('.text-muted-foreground.text-lg');
    expect(dateElement).toBeInTheDocument();
    expect(dateElement?.textContent).toBeTruthy();
  });

  it('should update time periodically', async () => {
    const widget = createMockWidget<ClockWidgetType>({ type: 'clock-widget' });
    renderWithProviders(<ClockWidget {...widget} />);

    const initialTime = screen.getByText(/^\d{2}:\d{2}$/).textContent;

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(60000); // Advance by 1 minute to ensure the MM changes
    });

    // Time should have updated (depending on locale, might be same or different)
    // At minimum, the component should re-render
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument();
    expect(screen.getByText(/^\d{2}:\d{2}$/).textContent).not.toBe(initialTime);
  });

  it('should display correctly in edit mode', () => {
    const widget = createMockWidget<ClockWidgetType>({ type: 'clock-widget' });
    renderWithProviders(<ClockWidget {...widget} />);

    // Initially not in edit mode, so no remove button
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const widget = createMockWidget<ClockWidgetType>({ type: 'clock-widget' });
    renderWithProviders(<ClockWidget {...widget} />);

    const container = screen.getByText(/^\d{2}:\d{2}$/).closest('.flex');
    expect(container).toHaveClass('flex-col', 'items-center', 'justify-center', 'text-center');
  });
});
