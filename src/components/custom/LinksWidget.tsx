import { useLinksContext } from "@/context/links";
import { LinkCollection } from "./LinkCollection";
import { Widget } from "@/components/custom/Widget";
import { useMemo } from "react";

export function LinksWidget() {
  const { collections } = useLinksContext();
  const hasElements = useMemo(
    () => collections.some((collection) => collection.elements.length > 0),
    [collections]
  );

  if (!hasElements) return null;

  return (
    <Widget className="flex gap-4">
      {collections.map((collection) => (
        <LinkCollection key={collection.name} collection={collection} />
      ))}
    </Widget>
  );
}
