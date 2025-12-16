import { Block, Widget } from "@/types";

export interface Grid extends Block {
  type: "grid";
  elements: Widget[];
}
