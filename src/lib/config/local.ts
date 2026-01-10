import appJson from "../../../app.config.json";

const appConfig = appJson as Record<string, unknown>;

export const getLocalConfig = (): Record<string, unknown> => {
  return appConfig;
};
