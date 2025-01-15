import { Card } from "@/components/ui/card";

export function Widget({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`w-full px-4 py-6 bg-card/40 backdrop-blur-lg border-border/20 ${
        className ?? ""
      }`}
    >
      {children}
    </Card>
  );
}
