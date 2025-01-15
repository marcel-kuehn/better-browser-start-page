import { ReactNode, useEffect, useState } from "react";
import { LinkCollection } from "./types";
import { LinksContext } from "./Context";
import { linksConfig } from "./config";
import { replacePlaceholder } from "@/lib/string";

const nurtureLinks = (
  collections: LinkCollection[],
  variables: Record<string, string>
) => {
  return collections.map((collection) => ({
    ...collection,
    elements: collection.elements.map((element) => ({
      ...element,
      url: Object.keys(variables).reduce((acc, key) => {
        return replacePlaceholder(acc, key, variables[key]);
      }, element.url),
    })),
  }));
};

export const LinksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<LinkCollection[]>([]);

  useEffect(() => {
    setCollections(
      nurtureLinks(linksConfig.collections, linksConfig.variables)
    );
  }, []);

  return (
    <LinksContext.Provider
      value={{
        variables: linksConfig.variables,
        collections: collections,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
};
