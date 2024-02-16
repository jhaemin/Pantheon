import { $hoveredNode } from '@/atoms'
import { onMouseDownIframe } from '@/events'
import { Ground } from '@/ground'
import { PageNode } from '@/node-class/page'
import { useStore } from '@nanostores/react'
import styles from './page-label.module.scss'

export function PageLabel({ page }: { page: PageNode }) {
  const scale = useStore(Ground.$scale)
  const pageLabel = useStore(page.$pageLabel)
  const trimmedPageLabel = pageLabel.trim()

  return (
    <div
      className={styles.pageLabel}
      style={{
        scale: 1 / scale,
        translate: `0px ${-6 / scale}px`,
      }}
      onMouseOver={() => {
        $hoveredNode.set(page)
      }}
      onMouseDown={(e) => onMouseDownIframe(e, page, true)}
    >
      {trimmedPageLabel || 'Untitled'}
    </div>
  )
}
