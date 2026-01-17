import { Widget } from '@/components/shared/Widget'
import type { LinksWidget } from './types'
import Link from './Link'

export function LinksWidget({ title, elements, ...props }: LinksWidget) {
  return (
    <Widget className="w-full px-4 py-6 flex flex-col gap-4 flex-1" {...props}>
      <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
        {title}
      </h3>
      <ul className="flex flex-col -mx-2">
        {elements.map(element => (
          <li key={element.url}>
            <Link {...element} />
          </li>
        ))}
      </ul>
    </Widget>
  )
}
