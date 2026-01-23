import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LucideIcon } from 'lucide-react';
import { GridSpan } from '@/components/blocks/Grid/types';

export interface ClipboardPasteButtonProps {
  clipboardIcon: LucideIcon;
  clipboardSpan: GridSpan | null;
  isDisabled: boolean;
  onPaste: () => void;
  pasteLabel: string;
  pasteFromClipboardLabel: string;
}

export default function ClipboardPasteButton({
  clipboardIcon: ClipboardIcon,
  clipboardSpan,
  isDisabled,
  onPaste,
  pasteLabel,
  pasteFromClipboardLabel,
}: ClipboardPasteButtonProps) {
  if (!clipboardSpan) return null;

  return (
    <>
      <div className="border-input bg-muted/50 flex items-center gap-4 rounded-xl border p-4">
        <div className="bg-primary rounded-lg p-2">
          <ClipboardIcon className="text-primary-foreground h-5 w-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-foreground mb-1 text-sm leading-none font-bold">
            {pasteFromClipboardLabel}
          </span>
          <span className="text-muted-foreground text-xs">
            {clipboardSpan.rowSpan}x{clipboardSpan.columnSpan}
          </span>
        </div>
        <Button size="sm" onClick={onPaste} disabled={isDisabled} data-testid="paste-widget-button">
          {pasteLabel}
        </Button>
      </div>
      <Separator />
    </>
  );
}
