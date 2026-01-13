import { Block, Widget } from "@/types";

export interface Grid extends Block {
  type: "grid";
  columns: number;
  rows: number;
  elements: Widget[];
}
