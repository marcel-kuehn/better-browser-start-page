import { useState, useEffect, ReactNode } from "react";
import { INITIAL_CONFIG } from "./initialState";
import { AppConfig, Theme } from "@/types";
import { AppConfigContext } from "./context";
import { isLatestConfigVersion, migrateConfig } from "@/lib/migration";

const LOCAL_STORAGE_KEY = "app_config";

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from LocalStorage or fallback to Default
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        let config = JSON.parse(saved);

        const version = (config as { _v?: string })._v ?? "0.0.0";
        const needsMigration = !isLatestConfigVersion(version);
        if (needsMigration) {
          config = migrateConfig(config);
        }

        return config;
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
    return INITIAL_CONFIG;
  });

  // Sync to LocalStorage whenever config changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Helper to update deeply nested settings or top-level keys
  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateTheme = (theme: Theme) => {
    console.log("SET THEME", theme);
    setConfig((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  };

  const getTheme = (): Theme => {
    return config.settings.theme;
  };

  return (
    <AppConfigContext.Provider
      value={{ config, updateConfig, updateTheme, getTheme }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
