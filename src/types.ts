import { Widget } from './components/shared/Widget';

export interface Block {
  id: string;
  type: string;
  [key: string]: unknown;
}

export interface GridArea {
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
}

export interface Widget extends Block {
  gridArea: GridArea;
}

export type Theme = 'glassmorphism' | 'glassmorphism-dark';

export interface Settings {
  theme: Theme;
}

export interface AppConfig {
  elements: Block[];
  settings: Settings;
  _v: '0.0.2';
}
