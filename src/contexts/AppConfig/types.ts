import { AppConfig, Block, Language, Theme, Widget } from '@/types';

export interface AppConfigContextType {
  config: AppConfig;
  isInEditMode: boolean;
  clipboard: Widget | null;
  updateConfig: (config: AppConfig | Record<string, unknown>) => void;
  updateTheme: (theme: Theme) => void;
  updateEditMode: (isInEditMode: boolean) => void;
  updateElementById: (id: string, element: Partial<Block>) => void;
  removeElementById: (id: string) => void;
  getTheme: () => Theme;
  updateCustomBackground: (image: string | null) => void;
  getCustomBackground: () => string | null;
  updateLanguage: (language: Language) => void;
  getLanguage: () => Language;
  copyWidget: (widget: Widget) => void;
  clearClipboard: () => void;
}
