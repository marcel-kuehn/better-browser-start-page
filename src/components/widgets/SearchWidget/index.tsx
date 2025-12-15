import { getDomain, openUrl } from "@/lib/url";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { replacePlaceholder } from "@/lib/string";
import type { SearchWidget } from "./types";
import { Widget } from "@/components/shared/Widget";
import FaviconLoader from "@/components/shared/FaviconLoader";

export function SearchWidget({ elements }: SearchWidget) {
  const [selectedElement, setSelectedElement] = useState<string>(
    elements[0]?.url ?? ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const hasElements = useMemo(() => elements.length > 0, [elements]);
  const hasMultipleElements = useMemo(() => elements.length > 1, [elements]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchUrl = replacePlaceholder(
      selectedElement ?? "",
      "query",
      searchQuery
    );
    setSearchQuery("");
    openUrl(searchUrl);
  };

  if (!hasElements) return null;

  return (
    <Widget className="flex justify-center">
      <form
        className="flex flex-col gap-4 justify-center max-w-xl w-full"
        onSubmit={onSubmit}
      >
        {hasMultipleElements && (
          <ToggleGroup
            type="single"
            variant="outline"
            value={selectedElement}
            onValueChange={setSelectedElement}
          >
            {elements.map((element) => (
              <ToggleGroupItem key={element.url} value={element.url}>
                <FaviconLoader
                  url={element.url}
                  faviconUrl={element.faviconUrl}
                  className="w-6 h-6 [[data-state=on]_&]:text-primary-foreground"
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={`Search ${getDomain(selectedElement)}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div>
            <Button type="submit" size="icon" disabled={!selectedElement}>
              <SearchIcon />
            </Button>
          </div>
        </div>
      </form>
    </Widget>
  );
}
