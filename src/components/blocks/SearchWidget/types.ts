import { Widget } from "@/types";

export interface SearchElement {
  id: string;
  url: string;
  faviconUrl?: string;
}

export interface SearchWidget extends Widget {
  elements: SearchElement[];
  type: "search-widget";
}
