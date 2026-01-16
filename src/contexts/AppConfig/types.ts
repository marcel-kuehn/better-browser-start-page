import { AppConfig, Block, Theme } from "@/types";

export interface AppConfigContextType {
  config: AppConfig;
  isInEditMode: boolean;
  updateConfig: (config: AppConfig | Record<string, unknown>) => void;
  updateTheme: (theme: Theme) => void;
  updateEditMode: (isInEditMode: boolean) => void;
  updateElementById: (id: string, element: Partial<Block>) => void;
  removeElementById: (id: string) => void;
  getTheme: () => Theme;
}
