import { buttonVariants } from '@/components/ui/button'
import clsx from 'clsx'
import type { Link } from './types'
import FaviconLoader from '@/components/shared/FaviconLoader'

export default function Link({ label, url, faviconUrl }: Link) {
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      className={clsx(
        buttonVariants({
          variant: 'ghost',
          size: 'sm',
          className: 'w-full !justify-start',
        })
      )}
    >
      <FaviconLoader url={url} faviconUrl={faviconUrl} className="w-4 h-4" />

      <span className="leading-none text-sm text-card-foreground">{label}</span>
    </a>
  )
}
