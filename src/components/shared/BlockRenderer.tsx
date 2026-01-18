import { Block } from '@/types';
import {
  WIDGET_TYPE_GRID,
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_APPS,
  WIDGET_TYPE_LINKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_STOPWATCH,
} from '@/constants/widgetTypes';
import { SearchWidget as SearchWidgetType } from '../blocks/SearchWidget/types';
import { AppsWidget as AppsWidgetType } from '../blocks/AppsWidget/types';
import { LinksWidget as LinksWidgetType } from '../blocks/LinksWidget/types';
import { ClockWidget as ClockWidgetType } from '../blocks/ClockWidget/types';
import { SearchWidget } from '../blocks/SearchWidget';
import { AppsWidget } from '../blocks/AppsWidget';
import { LinksWidget } from '../blocks/LinksWidget';
import { ClockWidget } from '../blocks/ClockWidget';
import { Grid as GridType } from '../blocks/Grid/types';
import Grid from '../blocks/Grid';
import { StopWatchWidget as StopWatchWidgetType } from '../blocks/StopWatchWidget/types';
import StopWatchWidget from '../blocks/StopWatchWidget';

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks
        .filter(block => !block.hidden)
        .map(block => {
          if (block.type === WIDGET_TYPE_GRID) {
            return <Grid {...(block as GridType)} />;
          }
          if (block.type === WIDGET_TYPE_SEARCH) {
            return <SearchWidget {...(block as SearchWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_APPS) {
            return <AppsWidget {...(block as AppsWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_LINKS) {
            return <LinksWidget {...(block as LinksWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_CLOCK) {
            return <ClockWidget {...(block as ClockWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_STOPWATCH) {
            return <StopWatchWidget {...(block as StopWatchWidgetType)} />;
          }
          return null;
        })}
    </>
  );
}
