export type MigrationFunction = (
  oldConfig: Record<string, unknown>,
  cb?: MigrationFunction
) => Record<string, unknown>
