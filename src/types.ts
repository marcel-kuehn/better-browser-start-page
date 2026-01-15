import { Widget } from "./components/shared/Widget";

export interface Block {
  type: string;
  [key: string]: unknown;
}

export interface Widget extends Block {
  hidden?: boolean;
  gridArea: {
    rowStart: number;
    rowEnd: number;
    columnStart: number;
    columnEnd: number;
  };
}

export type Theme = "glassmorphism" | "glassmorphism-dark";

export interface Settings {
  theme: Theme;
}

export interface AppConfig {
  elements: Block[];
  settings: Settings;
  _v: "0.0.2";
}
