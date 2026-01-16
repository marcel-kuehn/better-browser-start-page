import { useState, useEffect, ReactNode } from "react";
import { INITIAL_CONFIG } from "./initialState";
import { AppConfig, Block, Theme } from "@/types";
import { AppConfigContext } from "./context";
import { isLatestConfigVersion, migrateConfig } from "@/lib/migration";

const LOCAL_STORAGE_KEY = "app_config";

const getSecureConfig = (config: Record<string, unknown>) => {
  const version = (config as { _v?: string })._v ?? "0.0.0";
  const needsMigration = !isLatestConfigVersion(version);
  if (needsMigration) {
    config = migrateConfig(config);
  }

  return config;
};

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from LocalStorage or fallback to Default
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);

        return getSecureConfig(config) as unknown as AppConfig;
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
    return INITIAL_CONFIG;
  });

  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);

  // Sync to LocalStorage whenever config changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Helper to update deeply nested settings or top-level keys
  const updateConfig = (config: AppConfig | Record<string, unknown>) => {
    setConfig(
      getSecureConfig(
        config as unknown as Record<string, unknown>
      ) as unknown as AppConfig
    );
  };

  const updateTheme = (theme: Theme) => {
    setConfig((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  };

  const getTheme = (): Theme => {
    return config.settings.theme;
  };

  const updateEditMode = (isInEditMode: boolean) => {
    setIsInEditMode(isInEditMode);
  };

  const updateElementById = (id: string, updatedData: Partial<Block>) => {
    const updateRecursive = (blocks: Block[]): Block[] => {
      return blocks.map((block) => {
        // 1. If we found the match, apply the update
        if (block.id === id) {
          return { ...block, ...updatedData };
        }

        // 2. Look for children in the 'elements' property
        // We check if it exists and is an array to handle nested grids/widgets
        if (block.elements && Array.isArray(block.elements)) {
          return {
            ...block,
            elements: updateRecursive(block.elements as Block[]),
          };
        }

        return block;
      });
    };

    setConfig((prev) => ({
      ...prev,
      elements: updateRecursive(prev.elements),
    }));
  };

  return (
    <AppConfigContext.Provider
      value={{
        config,
        isInEditMode,
        updateEditMode,
        updateConfig,
        updateTheme,
        getTheme,
        updateElementById,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
