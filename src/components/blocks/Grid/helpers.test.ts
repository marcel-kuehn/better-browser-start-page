import { describe, it, expect } from 'vitest';
import {
  isGridAreaColliding,
  isOutOfBounds,
  getTargetArea,
  isCollidingWithOtherWidgets,
  canFitWidget,
  canGridBeContracted,
} from './helpers';
import { GridArea, Widget } from '@/types';
import { GridSpan } from './types';

describe('Grid helpers', () => {
  describe('isGridAreaColliding', () => {
    it('should return true for overlapping areas', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 };
      const areaB: GridArea = { rowStart: 2, rowEnd: 4, columnStart: 2, columnEnd: 4 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(true);
    });

    it('should return true for identical areas', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 };
      expect(isGridAreaColliding(area, area)).toBe(true);
    });

    it('should return true for partially overlapping areas', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 };
      const areaB: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 4 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(true);
    });

    it('should return false for non-overlapping areas', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      const areaB: GridArea = { rowStart: 3, rowEnd: 4, columnStart: 3, columnEnd: 4 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(false);
    });

    it('should return false for adjacent areas (touching but not overlapping)', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      const areaB: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(false);
    });

    it('should return false for diagonally adjacent areas (corner-touching)', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      const areaB: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(false);
    });

    it('should return false for horizontally adjacent areas', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      const areaB: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(false);
    });

    it('should return true when one area completely contains another', () => {
      const outer: GridArea = { rowStart: 1, rowEnd: 4, columnStart: 1, columnEnd: 4 };
      const inner: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 };
      expect(isGridAreaColliding(outer, inner)).toBe(true);
      expect(isGridAreaColliding(inner, outer)).toBe(true);
    });

    it('should return true for single-cell overlap', () => {
      const areaA: GridArea = { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 };
      const areaB: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 };
      expect(isGridAreaColliding(areaA, areaB)).toBe(true);
    });
  });

  describe('isOutOfBounds', () => {
    it('should return false for area within bounds', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 };
      expect(isOutOfBounds(area, 4, 4)).toBe(false);
    });

    it('should return true when columnEnd exceeds columns', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 6 };
      expect(isOutOfBounds(area, 4, 4)).toBe(true);
    });

    it('should return true when rowEnd exceeds rows', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 6, columnStart: 1, columnEnd: 2 };
      expect(isOutOfBounds(area, 4, 4)).toBe(true);
    });

    it('should return false when area is exactly at bounds', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 5, columnStart: 1, columnEnd: 5 };
      expect(isOutOfBounds(area, 4, 4)).toBe(false);
    });

    it('should return true when both dimensions exceed bounds', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 6, columnStart: 1, columnEnd: 6 };
      expect(isOutOfBounds(area, 4, 4)).toBe(true);
    });

    it('should return false for single cell at top-left corner', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      expect(isOutOfBounds(area, 4, 4)).toBe(false);
    });

    it('should return false for single cell at bottom-right corner', () => {
      const area: GridArea = { rowStart: 4, rowEnd: 5, columnStart: 4, columnEnd: 5 };
      expect(isOutOfBounds(area, 4, 4)).toBe(false);
    });

    it('should return true for single cell overflow on right edge', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 5, columnEnd: 6 };
      expect(isOutOfBounds(area, 4, 4)).toBe(true);
    });

    it('should return true for single cell overflow on bottom edge', () => {
      const area: GridArea = { rowStart: 5, rowEnd: 6, columnStart: 1, columnEnd: 2 };
      expect(isOutOfBounds(area, 4, 4)).toBe(true);
    });

    it('should return true for widget starting inside but extending beyond bounds', () => {
      // 2x2 widget starting at column 4 extends to column 6 (beyond 4-column grid)
      const area: GridArea = { rowStart: 1, rowEnd: 3, columnStart: 4, columnEnd: 6 };
      expect(isOutOfBounds(area, 4, 4)).toBe(true);
    });

    it('should return true for large widget that exceeds small grid', () => {
      // 3x3 widget in a 2x2 grid
      const area: GridArea = { rowStart: 1, rowEnd: 4, columnStart: 1, columnEnd: 4 };
      expect(isOutOfBounds(area, 2, 2)).toBe(true);
    });

    it('should return false for 1x1 grid with 1x1 widget', () => {
      const area: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      expect(isOutOfBounds(area, 1, 1)).toBe(false);
    });
  });

  describe('getTargetArea', () => {
    it('should return correct grid area for cell position and span', () => {
      const cell = { row: 2, column: 3 };
      const span: GridSpan = { rowSpan: 2, columnSpan: 3 };
      const result = getTargetArea(cell, span);
      expect(result).toEqual({
        rowStart: 2,
        rowEnd: 4,
        columnStart: 3,
        columnEnd: 6,
      });
    });

    it('should handle single cell span', () => {
      const cell = { row: 1, column: 1 };
      const span: GridSpan = { rowSpan: 1, columnSpan: 1 };
      const result = getTargetArea(cell, span);
      expect(result).toEqual({
        rowStart: 1,
        rowEnd: 2,
        columnStart: 1,
        columnEnd: 2,
      });
    });

    it('should handle large spans', () => {
      const cell = { row: 5, column: 5 };
      const span: GridSpan = { rowSpan: 4, columnSpan: 4 };
      const result = getTargetArea(cell, span);
      expect(result).toEqual({
        rowStart: 5,
        rowEnd: 9,
        columnStart: 5,
        columnEnd: 9,
      });
    });
  });

  describe('isCollidingWithOtherWidgets', () => {
    it('should return true when target area collides with existing widget', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
        },
      ];
      const targetArea: GridArea = { rowStart: 2, rowEnd: 4, columnStart: 2, columnEnd: 4 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(true);
    });

    it('should return false when target area does not collide', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];
      const targetArea: GridArea = { rowStart: 3, rowEnd: 4, columnStart: 3, columnEnd: 4 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(false);
    });

    it('should return false for empty widgets array', () => {
      const widgets: Widget[] = [];
      const targetArea: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(false);
    });

    it('should check collision with multiple widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
        {
          id: '2',
          type: 'test',
          gridArea: { rowStart: 3, rowEnd: 4, columnStart: 3, columnEnd: 4 },
        },
      ];
      const targetArea: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(false);
    });

    it('should return true when colliding with any of multiple widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
        {
          id: '2',
          type: 'test',
          gridArea: { rowStart: 3, rowEnd: 4, columnStart: 3, columnEnd: 4 },
        },
      ];
      // This target area collides with widget 2
      const targetArea: GridArea = { rowStart: 3, rowEnd: 4, columnStart: 3, columnEnd: 4 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(true);
    });

    it('should return false for diagonally adjacent widgets (corner-touching)', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];
      // New widget at diagonal corner
      const targetArea: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(false);
    });

    it('should return false for horizontally adjacent widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];
      // New widget immediately to the right
      const targetArea: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(false);
    });

    it('should return false for vertically adjacent widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];
      // New widget immediately below
      const targetArea: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(false);
    });

    it('should return true when large widget overlaps multiple existing widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
        {
          id: '2',
          type: 'test',
          gridArea: { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 },
        },
      ];
      // Large 3x3 widget that overlaps both
      const targetArea: GridArea = { rowStart: 1, rowEnd: 4, columnStart: 1, columnEnd: 4 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(true);
    });

    it('should return true when placing widget in exact same position as existing', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 },
        },
      ];
      const targetArea: GridArea = { rowStart: 2, rowEnd: 3, columnStart: 2, columnEnd: 3 };
      expect(isCollidingWithOtherWidgets(widgets, targetArea)).toBe(true);
    });
  });

  describe('canFitWidget', () => {
    it('should return true when widget can fit', () => {
      const widgets: Widget[] = [];
      const targetArea: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 }; // Grid dimensions
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(true);
    });

    it('should return false when out of bounds', () => {
      const widgets: Widget[] = [];
      const targetArea: GridArea = { rowStart: 1, rowEnd: 6, columnStart: 1, columnEnd: 2 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 }; // Grid dimensions
      // isOutOfBounds checks if area.columnEnd > columns + 1 or area.rowEnd > rows + 1
      // rowEnd=6 > rowSpan(4)+1=5, so it should be out of bounds
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(false);
    });

    it('should return false when colliding with other widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
        },
      ];
      const targetArea: GridArea = { rowStart: 2, rowEnd: 4, columnStart: 2, columnEnd: 4 };
      const span: GridSpan = { rowSpan: 2, columnSpan: 2 };
      expect(canFitWidget(widgets, targetArea, span)).toBe(false);
    });

    it('should return false for undefined target area', () => {
      const widgets: Widget[] = [];
      const span: GridSpan = { rowSpan: 1, columnSpan: 1 };
      expect(canFitWidget(widgets, undefined as unknown as GridArea, span)).toBe(false);
    });

    it('should return true for widget at bottom-right corner within bounds', () => {
      const widgets: Widget[] = [];
      const targetArea: GridArea = { rowStart: 4, rowEnd: 5, columnStart: 4, columnEnd: 5 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(true);
    });

    it('should return false for widget starting at last cell but spanning 2x2', () => {
      const widgets: Widget[] = [];
      // Trying to place 2x2 widget starting at position (4,4) on a 4x4 grid
      const targetArea: GridArea = { rowStart: 4, rowEnd: 6, columnStart: 4, columnEnd: 6 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(false);
    });

    it('should return true for large widget that fills entire grid', () => {
      const widgets: Widget[] = [];
      const targetArea: GridArea = { rowStart: 1, rowEnd: 5, columnStart: 1, columnEnd: 5 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(true);
    });

    it('should return false for large widget in grid with existing widgets', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];
      // Trying to place full-grid widget
      const targetArea: GridArea = { rowStart: 1, rowEnd: 5, columnStart: 1, columnEnd: 5 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(false);
    });

    it('should return true when widget fits next to existing widget', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 },
        },
      ];
      // Widget adjacent to existing one
      const targetArea: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(true);
    });

    it('should return false when 1x3 widget exceeds 2-column grid width', () => {
      const widgets: Widget[] = [];
      // 1x3 widget on 2-column grid
      const targetArea: GridArea = { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 4 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 2 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(false);
    });

    it('should return false when 3x1 widget exceeds 2-row grid height', () => {
      const widgets: Widget[] = [];
      // 3x1 widget on 2-row grid
      const targetArea: GridArea = { rowStart: 1, rowEnd: 4, columnStart: 1, columnEnd: 2 };
      const gridSpan: GridSpan = { rowSpan: 2, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(false);
    });

    it('should return false when both collision and out-of-bounds occur', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
        },
      ];
      // Large widget that both collides AND is out of bounds
      const targetArea: GridArea = { rowStart: 1, rowEnd: 7, columnStart: 1, columnEnd: 7 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(false);
    });

    it('should return true for filling remaining space after existing widget', () => {
      const widgets: Widget[] = [
        {
          id: '1',
          type: 'test',
          gridArea: { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
        },
      ];
      // Widget in bottom-right quadrant, not overlapping
      const targetArea: GridArea = { rowStart: 3, rowEnd: 5, columnStart: 3, columnEnd: 5 };
      const gridSpan: GridSpan = { rowSpan: 4, columnSpan: 4 };
      expect(canFitWidget(widgets, targetArea, gridSpan)).toBe(true);
    });

    it('should return false for null target area', () => {
      const widgets: Widget[] = [];
      const span: GridSpan = { rowSpan: 1, columnSpan: 1 };
      expect(canFitWidget(widgets, null as unknown as GridArea, span)).toBe(false);
    });
  });

  describe('canGridBeContracted', () => {
    const createWidget = (gridArea: GridArea): Widget => ({
      id: '1',
      type: 'test',
      gridArea,
    });

    it('should return true for top direction when no widgets at row 1 and rowSpan > 1', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 2 }),
      ];
      const span: GridSpan = { rowSpan: 3, columnSpan: 4 };
      expect(canGridBeContracted('top', widgets, span)).toBe(true);
    });

    it('should return false for top direction when widget at row 1', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
      ];
      const span: GridSpan = { rowSpan: 3, columnSpan: 4 };
      expect(canGridBeContracted('top', widgets, span)).toBe(false);
    });

    it('should return false for top direction when rowSpan is 1', () => {
      const widgets: Widget[] = [];
      const span: GridSpan = { rowSpan: 1, columnSpan: 4 };
      expect(canGridBeContracted('top', widgets, span)).toBe(false);
    });

    it('should return true for bottom direction when no widgets at last row and rowSpan > 1', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
      ];
      const span: GridSpan = { rowSpan: 3, columnSpan: 4 };
      expect(canGridBeContracted('bottom', widgets, span)).toBe(true);
    });

    it('should return false for bottom direction when widget at last row', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 3, rowEnd: 4, columnStart: 1, columnEnd: 2 }),
      ];
      const span: GridSpan = { rowSpan: 3, columnSpan: 4 };
      expect(canGridBeContracted('bottom', widgets, span)).toBe(false);
    });

    it('should return true for left direction when no widgets at column 1 and columnSpan > 1', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 1, rowEnd: 2, columnStart: 2, columnEnd: 3 }),
      ];
      const span: GridSpan = { rowSpan: 4, columnSpan: 3 };
      expect(canGridBeContracted('left', widgets, span)).toBe(true);
    });

    it('should return false for left direction when widget at column 1', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
      ];
      const span: GridSpan = { rowSpan: 4, columnSpan: 3 };
      expect(canGridBeContracted('left', widgets, span)).toBe(false);
    });

    it('should return true for right direction when no widgets at last column and columnSpan > 1', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 2 }),
      ];
      const span: GridSpan = { rowSpan: 4, columnSpan: 3 };
      expect(canGridBeContracted('right', widgets, span)).toBe(true);
    });

    it('should return false for right direction when widget at last column', () => {
      const widgets: Widget[] = [
        createWidget({ rowStart: 1, rowEnd: 2, columnStart: 3, columnEnd: 4 }),
      ];
      const span: GridSpan = { rowSpan: 4, columnSpan: 3 };
      expect(canGridBeContracted('right', widgets, span)).toBe(false);
    });
  });
});
