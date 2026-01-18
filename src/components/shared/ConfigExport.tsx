import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { CopyButton } from './CopyButton';
import { Label } from '../ui/label';

export default function ConfigExport() {
  const { t } = useTranslation();
  const { config } = useAppConfig();

  return (
    <div className="grid gap-3">
      <Label className="font-medium">{t('ui.exportConfig')}</Label>
      <CopyButton textToCopy={JSON.stringify(config, null, 2)}>{t('ui.copyConfig')}</CopyButton>
    </div>
  );
}
