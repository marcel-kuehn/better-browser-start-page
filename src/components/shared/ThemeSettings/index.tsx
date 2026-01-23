import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Theme } from '@/types';
import { THEME_GLASSMORPHISM, THEMES } from '@/constants/themes';

export default function ThemeSettings() {
  const { t } = useTranslation();
  const { getTheme, updateTheme } = useAppConfig();

  const theme = getTheme();
  const themeSelectId = 'theme';

  return (
    <div className="grid gap-3">
      <Label htmlFor={themeSelectId}>{t('ui.theme')}</Label>
      <Select
        name={themeSelectId}
        value={theme}
        onValueChange={value => {
          updateTheme(value as Theme);
        }}
      >
        <SelectTrigger data-testid="theme-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEMES.map(themeValue => (
            <SelectItem key={themeValue} value={themeValue}>
              {themeValue === THEME_GLASSMORPHISM
                ? t('themes.glassmorphism')
                : t('themes.glassmorphismDark')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
