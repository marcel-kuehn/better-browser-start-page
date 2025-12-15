import { Card } from "@/components/ui/card";
import type { LinkCollection } from "./types";
import LinkCollectionElement from "./LinkCollectionElement";

export function LinkCollection({ elements, title }: LinkCollection) {
  return (
    <Card className="w-full px-4 py-6 flex flex-col gap-4 flex-1">
      <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
        {title}
      </h3>
      <ul className="flex flex-col -mx-2">
        {elements.map((element) => (
          <li key={element.url}>
            <LinkCollectionElement {...element} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
