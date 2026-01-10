import { Widget } from "@/types";

export interface MigrationWidget extends Widget {
  type: "migration-widget";
  config: Record<string, unknown>;
}
