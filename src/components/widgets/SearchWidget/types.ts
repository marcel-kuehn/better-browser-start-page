import { Widget } from "@/types";

export interface SearchElement {
  url: string;
  faviconUrl?: string;
}

export interface SearchWidget extends Widget {
  elements: SearchElement[];
  type: "search-widget";
}
