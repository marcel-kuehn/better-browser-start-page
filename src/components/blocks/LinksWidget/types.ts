import { Widget } from "@/types";

export interface Link {
  label: string;
  url: string;
  faviconUrl?: string;
}

export interface LinksWidget extends Widget {
  type: "links-widget";
  title: string;
  elements: Link[];
}
