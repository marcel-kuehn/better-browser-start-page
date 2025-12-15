import { Widget } from "@/types";

export interface LinkCollectionElement {
  label: string;
  url: string;
  faviconUrl?: string;
}

export interface LinkCollection {
  title: string;
  elements: LinkCollectionElement[];
}

export interface LinksWidget extends Widget {
  collections: LinkCollection[];
  type: "links-widget";
}
