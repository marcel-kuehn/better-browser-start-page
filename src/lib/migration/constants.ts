import { migrateToVersion_0_0_1 } from "./scripts/0.0.1";
import { MigrationFunction } from "./types";

export const CONFIG_VERSION_ORDER = ["0.0.0", "0.0.1"];
export const STARTER_CONFIG_VERSION = CONFIG_VERSION_ORDER[0];

export const CONFIG_VERSION_MIGRATIONS: Record<string, MigrationFunction> = {
  "0.0.1": migrateToVersion_0_0_1,
};
