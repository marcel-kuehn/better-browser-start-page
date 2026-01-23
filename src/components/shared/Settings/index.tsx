import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import BackgroundSettings from '../BackgroundSettings';
import ConfigExport from '../ConfigExport';
import ConfigImport from '../ConfigImport';
import LanguageSettings from '../LanguageSettings';
import ThemeSettings from '../ThemeSettings';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="appearance" className="flex-1">
      <TabsList className="grid w-full grid-cols-2" data-testid="settings-tabs">
        <TabsTrigger value="appearance" data-testid="settings-tab-appearance">
          {t('ui.settingsTabs.appearance')}
        </TabsTrigger>
        <TabsTrigger value="data" data-testid="settings-tab-data">
          {t('ui.settingsTabs.data')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="appearance" className="grid auto-rows-min gap-6">
        <Separator />
        <ThemeSettings />
        <Separator />
        <LanguageSettings />
        <Separator />
        <BackgroundSettings />
        <Separator />
      </TabsContent>
      <TabsContent value="data" className="grid auto-rows-min gap-6">
        <Separator />
        <ConfigImport />
        <Separator />
        <ConfigExport />
        <Separator />
      </TabsContent>
    </Tabs>
  );
}
