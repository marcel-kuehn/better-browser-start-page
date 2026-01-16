import { Widget } from "@/types";

export interface Link {
  id: string;
  label: string;
  url: string;
  faviconUrl?: string;
}

export interface LinksWidget extends Widget {
  type: "links-widget";
  title: string;
  elements: Link[];
}
