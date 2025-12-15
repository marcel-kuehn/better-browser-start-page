export interface Widget {
  type: string;
  [key: string]: unknown;
}

export interface AppConfig {
  widgets: Widget[];
}
