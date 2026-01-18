import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { WALLPAPER_PREFIX } from '@/constants/themes';

export default function View({ children }: { children: React.ReactNode }) {
  const { getTheme } = useAppConfig();
  const theme = getTheme();

  const htmlDomElement = document.getElementsByTagName('html')[0];
  htmlDomElement.className = theme;

  return (
    <div
      className={
        'bg-muted flex min-h-screen w-screen flex-col items-center justify-center bg-cover bg-center p-4'
      }
      style={{
        backgroundImage: `url(${WALLPAPER_PREFIX}${theme}.jpg)`,
      }}
    >
      {children}
    </div>
  );
}
