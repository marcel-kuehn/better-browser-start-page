import { useMemo } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { getSystemTheme } from "@/lib/theme";

export default function View({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const selectedTheme = useMemo(() => {
    if (theme === "system") {
      return getSystemTheme();
    }

    return theme;
  }, [theme]);

  return (
    <div
      className="w-screen min-h-screen bg-cover bg-center flex flex-col items-center justify-center bg-muted p-4"
      style={{
        backgroundImage: `url(wallpaper-${selectedTheme}.jpg)`,
      }}
    >
      {children}
    </div>
  );
}
