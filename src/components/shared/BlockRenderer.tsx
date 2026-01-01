import { Block } from "@/types";
import { SearchWidget as SearchWidgetType } from "../blocks/SearchWidget/types";
import { AppsWidget as AppsWidgetType } from "../blocks/AppsWidget/types";
import { LinksWidget as LinksWidgetType } from "../blocks/LinksWidget/types";
import { ClockWidget as ClockWidgetType } from "../blocks/ClockWidget/types";
import { SearchWidget } from "../blocks/SearchWidget";
import { AppsWidget } from "../blocks/AppsWidget";
import { LinksWidget } from "../blocks/LinksWidget";
import { ClockWidget } from "../blocks/ClockWidget";
import { Grid as GridType } from "../blocks/Grid/types";
import Grid from "../blocks/Grid";
import { StopWatchWidget as StopWatchWidgetType } from "../blocks/StopWatchWidget/types";
import StopWatchWidget from "../blocks/StopWatchWidget";

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        if (block.type === "grid") {
          return <Grid {...(block as GridType)} />;
        }
        if (block.type === "search-widget") {
          return <SearchWidget {...(block as SearchWidgetType)} />;
        }
        if (block.type === "apps-widget") {
          return <AppsWidget {...(block as AppsWidgetType)} />;
        }
        if (block.type === "links-widget") {
          return <LinksWidget {...(block as LinksWidgetType)} />;
        }
        if (block.type === "clock-widget") {
          return <ClockWidget {...(block as ClockWidgetType)} />;
        }
        if (block.type === "stopwatch-widget") {
          return <StopWatchWidget {...(block as StopWatchWidgetType)} />;
        }
        return null;
      })}
    </>
  );
}
