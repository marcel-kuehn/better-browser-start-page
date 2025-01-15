import { ReactNode, useEffect, useState } from "react";
import { SearchElement } from "./types";
import { SearchContext } from "./Context";
import { searchConfig } from "./config";

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [elements, setElements] = useState<SearchElement[]>([]);

  useEffect(() => {
    setElements(searchConfig.elements);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        elements,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
