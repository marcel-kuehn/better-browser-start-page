import { Separator } from '../../ui/separator';
import BackgroundSettings from '../BackgroundSettings';
import ConfigExport from '../ConfigExport';
import ConfigImport from '../ConfigImport';
import LanguageSettings from '../LanguageSettings';
import ThemeSettings from '../ThemeSettings';

export default function Settings() {
  return (
    <div className="grid flex-1 auto-rows-min gap-6">
      <Separator />
      <ThemeSettings />
      <Separator />
      <LanguageSettings />
      <Separator />
      <BackgroundSettings />
      <Separator />
      <ConfigImport />
      <Separator />
      <ConfigExport />
      <Separator />
    </div>
  );
}
