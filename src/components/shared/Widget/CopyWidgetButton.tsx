import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { useTranslation } from 'react-i18next';
import type { CopyWidgetButtonProps } from './types';

export function CopyWidgetButton({ widget }: CopyWidgetButtonProps) {
  const { copyWidget } = useAppConfig();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = () => {
    copyWidget(widget);

    setCopied(true);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-5 w-5"
      onClick={handleCopy}
      aria-label={copied ? t('ui.copiedWidget') : t('ui.copyWidget')}
      data-testid="copy-widget-button"
      data-state={copied ? 'copied' : 'default'}
    >
      {copied ? <Check className="h-2 w-2" /> : <Copy className="h-2 w-2" />}
    </Button>
  );
}
