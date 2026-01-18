import FaviconLoader from '@/components/shared/FaviconLoader';
import { cn } from '@/lib/utils';
import type { AppLink } from './types';
import { buttonVariants } from '@/components/ui/button';

export default function AppLink({ url, faviconUrl }: AppLink) {
  return (
    <a
      href={url}
      key={url}
      rel="noopener noreferrer"
      className={cn('h-16 min-h-16 w-16 min-w-16', buttonVariants({ variant: 'outline' }))}
      title={url}
    >
      <FaviconLoader url={url} faviconUrl={faviconUrl} className="!h-6 !w-6" />
    </a>
  );
}
