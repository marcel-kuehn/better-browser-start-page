import { useAppsContext } from "@/context/apps";
import { buttonVariants } from "@/components/ui/button";
import clsx from "clsx";
import LogoLoader from "@/components/custom/LogoLoader";
import { Widget } from "@/components/custom/Widget";
import { useMemo } from "react";

export function AppsWidget() {
  const { elements } = useAppsContext();
  const hasElements = useMemo(() => elements.length > 0, [elements]);

  if (!hasElements) return null;

  return (
    <Widget className="flex gap-4 justify-center max-w-full overflow-hidden flex-wrap">
      {elements.map((element) => (
        <a
          href={element.url}
          key={element.url}
          rel="noopener noreferrer"
          className={clsx([
            "w-16 min-w-16 h-16 min-h-16",
            buttonVariants({ variant: "outline" }),
          ])}
        >
          <LogoLoader
            url={element.url}
            customLogoUrl={element.customLogoUrl}
            className="w-6 h-6"
          />
        </a>
      ))}
    </Widget>
  );
}
