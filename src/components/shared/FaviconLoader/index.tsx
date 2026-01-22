import { getDomain, getFaviconUrl } from '@/lib/url';
import { cn } from '@/lib/utils';
import { GlobeIcon } from 'lucide-react';
import { useState } from 'react';
import type { FaviconLoaderProps } from './types';

export default function FaviconLoader({ url, faviconUrl, className }: FaviconLoaderProps) {
  const src = faviconUrl ?? getFaviconUrl(url);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <span>
      {(isLoading || hasError) && (
        <GlobeIcon
          className={cn('text-muted-foreground size-4', className)}
          aria-label="Globe Icon"
        />
      )}

      {!hasError && (
        <img
          className={cn('size-4', isLoading && 'hidden', className)}
          src={src}
          alt={`Favicon of ${getDomain(src)}`}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </span>
  );
}
