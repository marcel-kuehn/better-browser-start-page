import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import StopWatchWidget from './index';
import { renderWithProviders } from '@/test/utils';
import { createMockWidget } from '@/test/utils';
import { StopWatchWidget as StopWatchWidgetType } from './types';

describe('StopWatchWidget', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render initial state with 00:00', () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('should show start button initially', () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should start stopwatch when start button is clicked', async () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    await act(async () => {
      fireEvent.click(startButton);
    });

    // Advance time by 1 second to trigger the interval callback
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const timeDisplay = screen.getByText(/00:01/);
    expect(timeDisplay).toBeInTheDocument();
    expect(timeDisplay).not.toHaveTextContent('00:00');
  });

  it('should pause stopwatch when pause button is clicked', async () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    // Start
    const startButton = screen.getByRole('button', { name: /start/i });
    await act(async () => {
      fireEvent.click(startButton);
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Pause
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    await act(async () => {
      fireEvent.click(pauseButton);
    });

    const elapsedTime = screen.getByText(/^\d{2}:\d{2}$/).textContent;

    // Advance more time
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Time should not have changed
    expect(screen.getByText(/^\d{2}:\d{2}$/).textContent).toBe(elapsedTime);
  });

  it('should reset stopwatch when reset button is clicked', async () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    // Start
    const startButton = screen.getByRole('button', { name: /start/i });
    await act(async () => {
      fireEvent.click(startButton);
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('should resume stopwatch after pause', async () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    // Start
    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Pause
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(pauseButton);

    const pausedTime = screen.getByText(/^\d{2}:\d{2}$/).textContent;

    // Resume
    const resumeButton = screen.getByRole('button', { name: /resume/i });
    fireEvent.click(resumeButton);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Time should have increased from paused time
    const newTime = screen.getByText(/^\d{2}:\d{2}$/).textContent;
    expect(newTime).not.toBe(pausedTime);
  });

  it('should handle rapid start/stop cycles', async () => {
    const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
    renderWithProviders(<StopWatchWidget {...widget} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    await act(async () => {
      fireEvent.click(startButton);
      vi.advanceTimersByTime(100);
    });

    const pauseButton = screen.getByRole('button', { name: /pause/i });
    await act(async () => {
      fireEvent.click(pauseButton);
    });

    const resumeButton = screen.getByRole('button', { name: /resume/i });
    await act(async () => {
      fireEvent.click(resumeButton);
      vi.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.click(pauseButton);
    });

    // Should still work correctly
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument();
  });

  describe('cleanup and memory management', () => {
    it('should clear interval on unmount', async () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });

      const { unmount } = renderWithProviders(<StopWatchWidget {...widget} />);

      // Start the stopwatch to create an interval
      const startButton = screen.getByRole('button', { name: /start/i });
      await act(async () => {
        fireEvent.click(startButton);
      });

      // Unmount the component
      unmount();

      // clearInterval should have been called
      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });

    it('should not leak intervals when starting and stopping multiple times', async () => {
      const setIntervalSpy = vi.spyOn(global, 'setInterval');
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
      const { unmount } = renderWithProviders(<StopWatchWidget {...widget} />);

      // Start
      const startButton = screen.getByRole('button', { name: /start/i });
      await act(async () => {
        fireEvent.click(startButton);
        vi.advanceTimersByTime(1000);
      });

      // Pause
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      await act(async () => {
        fireEvent.click(pauseButton);
      });

      // Resume
      const resumeButton = screen.getByRole('button', { name: /resume/i });
      await act(async () => {
        fireEvent.click(resumeButton);
        vi.advanceTimersByTime(1000);
      });

      // Unmount
      unmount();

      // All intervals should be cleared (clearInterval called at least as many times as setInterval)
      const setIntervalCalls = setIntervalSpy.mock.calls.length;
      const clearIntervalCalls = clearIntervalSpy.mock.calls.length;

      expect(clearIntervalCalls).toBeGreaterThanOrEqual(setIntervalCalls);

      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });

    it('should not update state after unmount', async () => {
      const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
      const { unmount } = renderWithProviders(<StopWatchWidget {...widget} />);

      // Start the stopwatch
      const startButton = screen.getByRole('button', { name: /start/i });
      await act(async () => {
        fireEvent.click(startButton);
      });

      // Unmount immediately
      unmount();

      // Advancing timers should not cause errors
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // If we get here without errors, the cleanup worked correctly
      expect(true).toBe(true);
    });

    it('should display hours for long running timer', async () => {
      const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });
      renderWithProviders(<StopWatchWidget {...widget} />);

      // Start the stopwatch
      const startButton = screen.getByRole('button', { name: /start/i });
      await act(async () => {
        fireEvent.click(startButton);
      });

      // Advance by 1 hour and 1 second
      await act(async () => {
        vi.advanceTimersByTime(3601000);
      });

      // Should display hours format (HH:MM:SS)
      const timeDisplay = screen.getByText(/^\d{2}:\d{2}:\d{2}$/);
      expect(timeDisplay).toBeInTheDocument();
      expect(timeDisplay.textContent).toContain('01:00:01');
    });

    it('should handle component remount correctly', async () => {
      const widget = createMockWidget<StopWatchWidgetType>({ type: 'stopwatch-widget' });

      // First render
      const { unmount } = renderWithProviders(<StopWatchWidget {...widget} />);

      // Start and advance
      const startButton = screen.getByRole('button', { name: /start/i });
      await act(async () => {
        fireEvent.click(startButton);
        vi.advanceTimersByTime(2000);
      });

      // Unmount
      unmount();

      // Remount - should start fresh
      renderWithProviders(<StopWatchWidget {...widget} />);

      // Should show 00:00 again (fresh state)
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });
  });
});
