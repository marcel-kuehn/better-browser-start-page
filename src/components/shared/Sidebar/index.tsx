import { useTranslation } from 'react-i18next';
import { SettingsIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet';
import Settings from '../Settings';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button data-testid="settings-trigger" variant="ghost" size="icon">
          <SettingsIcon aria-label={t('ui.settings')} />
        </Button>
      </SheetTrigger>

      <SheetContent data-testid="settings-sidebar">
        <SheetHeader>
          <SheetTitle>{t('ui.settings')}</SheetTitle>
        </SheetHeader>

        <Settings />

        <SheetFooter>
          <SheetClose asChild>
            <Button data-testid="settings-close" variant="outline">
              {t('ui.close')}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
