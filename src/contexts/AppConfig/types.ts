import { AppConfig, Theme } from "@/types";

export interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateTheme: (theme: Theme) => void;
  getTheme: () => Theme;
}
