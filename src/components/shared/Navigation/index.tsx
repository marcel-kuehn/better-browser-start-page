import { useTranslation } from 'react-i18next';
import { PencilIcon, PencilOffIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import Sidebar from '../Sidebar';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';

export default function Navigation() {
  const { t } = useTranslation();
  const { isInEditMode, updateEditMode } = useAppConfig();

  return (
    <nav className="text-foreground fixed top-0 left-0 flex w-full items-center justify-center p-2">
      <div className="flex w-full items-center justify-between">
        <div></div>
        <div className="flex gap-1">
          <Button
            data-testid="edit-mode-toggle"
            variant="ghost"
            size="icon"
            onClick={() => updateEditMode(!isInEditMode)}
          >
            {isInEditMode ? (
              <PencilOffIcon aria-label={t('ui.stopEditing')} />
            ) : (
              <PencilIcon aria-label={t('ui.edit')} />
            )}
          </Button>
          <Sidebar />
        </div>
      </div>
    </nav>
  );
}
