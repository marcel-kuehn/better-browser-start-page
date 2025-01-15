export interface SearchElement {
  url: string;
  customLogoUrl?: string;
}

export interface SearchContextProps {
  elements: SearchElement[];
}
