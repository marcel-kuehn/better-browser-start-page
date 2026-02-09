import type { Widget as WidgetType } from '@/types';

export interface WidgetProps extends WidgetType {
  children?: React.ReactNode;
  className?: string;
}

export interface CopyWidgetButtonProps {
  widget: WidgetType;
}
