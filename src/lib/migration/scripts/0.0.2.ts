import { MigrationFunction } from "../types";

export const migrateToVersion_0_0_2: MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
): Record<string, unknown> => {
  const newConfig = {
    ...oldConfig,
    _v: "0.0.2",
    settings: {
      theme: "glassmorphism",
    },
  };

  return cb ? cb(newConfig) : newConfig;
};
