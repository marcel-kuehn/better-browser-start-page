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

export interface AppConfig {
  elements: Block[];
  _v: string;
}
