import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Link } from './types';
import FaviconLoader from '@/components/shared/FaviconLoader';

export default function Link({ label, url, faviconUrl }: Link) {
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'sm',
          className: 'w-full !justify-start',
        })
      )}
    >
      <FaviconLoader url={url} faviconUrl={faviconUrl} className="h-4 w-4" />

      <span className="text-card-foreground text-sm leading-none">{label}</span>
    </a>
  );
}
