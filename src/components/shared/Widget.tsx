import { Card } from "@/components/ui/card";
import type { Widget } from "@/types";

interface WidgetProps extends Widget {
  children?: React.ReactNode;
  className?: string;
}

export function Widget({ children, className, gridArea }: WidgetProps) {
  return (
    <Card
      className={`w-full px-4 py-6 bg-card/50 backdrop-blur-lg border-border/20 ${
        className ?? ""
      }`}
      style={{
        gridArea: `${gridArea.rowStart} / ${gridArea.columnStart} / ${gridArea.rowEnd} / ${gridArea.columnEnd}`,
      }}
    >
      {children}
    </Card>
  );
}
