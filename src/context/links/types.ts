export interface LinkElement {
  name: string;
  url: string;
}

export interface LinkCollection {
  name: string;
  elements: LinkElement[];
}

export interface LinksContextProps {
  variables: Record<string, string>;
  collections: LinkCollection[];
}
