import { AppConfig } from '@/types';
import { DEFAULT_CONFIG_VERSION } from './constants';
import { DEFAULT_THEME } from '@/constants/themes';
import { DEFAULT_LANGUAGE } from '@/constants/languages';
import { WIDGET_TYPE_GRID, WIDGET_TYPE_SEARCH } from '@/constants/widgetTypes';
import { DEFAULT_GRID_COLUMNS, DEFAULT_GRID_ROWS } from '@/constants/grid';
import { DEFAULT_SEARCH_URL } from '@/components/blocks/SearchWidget/constants';

export const INITIAL_CONFIG: AppConfig = {
  _v: DEFAULT_CONFIG_VERSION,
  settings: {
    theme: DEFAULT_THEME,
    language: DEFAULT_LANGUAGE,
  },
  elements: [
    {
      id: crypto.randomUUID(),
      type: WIDGET_TYPE_GRID,
      span: {
        rowSpan: DEFAULT_GRID_ROWS,
        columnSpan: DEFAULT_GRID_COLUMNS,
      },
      elements: [
        {
          id: crypto.randomUUID(),
          type: WIDGET_TYPE_SEARCH,
          gridArea: {
            rowStart: 1,
            rowEnd: 2,
            columnStart: 2,
            columnEnd: 4,
          },
          elements: [
            {
              id: crypto.randomUUID(),
              url: DEFAULT_SEARCH_URL,
            },
          ],
        },
      ],
    },
  ],
};
