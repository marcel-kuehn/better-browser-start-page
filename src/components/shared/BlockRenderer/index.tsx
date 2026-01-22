import {
  WIDGET_TYPE_GRID,
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_APPS,
  WIDGET_TYPE_LINKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_STOPWATCH,
} from '@/constants/widgetTypes';
import { SearchWidget as SearchWidgetType } from '../../blocks/SearchWidget/types';
import { AppsWidget as AppsWidgetType } from '../../blocks/AppsWidget/types';
import { LinksWidget as LinksWidgetType } from '../../blocks/LinksWidget/types';
import { ClockWidget as ClockWidgetType } from '../../blocks/ClockWidget/types';
import { SearchWidget } from '../../blocks/SearchWidget';
import { AppsWidget } from '../../blocks/AppsWidget';
import { LinksWidget } from '../../blocks/LinksWidget';
import { ClockWidget } from '../../blocks/ClockWidget';
import { Grid as GridType } from '../../blocks/Grid/types';
import Grid from '../../blocks/Grid';
import { StopWatchWidget as StopWatchWidgetType } from '../../blocks/StopWatchWidget/types';
import StopWatchWidget from '../../blocks/StopWatchWidget';
import type { BlockRendererProps } from './types';

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks
        .filter(block => !block.hidden)
        .map(block => {
          if (block.type === WIDGET_TYPE_GRID) {
            return <Grid key={block.id} {...(block as GridType)} />;
          }
          if (block.type === WIDGET_TYPE_SEARCH) {
            return <SearchWidget key={block.id} {...(block as SearchWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_APPS) {
            return <AppsWidget key={block.id} {...(block as AppsWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_LINKS) {
            return <LinksWidget key={block.id} {...(block as LinksWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_CLOCK) {
            return <ClockWidget key={block.id} {...(block as ClockWidgetType)} />;
          }
          if (block.type === WIDGET_TYPE_STOPWATCH) {
            return <StopWatchWidget key={block.id} {...(block as StopWatchWidgetType)} />;
          }
          return null;
        })}
    </>
  );
}
