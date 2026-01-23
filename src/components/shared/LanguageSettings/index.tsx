import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Language } from '@/types';
import { LANGUAGES } from '@/constants/languages';

export default function LanguageSettings() {
  const { t } = useTranslation();
  const { getLanguage, updateLanguage } = useAppConfig();

  const language = getLanguage();
  const languageSelectId = 'language';

  return (
    <div className="grid gap-3">
      <Label htmlFor={languageSelectId}>{t('ui.language')}</Label>
      <Select
        name={languageSelectId}
        value={language}
        onValueChange={value => {
          updateLanguage(value as Language);
        }}
      >
        <SelectTrigger data-testid="language-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(langValue => (
            <SelectItem
              key={langValue}
              value={langValue}
              data-testid={`language-option-${langValue}`}
            >
              {t(`languages.${langValue}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
