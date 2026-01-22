import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { useState, ChangeEvent } from 'react';
import { parseConfigFile } from './helpers';
import { FILE_ACCEPT_TYPE, FILE_UPLOAD_ID } from './constants';
import type { UploadedConfig } from './types';

export default function ConfigImportSettings() {
  const { t } = useTranslation();
  const { updateConfig } = useAppConfig();
  const [uploadedConfig, setUploadedConfig] = useState<UploadedConfig>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const json = await parseConfigFile(file);
      setUploadedConfig(json);
    } catch (error) {
      console.error('Invalid JSON file', error);
      alert(t('errors.parseConfigFailed'));
      setUploadedConfig(null);
    }
  };

  const handleSave = () => {
    if (uploadedConfig) {
      updateConfig(uploadedConfig);
      setUploadedConfig(null);
    }
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={FILE_UPLOAD_ID} className="font-medium">
        {t('ui.importConfig')}
      </Label>
      <Input
        id={FILE_UPLOAD_ID}
        type="file"
        accept={FILE_ACCEPT_TYPE}
        onChange={handleFileChange}
      />
      <Button
        variant="destructive"
        onClick={handleSave}
        disabled={!uploadedConfig}
        className="w-full"
      >
        {t('ui.replaceConfig')}
      </Button>
    </div>
  );
}
