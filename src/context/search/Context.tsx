import { createContext, useContext } from "react";
import { SearchContextProps } from "./types";

export const SearchContext = createContext<SearchContextProps | undefined>(
  undefined
);

export const useSearchContext = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      "useLinkCollections must be used within a LinkCollectionsProvider"
    );
  }
  return context;
};
