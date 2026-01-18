import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useState, ChangeEvent } from 'react';

export default function ConfigImportSettings() {
  const { updateConfig } = useAppConfig();
  // We store the parsed object or null
  const [uploadedConfig, setUploadedConfig] = useState<Record<string, unknown> | null>(null);
  const fileUploadId = 'file';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setUploadedConfig(json);
      } catch (error) {
        console.error('Invalid JSON file', error);
        alert('Failed to parse config. Please upload a valid JSON file.');
        setUploadedConfig(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (uploadedConfig) {
      updateConfig(uploadedConfig);
      setUploadedConfig(null);
    }
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={fileUploadId} className="font-medium">
        Import configuration
      </Label>
      <Input id={fileUploadId} type="file" accept=".json" onChange={handleFileChange} />
      <Button
        variant="destructive"
        onClick={handleSave}
        disabled={!uploadedConfig}
        className="w-full"
      >
        Replace current config with uploaded config
      </Button>
    </div>
  );
}
