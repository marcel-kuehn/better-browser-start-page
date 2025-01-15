import { createContext, useContext } from "react";
import { AppsContextProps } from "./types";

export const AppsContext = createContext<AppsContextProps | undefined>(
  undefined
);

export const useAppsContext = (): AppsContextProps => {
  const context = useContext(AppsContext);
  if (!context) {
    throw new Error("useAppsContext must be used within a AppsContextProvider");
  }
  return context;
};
