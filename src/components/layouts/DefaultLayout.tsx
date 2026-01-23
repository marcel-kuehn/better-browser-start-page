import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';
import { WALLPAPER_PREFIX } from '@/constants/themes';

export default function View({ children }: { children: React.ReactNode }) {
  const { getTheme, getCustomBackground } = useAppConfig();
  const theme = getTheme();
  const customBackground = getCustomBackground();

  const htmlDomElement = document.getElementsByTagName('html')[0];
  htmlDomElement.className = theme;

  const backgroundImage = customBackground
    ? `url(${customBackground})`
    : `url(${WALLPAPER_PREFIX}${theme}.jpg)`;

  return (
    <div
      data-testid="main-layout"
      className={
        'bg-muted flex min-h-screen w-screen flex-col items-center justify-center bg-cover bg-center p-4'
      }
      style={{
        backgroundImage,
      }}
    >
      {children}
    </div>
  );
}
