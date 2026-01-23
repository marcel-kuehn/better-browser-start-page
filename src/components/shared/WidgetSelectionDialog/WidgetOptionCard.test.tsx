import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WidgetOptionCard from './WidgetOptionCard';
import { WidgetOption } from './types';
import { ClockIcon, LayoutGridIcon } from 'lucide-react';
import { GridSpan } from '@/components/blocks/Grid/types';

describe('WidgetOptionCard', () => {
  const mockOnSelectWidget = vi.fn();
  const mockIsVariantDisabled = vi.fn().mockReturnValue(false);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Single variant widget', () => {
    const singleVariantOption: WidgetOption = {
      type: 'clock-widget',
      label: 'Clock',
      description: 'Time and date display.',
      icon: ClockIcon,
      variants: [{ rowSpan: 1, columnSpan: 1 }],
    };

    it('should render as a single clickable button', () => {
      render(
        <WidgetOptionCard
          option={singleVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={mockIsVariantDisabled}
        />
      );

      const button = screen.getByRole('button', { name: /clock/i });
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Clock')).toBeInTheDocument();
      expect(screen.getByText('Time and date display.')).toBeInTheDocument();
    });

    it('should call onSelectWidget with type and variant when clicked', async () => {
      const user = userEvent.setup();
      render(
        <WidgetOptionCard
          option={singleVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={mockIsVariantDisabled}
        />
      );

      await user.click(screen.getByRole('button', { name: /clock/i }));

      expect(mockOnSelectWidget).toHaveBeenCalledWith('clock-widget', {
        rowSpan: 1,
        columnSpan: 1,
      });
    });

    it('should be disabled when isVariantDisabled returns true', () => {
      const isDisabled = () => true;

      render(
        <WidgetOptionCard
          option={singleVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={isDisabled}
        />
      );

      expect(screen.getByRole('button', { name: /clock/i })).toBeDisabled();
    });

    it('should not call onSelectWidget when disabled button is clicked', async () => {
      const user = userEvent.setup();
      const isDisabled = () => true;

      render(
        <WidgetOptionCard
          option={singleVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={isDisabled}
        />
      );

      await user.click(screen.getByRole('button', { name: /clock/i }));

      expect(mockOnSelectWidget).not.toHaveBeenCalled();
    });

    it('should call isVariantDisabled with the single variant', () => {
      const isDisabledSpy = vi.fn().mockReturnValue(false);

      render(
        <WidgetOptionCard
          option={singleVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={isDisabledSpy}
        />
      );

      expect(isDisabledSpy).toHaveBeenCalledWith({ rowSpan: 1, columnSpan: 1 });
    });
  });

  describe('Multi-variant widget', () => {
    const multiVariantOption: WidgetOption = {
      type: 'apps-widget',
      label: 'Apps Grid',
      description: 'Pinned shortcuts and bookmarks.',
      icon: LayoutGridIcon,
      variants: [
        { rowSpan: 1, columnSpan: 1 },
        { rowSpan: 2, columnSpan: 2 },
        { rowSpan: 3, columnSpan: 3 },
      ],
    };

    it('should render as a card with variant buttons', () => {
      render(
        <WidgetOptionCard
          option={multiVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={mockIsVariantDisabled}
        />
      );

      expect(screen.getByText('Apps Grid')).toBeInTheDocument();
      expect(screen.getByText('Pinned shortcuts and bookmarks.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1x1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2x2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
    });

    it('should call onSelectWidget with correct variant when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WidgetOptionCard
          option={multiVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={mockIsVariantDisabled}
        />
      );

      await user.click(screen.getByRole('button', { name: '2x2' }));

      expect(mockOnSelectWidget).toHaveBeenCalledWith('apps-widget', { rowSpan: 2, columnSpan: 2 });
    });

    it('should disable specific variants based on isVariantDisabled', () => {
      const isDisabled = (variant: GridSpan) => variant.rowSpan > 1;

      render(
        <WidgetOptionCard
          option={multiVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={isDisabled}
        />
      );

      expect(screen.getByRole('button', { name: '1x1' })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: '2x2' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '3x3' })).toBeDisabled();
    });

    it('should allow clicking enabled variant while other variants are disabled', async () => {
      const user = userEvent.setup();
      const isDisabled = (variant: GridSpan) => variant.rowSpan > 1;

      render(
        <WidgetOptionCard
          option={multiVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={isDisabled}
        />
      );

      await user.click(screen.getByRole('button', { name: '1x1' }));

      expect(mockOnSelectWidget).toHaveBeenCalledWith('apps-widget', { rowSpan: 1, columnSpan: 1 });
    });

    it('should not call onSelectWidget when clicking disabled variant', async () => {
      const user = userEvent.setup();
      const isDisabled = (variant: GridSpan) => variant.rowSpan > 1;

      render(
        <WidgetOptionCard
          option={multiVariantOption}
          onSelectWidget={mockOnSelectWidget}
          isVariantDisabled={isDisabled}
        />
      );

      await user.click(screen.getByRole('button', { name: '2x2' }));

      expect(mockOnSelectWidget).not.toHaveBeenCalled();
    });
  });
});
