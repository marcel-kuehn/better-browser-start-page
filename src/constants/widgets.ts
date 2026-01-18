import { ClockIcon, LayoutGridIcon, LinkIcon, SearchIcon, TimerIcon } from 'lucide-react';
import type { TFunction } from 'i18next';
import {
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_APPS,
  WIDGET_TYPE_LINKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_STOPWATCH,
} from './widgetTypes';
import { DEFAULT_SEARCH_URL, EXAMPLE_URL, EXAMPLE_URL_WITH_TRAILING_SLASH } from './urls';

export type WidgetOption = {
  type: string;
  label: string;
  description: string;
  icon: typeof SearchIcon;
  variants: Array<{ w: number; h: number }>;
};

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

export const getWidgetOptions = (t: TFunction): WidgetOption[] => [
  {
    type: WIDGET_TYPE_SEARCH,
    label: t('widgets.search.label'),
    description: t('widgets.search.description'),
    icon: SearchIcon,
    variants: [
      { w: 2, h: 1 },
      { w: 3, h: 1 },
      { w: 4, h: 1 },
    ],
  },
  {
    type: WIDGET_TYPE_APPS,
    label: t('widgets.apps.label'),
    description: t('widgets.apps.description'),
    icon: LayoutGridIcon,
    variants: [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 1, h: 3 },
      { w: 1, h: 4 },
      { w: 2, h: 1 },
      { w: 2, h: 2 },
      { w: 2, h: 3 },
      { w: 2, h: 4 },
      { w: 3, h: 1 },
      { w: 3, h: 2 },
      { w: 3, h: 3 },
      { w: 3, h: 4 },
      { w: 4, h: 1 },
      { w: 4, h: 2 },
      { w: 4, h: 3 },
      { w: 4, h: 4 },
    ],
  },
  {
    type: WIDGET_TYPE_LINKS,
    label: t('widgets.links.label'),
    description: t('widgets.links.description'),
    icon: LinkIcon,
    variants: [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 1, h: 3 },
      { w: 1, h: 4 },
    ],
  },
  {
    type: WIDGET_TYPE_CLOCK,
    label: t('widgets.clock.label'),
    description: t('widgets.clock.description'),
    icon: ClockIcon,
    variants: [{ w: 1, h: 1 }],
  },
  {
    type: WIDGET_TYPE_STOPWATCH,
    label: t('widgets.stopwatch.label'),
    description: t('widgets.stopwatch.description'),
    icon: TimerIcon,
    variants: [{ w: 1, h: 1 }],
  },
];
