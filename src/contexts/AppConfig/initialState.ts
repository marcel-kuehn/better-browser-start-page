import { AppConfig } from '@/types';

export const INITIAL_CONFIG: AppConfig = {
  _v: '0.0.2',
  settings: {
    theme: 'glassmorphism',
  },
  elements: [
    {
      id: crypto.randomUUID(),
      type: 'grid',
      columns: 4,
      rows: 1,
      elements: [
        {
          id: crypto.randomUUID(),
          type: 'search-widget',
          gridArea: {
            rowStart: 1,
            rowEnd: 2,
            columnStart: 2,
            columnEnd: 4,
          },
          elements: [
            {
              id: crypto.randomUUID(),
              url: 'https://www.google.com/search?q={query}',
            },
          ],
        },
      ],
    },
  ],
};
