import { Widget, Block } from '@/types';
import { GridSpan } from './types';

type Direction = 'top' | 'bottom' | 'left' | 'right';

export function useGridEditor(
  id: string,
  span: GridSpan,
  elements: Widget[],
  updateElementById: (id: string, data: Partial<Block>) => void
) {
  const { rowSpan, columnSpan } = span;

  const expandGrid = (direction: Direction) => {
    let newRows = rowSpan;
    let newColumns = columnSpan;

    const updatedElements = elements.map(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea;
      if (direction === 'top') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            rowStart: rowStart + 1,
            rowEnd: rowEnd + 1,
          },
        };
      }
      if (direction === 'left') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            columnStart: columnStart + 1,
            columnEnd: columnEnd + 1,
          },
        };
      }
      return el;
    });

    if (direction === 'top' || direction === 'bottom') newRows += 1;
    else newColumns += 1;

    updateElementById(id, {
      span: {
        rowSpan: newRows,
        columnSpan: newColumns,
      },
      elements: updatedElements,
    });
  };

  const contractGrid = (direction: Direction) => {
    const isOccupied = elements.some(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea;
      if (direction === 'top') return rowStart === 1;
      if (direction === 'bottom') return rowEnd === rowSpan + 1;
      if (direction === 'left') return columnStart === 1;
      if (direction === 'right') return columnEnd === columnSpan + 1;
      return false;
    });

    if (isOccupied) {
      alert(`Cannot contract ${direction}: The row/column contains widgets.`);
      return;
    }

    if (
      ((direction === 'top' || direction === 'bottom') && rowSpan <= 1) ||
      ((direction === 'left' || direction === 'right') && columnSpan <= 1)
    )
      return;

    const updatedElements = elements.map(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea;
      if (direction === 'top') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            rowStart: rowStart - 1,
            rowEnd: rowEnd - 1,
          },
        };
      }
      if (direction === 'left') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            columnStart: columnStart - 1,
            columnEnd: columnEnd - 1,
          },
        };
      }
      return el;
    });

    const newRows = direction === 'top' || direction === 'bottom' ? rowSpan - 1 : rowSpan;
    const newCols = direction === 'left' || direction === 'right' ? columnSpan - 1 : columnSpan;

    updateElementById(id, {
      span: {
        rowSpan: newRows,
        columnSpan: newCols,
      },
      elements: updatedElements,
    });
  };

  return { expandGrid, contractGrid };
}
