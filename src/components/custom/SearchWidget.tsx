import { useSearchContext } from "@/context/search";
import { getDomain, openUrl } from "@/lib/url";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { replacePlaceholder } from "@/lib/string";
import LogoLoader from "@/components/custom/LogoLoader";
import { Widget } from "@/components/custom/Widget";

export function SearchWidget() {
  const { elements } = useSearchContext();
  const [selectedElement, setSelectedElement] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const hasElements = useMemo(() => elements.length > 0, [elements]);
  const hasMultipleElements = useMemo(() => elements.length > 1, [elements]);

  useEffect(() => {
    setSelectedElement(elements[0]?.url);
  }, [elements]);

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
                <LogoLoader
                  url={element.url}
                  customLogoUrl={element.customLogoUrl}
                  className="w-6 h-6"
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
            <Button type="submit" size="icon">
              <SearchIcon />
            </Button>
          </div>
        </div>
      </form>
    </Widget>
  );
}
