import { Widget } from '@/components/shared/Widget'
import type { AppsWidget } from './types'
import AppLink from './AppLink'

export function AppsWidget({ elements, ...props }: AppsWidget) {
  const hasElements = elements.length > 0

  if (!hasElements) return null

  return (
    <Widget className="max-w-full flex items-center" {...props}>
      <div className="flex gap-4 justify-center items-center flex-wrap w-full">
        {elements.map(element => (
          <AppLink key={element.url} {...element} />
        ))}
      </div>
    </Widget>
  )
}
