import { Widget } from "@/components/shared/Widget";
import type { AppsWidget } from "./types";
import AppLink from "./AppLink";

export function AppsWidget({ elements }: AppsWidget) {
  const hasElements = elements.length > 0;

  if (!hasElements) return null;

  return (
    <Widget className="flex gap-4 justify-center max-w-full overflow-hidden flex-wrap">
      {elements.map((element) => (
        <AppLink key={element.url} {...element} />
      ))}
    </Widget>
  );
}
