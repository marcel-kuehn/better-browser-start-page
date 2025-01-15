import { ReactNode, useEffect, useState } from "react";
import { AppsElement } from "./types";
import { AppsContext } from "./Context";
import { appsConfig } from "./config";

export const AppsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [elements, setElements] = useState<AppsElement[]>([]);

  useEffect(() => {
    setElements(appsConfig.elements);
  }, []);

  return (
    <AppsContext.Provider
      value={{
        elements,
      }}
    >
      {children}
    </AppsContext.Provider>
  );
};
