import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getWidgetOptions } from './helpers';
import { useTranslation } from 'react-i18next';
import { WidgetSelectionDialogProps } from './types';
import WidgetOptionsList from './WidgetOptionsList';

export default function WidgetSelectionDialog({
  isOpen,
  onOpenChange,
  handleSelectWidget,
}: WidgetSelectionDialogProps) {
  const { t } = useTranslation();
  const WIDGET_OPTIONS = getWidgetOptions(t);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('ui.addWidget')}</DialogTitle>
          <DialogDescription>{t('ui.pickWidget')}</DialogDescription>
        </DialogHeader>
        <WidgetOptionsList options={WIDGET_OPTIONS} onSelectWidget={handleSelectWidget} />
      </DialogContent>
    </Dialog>
  );
}
