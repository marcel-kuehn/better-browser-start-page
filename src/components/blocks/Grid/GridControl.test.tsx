import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GridControl } from './GridControl';
import { Direction } from './types';

describe('GridControl', () => {
  const defaultProps = {
    onExpand: vi.fn(),
    onContract: vi.fn(),
    canContract: true,
    direction: 'top' as Direction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render expand button for top direction', () => {
      render(<GridControl {...defaultProps} direction="top" />);

      expect(screen.getByRole('button', { name: /add row to the top/i })).toBeInTheDocument();
    });

    it('should render expand button for bottom direction', () => {
      render(<GridControl {...defaultProps} direction="bottom" />);

      expect(screen.getByRole('button', { name: /add row to the bottom/i })).toBeInTheDocument();
    });

    it('should render expand button for left direction', () => {
      render(<GridControl {...defaultProps} direction="left" />);

      expect(screen.getByRole('button', { name: /add column to the left/i })).toBeInTheDocument();
    });

    it('should render expand button for right direction', () => {
      render(<GridControl {...defaultProps} direction="right" />);

      expect(screen.getByRole('button', { name: /add column to the right/i })).toBeInTheDocument();
    });

    it('should render contract button when canContract is true', () => {
      render(<GridControl {...defaultProps} canContract={true} direction="top" />);

      expect(screen.getByRole('button', { name: /remove row from the top/i })).toBeInTheDocument();
    });

    it('should not render contract button when canContract is false', () => {
      render(<GridControl {...defaultProps} canContract={false} direction="top" />);

      expect(
        screen.queryByRole('button', { name: /remove row from the top/i })
      ).not.toBeInTheDocument();
    });

    it('should return null for invalid direction', () => {
      const { container } = render(
        <GridControl {...defaultProps} direction={'invalid' as Direction} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('click handlers', () => {
    it('should call onExpand when expand button is clicked', () => {
      const onExpand = vi.fn();
      render(<GridControl {...defaultProps} onExpand={onExpand} direction="top" />);

      const expandButton = screen.getByRole('button', { name: /add row to the top/i });
      fireEvent.click(expandButton);

      expect(onExpand).toHaveBeenCalledTimes(1);
    });

    it('should call onContract when contract button is clicked', () => {
      const onContract = vi.fn();
      render(
        <GridControl {...defaultProps} onContract={onContract} canContract={true} direction="top" />
      );

      const contractButton = screen.getByRole('button', { name: /remove row from the top/i });
      fireEvent.click(contractButton);

      expect(onContract).toHaveBeenCalledTimes(1);
    });
  });

  describe('positioning classes', () => {
    it('should have correct positioning for top direction', () => {
      const { container } = render(<GridControl {...defaultProps} direction="top" />);

      const controlDiv = container.firstChild as HTMLElement;
      expect(controlDiv).toHaveClass('-top-1');
    });

    it('should have correct positioning for bottom direction', () => {
      const { container } = render(<GridControl {...defaultProps} direction="bottom" />);

      const controlDiv = container.firstChild as HTMLElement;
      expect(controlDiv).toHaveClass('-bottom-1');
    });

    it('should have correct positioning for left direction', () => {
      const { container } = render(<GridControl {...defaultProps} direction="left" />);

      const controlDiv = container.firstChild as HTMLElement;
      expect(controlDiv).toHaveClass('-left-1');
    });

    it('should have correct positioning for right direction', () => {
      const { container } = render(<GridControl {...defaultProps} direction="right" />);

      const controlDiv = container.firstChild as HTMLElement;
      expect(controlDiv).toHaveClass('-right-1');
    });

    it('should have absolute positioning', () => {
      const { container } = render(<GridControl {...defaultProps} direction="top" />);

      const controlDiv = container.firstChild as HTMLElement;
      expect(controlDiv).toHaveClass('absolute');
    });
  });

  describe('aria labels', () => {
    it('should have correct aria-label for row operations', () => {
      render(<GridControl {...defaultProps} direction="top" canContract={true} />);

      expect(screen.getByRole('button', { name: /add row/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove row/i })).toBeInTheDocument();
    });

    it('should have correct aria-label for column operations', () => {
      render(<GridControl {...defaultProps} direction="left" canContract={true} />);

      expect(screen.getByRole('button', { name: /add column/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove column/i })).toBeInTheDocument();
    });
  });

  describe('all directions with canContract false', () => {
    const directions: Direction[] = ['top', 'bottom', 'left', 'right'];

    directions.forEach(direction => {
      it(`should only show expand button for ${direction} when canContract is false`, () => {
        render(<GridControl {...defaultProps} direction={direction} canContract={false} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(1);
      });
    });
  });

  describe('all directions with canContract true', () => {
    const directions: Direction[] = ['top', 'bottom', 'left', 'right'];

    directions.forEach(direction => {
      it(`should show both buttons for ${direction} when canContract is true`, () => {
        render(<GridControl {...defaultProps} direction={direction} canContract={true} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
      });
    });
  });
});
