import { GridSpan } from '@/components/blocks/Grid/types';
import { LucideIcon } from 'lucide-react';

export type SelectWidgetHandler = (type: string, span: GridSpan) => void;

export interface WidgetSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleSelectWidget: SelectWidgetHandler;
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
}

export interface WidgetOptionCardProps {
  option: WidgetOption;
  onSelectWidget: SelectWidgetHandler;
}

export interface WidgetVariantButtonsProps {
  type: string;
  variants: WidgetOption['variants'];
  onSelectWidget: SelectWidgetHandler;
}
