import { createContext, useContext } from "react";
import { LinksContextProps } from "./types";

export const LinksContext = createContext<LinksContextProps | undefined>(
  undefined
);

export const useLinksContext = (): LinksContextProps => {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error(
      "useLinkCollections must be used within a LinkCollectionsProvider"
    );
  }
  return context;
};
