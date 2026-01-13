import { AppConfig } from "@/types";
import { getLocalConfig } from "./local";

export const loadConfig = (method: "local"): AppConfig => {
  if (method === "local") {
    return getLocalConfig() as unknown as AppConfig;
  }

  throw new Error(`Unsupported config load method: ${method}`);
};
