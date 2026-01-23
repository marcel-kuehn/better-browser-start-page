import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { ChangeEvent } from 'react';
import { IMAGE_ACCEPT_TYPES, IMAGE_UPLOAD_ID, MAX_FILE_SIZE_MB } from './constants';
import { convertFileToBase64, isValidImageFile, isFileSizeValid } from './helpers';

export default function BackgroundSettings() {
  const { t } = useTranslation();
  const { getCustomBackground, updateCustomBackground } = useAppConfig();

  const customBackground = getCustomBackground();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert(t('errors.invalidImageType'));
      e.target.value = '';
      return;
    }

    if (!isFileSizeValid(file)) {
      alert(t('errors.imageTooLarge', { maxSize: MAX_FILE_SIZE_MB }));
      e.target.value = '';
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      updateCustomBackground(base64);
    } catch (error) {
      console.error('Failed to convert image to base64', error);
      alert(t('errors.imageUploadFailed'));
    }

    e.target.value = '';
  };

  const handleClear = () => {
    updateCustomBackground(null);
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={IMAGE_UPLOAD_ID} className="font-medium">
        {t('ui.customBackground')}
      </Label>

      {customBackground && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          <img
            src={customBackground}
            alt={t('ui.customBackgroundPreview')}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <Input
        id={IMAGE_UPLOAD_ID}
        type="file"
        accept={IMAGE_ACCEPT_TYPES}
        onChange={handleFileChange}
      />

      {customBackground && (
        <Button variant="destructive" onClick={handleClear} className="w-full">
          {t('ui.clearBackground')}
        </Button>
      )}
    </div>
  );
}
