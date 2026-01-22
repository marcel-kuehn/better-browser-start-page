import { CellPosition, Direction, GridSpan } from '@/components/blocks/Grid/types';
import { GridArea, Widget } from '@/types';

export const isGridAreaColliding = (areaA: GridArea, areaB: GridArea): boolean => {
  return (
    areaA.columnStart < areaB.columnEnd &&
    areaA.columnEnd > areaB.columnStart &&
    areaA.rowStart < areaB.rowEnd &&
    areaA.rowEnd > areaB.rowStart
  );
};

export const isOutOfBounds = (area: GridArea, columns: number, rows: number): boolean => {
  return area.columnEnd > columns + 1 || area.rowEnd > rows + 1;
};

export const getTargetArea = (cell: CellPosition, span: GridSpan): GridArea => {
  const { rowSpan, columnSpan } = span;
  return {
    rowStart: cell.row,
    rowEnd: cell.row + rowSpan,
    columnStart: cell.column,
    columnEnd: cell.column + columnSpan,
  };
};

export const isCollidingWithOtherWidgets = (elements: Widget[], targetArea: GridArea) => {
  return elements.some(el => isGridAreaColliding(targetArea, el.gridArea));
};

export const canFitWidget = (elements: Widget[], targetArea: GridArea, span: GridSpan) => {
  const { rowSpan, columnSpan } = span;
  if (!targetArea) return false;

  if (isOutOfBounds(targetArea, columnSpan, rowSpan)) {
    return false;
  }

  if (isCollidingWithOtherWidgets(elements, targetArea)) {
    return false;
  }

  return true;
};

export const canGridBeContracted = (direction: Direction, elements: Widget[], span: GridSpan) => {
  const { rowSpan, columnSpan } = span;
  if (direction === 'top') return !elements.some(el => el.gridArea.rowStart === 1) && rowSpan > 1;
  if (direction === 'bottom')
    return !elements.some(el => el.gridArea.rowEnd === rowSpan + 1) && rowSpan > 1;
  if (direction === 'left')
    return !elements.some(el => el.gridArea.columnStart === 1) && columnSpan > 1;
  if (direction === 'right')
    return !elements.some(el => el.gridArea.columnEnd === columnSpan + 1) && columnSpan > 1;
  return false;
};
