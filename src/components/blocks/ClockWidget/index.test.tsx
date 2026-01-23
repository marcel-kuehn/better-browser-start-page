import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import { ClockWidget } from './index';
import { renderWithProviders } from '@/test/utils';
import { createMockWidget } from '@/test/utils';
import { ClockWidget as ClockWidgetType } from './types';

// Time regex that matches both 24h (14:30) and 12h (02:30 PM/AM) formats
const TIME_REGEX = /\d{1,2}:\d{2}(\s?(AM|PM))?/i;

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

    // Time should be displayed (can be 24h or 12h format depending on locale)
    const timeElement = screen.getByText(TIME_REGEX);
    expect(timeElement).toBeInTheDocument();

    // Date should be displayed (query by class to avoid matching time)
    const dateElement = document.querySelector('.text-muted-foreground.text-lg');
    expect(dateElement).toBeInTheDocument();
    expect(dateElement?.textContent).toBeTruthy();
  });

  it('should update time periodically', async () => {
    const widget = createMockWidget<ClockWidgetType>({ type: 'clock-widget' });
    renderWithProviders(<ClockWidget {...widget} />);

    const initialTime = screen.getByText(TIME_REGEX).textContent;

    // Advance time by 1 minute to ensure the time changes
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    // Time should have updated
    expect(screen.getByText(TIME_REGEX)).toBeInTheDocument();
    expect(screen.getByText(TIME_REGEX).textContent).not.toBe(initialTime);
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

    const container = screen.getByText(TIME_REGEX).closest('.flex');
    expect(container).toHaveClass('flex-col', 'items-center', 'justify-center', 'text-center');
  });
});
