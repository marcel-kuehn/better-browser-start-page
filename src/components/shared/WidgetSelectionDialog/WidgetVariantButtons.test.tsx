import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WidgetVariantButtons from './WidgetVariantButtons';
import { GridSpan } from '@/components/blocks/Grid/types';

describe('WidgetVariantButtons', () => {
  const defaultVariants: GridSpan[] = [
    { rowSpan: 1, columnSpan: 1 },
    { rowSpan: 2, columnSpan: 2 },
    { rowSpan: 3, columnSpan: 3 },
  ];
  const mockOnSelectWidget = vi.fn();
  const mockIsVariantDisabled = vi.fn().mockReturnValue(false);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render buttons for all variants', () => {
    render(
      <WidgetVariantButtons
        type="test-widget"
        variants={defaultVariants}
        onSelectWidget={mockOnSelectWidget}
        isVariantDisabled={mockIsVariantDisabled}
      />
    );

    expect(screen.getByRole('button', { name: '1x1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2x2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
  });

  it('should call onSelectWidget with correct type and variant when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <WidgetVariantButtons
        type="apps-widget"
        variants={defaultVariants}
        onSelectWidget={mockOnSelectWidget}
        isVariantDisabled={mockIsVariantDisabled}
      />
    );

    await user.click(screen.getByRole('button', { name: '2x2' }));

    expect(mockOnSelectWidget).toHaveBeenCalledWith('apps-widget', { rowSpan: 2, columnSpan: 2 });
  });

  it('should disable buttons when isVariantDisabled returns true', () => {
    const isDisabled = (variant: GridSpan) => variant.rowSpan > 1;

    render(
      <WidgetVariantButtons
        type="test-widget"
        variants={defaultVariants}
        onSelectWidget={mockOnSelectWidget}
        isVariantDisabled={isDisabled}
      />
    );

    expect(screen.getByRole('button', { name: '1x1' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: '2x2' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '3x3' })).toBeDisabled();
  });

  it('should not call onSelectWidget when clicking a disabled button', async () => {
    const user = userEvent.setup();
    const isDisabled = () => true;

    render(
      <WidgetVariantButtons
        type="test-widget"
        variants={defaultVariants}
        onSelectWidget={mockOnSelectWidget}
        isVariantDisabled={isDisabled}
      />
    );

    const disabledButton = screen.getByRole('button', { name: '1x1' });
    expect(disabledButton).toBeDisabled();

    await user.click(disabledButton);

    expect(mockOnSelectWidget).not.toHaveBeenCalled();
  });

  it('should render non-square variants correctly', () => {
    const variants: GridSpan[] = [
      { rowSpan: 1, columnSpan: 2 },
      { rowSpan: 2, columnSpan: 1 },
      { rowSpan: 3, columnSpan: 4 },
    ];

    render(
      <WidgetVariantButtons
        type="test-widget"
        variants={variants}
        onSelectWidget={mockOnSelectWidget}
        isVariantDisabled={mockIsVariantDisabled}
      />
    );

    expect(screen.getByRole('button', { name: '1x2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2x1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3x4' })).toBeInTheDocument();
  });

  it('should call isVariantDisabled for each variant', () => {
    const isDisabledSpy = vi.fn().mockReturnValue(false);

    render(
      <WidgetVariantButtons
        type="test-widget"
        variants={defaultVariants}
        onSelectWidget={mockOnSelectWidget}
        isVariantDisabled={isDisabledSpy}
      />
    );

    expect(isDisabledSpy).toHaveBeenCalledTimes(3);
    expect(isDisabledSpy).toHaveBeenCalledWith({ rowSpan: 1, columnSpan: 1 });
    expect(isDisabledSpy).toHaveBeenCalledWith({ rowSpan: 2, columnSpan: 2 });
    expect(isDisabledSpy).toHaveBeenCalledWith({ rowSpan: 3, columnSpan: 3 });
  });
});
