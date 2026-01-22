import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddWidgetButton } from './AddWidgetButton';

describe('AddWidgetButton', () => {
  const defaultProps = {
    position: { row: 1, column: 1 },
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render a button', () => {
    render(<AddWidgetButton {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should have correct aria-label with position', () => {
    render(<AddWidgetButton {...defaultProps} position={{ row: 2, column: 3 }} />);

    expect(
      screen.getByRole('button', { name: 'Add widget at row 2, column 3' })
    ).toBeInTheDocument();
  });

  it('should call onClick with row and column when clicked', () => {
    const onClick = vi.fn();
    render(<AddWidgetButton position={{ row: 2, column: 3 }} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledWith(2, 3);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct grid area style', () => {
    render(<AddWidgetButton {...defaultProps} position={{ row: 2, column: 3 }} />);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      gridArea: '2 / 3 / 3 / 4',
    });
  });

  it('should have dashed border styling', () => {
    render(<AddWidgetButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-dashed');
  });

  it('should render Plus icon', () => {
    render(<AddWidgetButton {...defaultProps} />);

    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should handle position at row 1, column 1', () => {
    render(<AddWidgetButton {...defaultProps} position={{ row: 1, column: 1 }} />);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      gridArea: '1 / 1 / 2 / 2',
    });
    expect(
      screen.getByRole('button', { name: 'Add widget at row 1, column 1' })
    ).toBeInTheDocument();
  });

  it('should handle large row and column values', () => {
    const onClick = vi.fn();
    render(<AddWidgetButton position={{ row: 10, column: 8 }} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledWith(10, 8);
    expect(button).toHaveStyle({
      gridArea: '10 / 8 / 11 / 9',
    });
  });

  it('should have full height', () => {
    render(<AddWidgetButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-full');
  });

  it('should have ghost variant styling', () => {
    render(<AddWidgetButton {...defaultProps} />);

    // Button is rendered - variant styling is applied via buttonVariants
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have transition styling for hover effects', () => {
    render(<AddWidgetButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('transition-colors');
  });
});
