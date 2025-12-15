import { Widget } from "@/types";

export interface AppLink {
  url: string;
  faviconUrl?: string;
}

export interface AppsWidget extends Widget {
  elements: AppLink[];
  type: "apps-widget";
}
