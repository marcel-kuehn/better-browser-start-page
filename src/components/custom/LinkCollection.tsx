import { LinkCollection as LinkCollectionType } from "@/context/links";
import clsx from "clsx";
import { buttonVariants } from "@/components/ui/button";
import LogoLoader from "@/components/custom/LogoLoader";
import { Card } from "@/components/ui/card";

export function LinkCollection({
  collection,
}: {
  collection: LinkCollectionType;
}) {
  return (
    <Card className="w-full px-4 py-6 flex flex-col gap-4 flex-1">
      <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
        {collection.name}
      </h3>
      <ul className="flex flex-col -mx-2">
        {collection.elements.map((element) => (
          <li key={element.url}>
            <a
              href={element.url}
              rel="noopener noreferrer"
              className={clsx(
                buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "w-full !justify-start",
                })
              )}
            >
              <LogoLoader url={element.url} className="w-4 h-4" />

              <span className="leading-none text-sm text-card-foreground">
                {element.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
