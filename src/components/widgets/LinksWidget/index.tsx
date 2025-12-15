import { LinkCollection } from "./LinkCollection";
import { Widget } from "@/components/shared/Widget";
import type { LinksWidget } from "./types";

export function LinksWidget({ collections }: LinksWidget) {
  const hasElements = collections.some(
    (collection) => collection.elements.length > 0
  );

  if (!hasElements) return null;

  return (
    <Widget className="grid grid-cols-4 gap-4">
      {collections.map((collection) => (
        <LinkCollection key={collection.title} {...collection} />
      ))}
    </Widget>
  );
}
