import { CellPosition, GridSpan } from '@/components/blocks/Grid/types';
import { Widget } from '@/types';
import { LucideIcon } from 'lucide-react';

export type SelectWidgetHandler = (type: string, span: GridSpan) => void;

export type IsVariantDisabled = (variant: GridSpan) => boolean;

export interface WidgetSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleSelectWidget: SelectWidgetHandler;
  selectedCell: CellPosition | null;
  elements: Widget[];
  gridSpan: GridSpan;
}

export type WidgetOption = {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
  variants: GridSpan[];
};

export interface WidgetOptionsListProps {
  options: WidgetOption[];
  onSelectWidget: SelectWidgetHandler;
  isVariantDisabled: IsVariantDisabled;
}

export interface WidgetOptionCardProps {
  option: WidgetOption;
  onSelectWidget: SelectWidgetHandler;
  isVariantDisabled: IsVariantDisabled;
}

export interface WidgetVariantButtonsProps {
  type: string;
  variants: WidgetOption['variants'];
  onSelectWidget: SelectWidgetHandler;
  isVariantDisabled: IsVariantDisabled;
}
