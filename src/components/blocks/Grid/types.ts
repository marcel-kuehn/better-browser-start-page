import { Block, Widget } from '@/types';

export interface GridSpan {
  rowSpan: number;
  columnSpan: number;
}

export interface Grid extends Block {
  type: 'grid';
  span: GridSpan;
  elements: Widget[];
}

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export interface GridControlProps {
  onExpand: () => void;
  onContract: () => void;
  canContract: boolean;
  direction: Direction;
}

export interface CellPosition {
  row: number;
  column: number;
}
