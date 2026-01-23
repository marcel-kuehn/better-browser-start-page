import {
  ClockIcon,
  LayoutGridIcon,
  LinkIcon,
  SearchIcon,
  TimerIcon,
  LucideIcon,
  ClipboardIcon,
} from 'lucide-react';
import type { TFunction } from 'i18next';
import {
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_APPS,
  WIDGET_TYPE_LINKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_STOPWATCH,
} from '@/constants/widgetTypes';
import { DEFAULT_SEARCH_URL } from '@/components/blocks/SearchWidget/constants';
import { EXAMPLE_URL, EXAMPLE_URL_WITH_TRAILING_SLASH } from '@/constants/urls';
import { WidgetOption } from './types';
import { GridArea } from '@/types';

export const createDefaultWidgetConfigs = (t: TFunction): Record<string, unknown> => ({
  [WIDGET_TYPE_SEARCH]: {
    elements: [
      {
        id: crypto.randomUUID(),
        url: DEFAULT_SEARCH_URL,
      },
    ],
  },
  [WIDGET_TYPE_APPS]: {
    elements: [{ id: crypto.randomUUID(), url: EXAMPLE_URL_WITH_TRAILING_SLASH }],
  },
  [WIDGET_TYPE_LINKS]: {
    title: t('ui.newCategory'),
    elements: [
      {
        id: crypto.randomUUID(),
        label: t('ui.exampleLink'),
        url: EXAMPLE_URL,
      },
    ],
  },
  [WIDGET_TYPE_CLOCK]: {},
  [WIDGET_TYPE_STOPWATCH]: {},
});

const WIDGET_ICONS: Record<string, LucideIcon> = {
  [WIDGET_TYPE_SEARCH]: SearchIcon,
  [WIDGET_TYPE_APPS]: LayoutGridIcon,
  [WIDGET_TYPE_LINKS]: LinkIcon,
  [WIDGET_TYPE_CLOCK]: ClockIcon,
  [WIDGET_TYPE_STOPWATCH]: TimerIcon,
};

export const getWidgetIcon = (type: string): LucideIcon => {
  return WIDGET_ICONS[type] || ClipboardIcon;
};

export const gridAreaToSpan = (gridArea: GridArea) => ({
  rowSpan: gridArea.rowEnd - gridArea.rowStart,
  columnSpan: gridArea.columnEnd - gridArea.columnStart,
});

export const getWidgetOptions = (t: TFunction): WidgetOption[] => [
  {
    type: WIDGET_TYPE_SEARCH,
    label: t('widgets.search.label'),
    description: t('widgets.search.description'),
    icon: SearchIcon,
    variants: [
      { rowSpan: 1, columnSpan: 2 },
      { rowSpan: 1, columnSpan: 3 },
      { rowSpan: 1, columnSpan: 4 },
    ],
  },
  {
    type: WIDGET_TYPE_APPS,
    label: t('widgets.apps.label'),
    description: t('widgets.apps.description'),
    icon: LayoutGridIcon,
    variants: [
      { rowSpan: 1, columnSpan: 1 },
      { rowSpan: 1, columnSpan: 2 },
      { rowSpan: 1, columnSpan: 3 },
      { rowSpan: 1, columnSpan: 4 },
      { rowSpan: 2, columnSpan: 1 },
      { rowSpan: 2, columnSpan: 2 },
      { rowSpan: 2, columnSpan: 3 },
      { rowSpan: 2, columnSpan: 4 },
      { rowSpan: 3, columnSpan: 1 },
      { rowSpan: 3, columnSpan: 2 },
      { rowSpan: 3, columnSpan: 3 },
      { rowSpan: 3, columnSpan: 4 },
      { rowSpan: 4, columnSpan: 1 },
      { rowSpan: 4, columnSpan: 2 },
      { rowSpan: 4, columnSpan: 3 },
      { rowSpan: 4, columnSpan: 4 },
    ],
  },
  {
    type: WIDGET_TYPE_LINKS,
    label: t('widgets.links.label'),
    description: t('widgets.links.description'),
    icon: LinkIcon,
    variants: [
      { rowSpan: 1, columnSpan: 1 },
      { rowSpan: 1, columnSpan: 2 },
      { rowSpan: 1, columnSpan: 3 },
      { rowSpan: 1, columnSpan: 4 },
    ],
  },
  {
    type: WIDGET_TYPE_CLOCK,
    label: t('widgets.clock.label'),
    description: t('widgets.clock.description'),
    icon: ClockIcon,
    variants: [{ rowSpan: 1, columnSpan: 1 }],
  },
  {
    type: WIDGET_TYPE_STOPWATCH,
    label: t('widgets.stopwatch.label'),
    description: t('widgets.stopwatch.description'),
    icon: TimerIcon,
    variants: [{ rowSpan: 1, columnSpan: 1 }],
  },
];
