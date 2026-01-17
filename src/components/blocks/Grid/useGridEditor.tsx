import { Widget, Block } from '@/types'

type Direction = 'top' | 'bottom' | 'left' | 'right'

export function useGridEditor(
  id: string,
  rows: number,
  columns: number,
  elements: Widget[],
  updateElementById: (id: string, data: Partial<Block>) => void
) {
  const expandGrid = (direction: Direction) => {
    let newRows = rows
    let newColumns = columns

    const updatedElements = elements.map(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea
      if (direction === 'top') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            rowStart: rowStart + 1,
            rowEnd: rowEnd + 1,
          },
        }
      }
      if (direction === 'left') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            columnStart: columnStart + 1,
            columnEnd: columnEnd + 1,
          },
        }
      }
      return el
    })

    if (direction === 'top' || direction === 'bottom') newRows += 1
    else newColumns += 1

    updateElementById(id, {
      rows: newRows,
      columns: newColumns,
      elements: updatedElements,
    })
  }

  const contractGrid = (direction: Direction) => {
    const isOccupied = elements.some(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea
      if (direction === 'top') return rowStart === 1
      if (direction === 'bottom') return rowEnd === rows + 1
      if (direction === 'left') return columnStart === 1
      if (direction === 'right') return columnEnd === columns + 1
      return false
    })

    if (isOccupied) {
      alert(`Cannot contract ${direction}: The row/column contains widgets.`)
      return
    }

    if (
      ((direction === 'top' || direction === 'bottom') && rows <= 1) ||
      ((direction === 'left' || direction === 'right') && columns <= 1)
    )
      return

    const updatedElements = elements.map(el => {
      const { rowStart, rowEnd, columnStart, columnEnd } = el.gridArea
      if (direction === 'top') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            rowStart: rowStart - 1,
            rowEnd: rowEnd - 1,
          },
        }
      }
      if (direction === 'left') {
        return {
          ...el,
          gridArea: {
            ...el.gridArea,
            columnStart: columnStart - 1,
            columnEnd: columnEnd - 1,
          },
        }
      }
      return el
    })

    const newRows = direction === 'top' || direction === 'bottom' ? rows - 1 : rows
    const newCols = direction === 'left' || direction === 'right' ? columns - 1 : columns

    updateElementById(id, {
      rows: newRows,
      columns: newCols,
      elements: updatedElements,
    })
  }

  return { expandGrid, contractGrid }
}
