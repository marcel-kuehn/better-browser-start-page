import { useAppConfig } from "@/contexts/AppConfig/useAppConfig";
import clsx from "clsx";

export default function View({ children }: { children: React.ReactNode }) {
  const { getTheme } = useAppConfig();
  const theme = getTheme();

  const htmlDomElement = document.getElementsByTagName("html")[0];
  htmlDomElement.className = theme;

  return (
    <div
      className={clsx(
        "w-screen min-h-screen bg-cover bg-center flex flex-col items-center justify-center bg-muted p-4"
      )}
      style={{
        backgroundImage: `url(wallpaper-${theme}.jpg)`,
      }}
    >
      {children}
    </div>
  );
}
