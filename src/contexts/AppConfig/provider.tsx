import { useState, useEffect, ReactNode } from 'react';
import { INITIAL_CONFIG } from './initialState';
import { AppConfig, Block, Language, Theme } from '@/types';
import { AppConfigContext } from './context';
import { isLatestConfigVersion, migrateConfig } from '@/lib/migration';
import { LOCAL_STORAGE_KEY } from './constants';
import i18n from '@/i18n/config';

const getSecureConfig = (config: Record<string, unknown>) => {
  const version = (config as { _v?: string })._v ?? '0.0.0';
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
        console.error('Failed to parse config', e);
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
      getSecureConfig(config as unknown as Record<string, unknown>) as unknown as AppConfig
    );
  };

  const updateTheme = (theme: Theme) => {
    setConfig(prev => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  };

  const getTheme = (): Theme => {
    return config.settings.theme;
  };

  const updateCustomBackground = (image: string | null) => {
    setConfig(prev => ({
      ...prev,
      settings: { ...prev.settings, customBackgroundImage: image },
    }));
  };

  const getCustomBackground = (): string | null => {
    return config.settings.customBackgroundImage ?? null;
  };

  const updateLanguage = (language: Language) => {
    setConfig(prev => ({
      ...prev,
      settings: { ...prev.settings, language },
    }));
    i18n.changeLanguage(language);
  };

  const getLanguage = (): Language => {
    return config.settings.language;
  };

  // Sync i18n language with config on mount and when language changes
  useEffect(() => {
    if (config.settings.language && i18n.language !== config.settings.language) {
      i18n.changeLanguage(config.settings.language);
    }
  }, [config.settings.language]);

  const updateEditMode = (isInEditMode: boolean) => {
    setIsInEditMode(isInEditMode);
  };

  const updateElementById = (id: string, updatedData: Partial<Block>) => {
    const updateRecursive = (blocks: Block[]): Block[] => {
      return blocks.map(block => {
        if (block.id === id) {
          return { ...block, ...updatedData };
        }
        if (block.elements && Array.isArray(block.elements)) {
          return {
            ...block,
            elements: updateRecursive(block.elements as Block[]),
          };
        }
        return block;
      });
    };

    setConfig(prev => ({
      ...prev,
      elements: updateRecursive(prev.elements),
    }));
  };

  /**
   * Recursive function to remove a block by its ID.
   * It filters the current array and then maps through the remaining blocks
   * to check their children.
   */
  const removeElementById = (id: string) => {
    const removeRecursive = (blocks: Block[]): Block[] => {
      return blocks
        .filter(block => block.id !== id) // Remove the block if found
        .map(block => {
          // If the block has children, search and remove within them too
          if (block.elements && Array.isArray(block.elements)) {
            return {
              ...block,
              elements: removeRecursive(block.elements as Block[]),
            };
          }
          return block;
        });
    };

    setConfig(prev => ({
      ...prev,
      elements: removeRecursive(prev.elements),
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
        updateCustomBackground,
        getCustomBackground,
        updateLanguage,
        getLanguage,
        updateElementById,
        removeElementById,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
