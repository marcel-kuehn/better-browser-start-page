import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getWidgetOptions, getWidgetIcon, gridAreaToSpan } from './helpers';
import { useTranslation } from 'react-i18next';
import { WidgetSelectionDialogProps } from './types';
import WidgetOptionsList from './WidgetOptionsList';
import { createIsVariantDisabled } from '@/components/blocks/Grid/helpers';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { regenerateIds } from '@/lib/utils';
import ClipboardPasteButton from './ClipboardPasteButton';

export default function WidgetSelectionDialog({
  isOpen,
  onOpenChange,
  handleSelectWidget,
  handlePasteWidget,
  selectedCell,
  elements,
  gridSpan,
}: WidgetSelectionDialogProps) {
  const { t } = useTranslation();
  const { clipboard } = useAppConfig();
  const WIDGET_OPTIONS = getWidgetOptions(t);

  const isVariantDisabled = useMemo(
    () => createIsVariantDisabled(selectedCell, elements, gridSpan),
    [selectedCell, elements, gridSpan]
  );

  const clipboardSpan = clipboard ? gridAreaToSpan(clipboard.gridArea) : null;
  const ClipboardIcon = clipboard ? getWidgetIcon(clipboard.type) : null;
  const isClipboardSpanDisabled = clipboardSpan ? isVariantDisabled(clipboardSpan) : true;

  const handlePaste = () => {
    if (!clipboard || !clipboardSpan) return;
    const widgetWithNewIds = regenerateIds(clipboard);
    handlePasteWidget(widgetWithNewIds, clipboardSpan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('ui.addWidget')}</DialogTitle>
          <DialogDescription>{t('ui.pickWidget')}</DialogDescription>
        </DialogHeader>

        {clipboard && ClipboardIcon && clipboardSpan && (
          <ClipboardPasteButton
            clipboardIcon={ClipboardIcon}
            clipboardSpan={clipboardSpan}
            isDisabled={isClipboardSpanDisabled}
            onPaste={handlePaste}
            pasteLabel={t('ui.paste')}
            pasteFromClipboardLabel={t('ui.pasteFromClipboard')}
          />
        )}

        <WidgetOptionsList
          options={WIDGET_OPTIONS}
          onSelectWidget={handleSelectWidget}
          isVariantDisabled={isVariantDisabled}
        />
      </DialogContent>
    </Dialog>
  );
}
