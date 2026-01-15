import { Button } from "@/components/ui/button";
import type { MigrationWidget } from "./types";
import { Widget } from "@/components/shared/Widget";
import { CogIcon } from "lucide-react";
import { migrateConfig } from "@/lib/migration";
import { useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";

export function MigrationWidget({ config, ...props }: MigrationWidget) {
  const [newConfig, setNewConfig] = useState<Record<string, unknown> | null>(
    null
  );

  const handleMigrate = () => {
    const migrated = migrateConfig(config);
    setNewConfig(migrated);
  };

  return (
    <Widget
      className="text-center flex justify-center items-center flex-col"
      {...props}
    >
      {newConfig ? (
        <>
          <h2 className="text-2xl mb-2 font-bold text-foreground">Migration</h2>
          <p className="text-foreground">
            Your configuration has been migrated to the latest version.
            <br />
            Please replace your old config with the new one below:
          </p>
          <pre className="text-left mt-4 p-4 bg-muted rounded w-full h-64 overflow-auto text-sm">
            {JSON.stringify(newConfig, null, 2)}
          </pre>
          <CopyButton textToCopy={JSON.stringify(newConfig, null, 2)}>
            Copy Migrated Configuration
          </CopyButton>
        </>
      ) : (
        <>
          <h2 className="text-2xl mb-2 font-bold text-foreground">Migration</h2>
          <p className="text-foreground">
            Your current configuration is outdated. <br />
            Please back it up then click on migrate.
          </p>
          <Button className="mt-4" onClick={handleMigrate}>
            <CogIcon />
            Migrate to the latest version
          </Button>
        </>
      )}
    </Widget>
  );
}
