import { $hoveredNode } from '@/atoms'
import { onMouseDownIframe } from '@/events'
import { Ground } from '@/ground'
import { PageNode } from '@/node-class/page'
import { useStore } from '@nanostores/react'
import { useEffect, useRef } from 'react'
import styles from './page-title.module.scss'

function scaleStyle(scale: number) {
  return `${1 / scale}`
}

function translateStyle(scale: number) {
  return `0px ${-6 / scale}px`
}

export function PageTitle({ page }: { page: PageNode }) {
  const ref = useRef<HTMLDivElement>(null!)
  const { title } = useStore(page.$props, { keys: ['title'] })
  const trimmedPageLabel = title.trim()

  useEffect(() => {
    const unsubscribe = Ground.$scale.subscribe((scale) => {
      ref.current.style.scale = scaleStyle(scale)
      ref.current.style.translate = translateStyle(scale)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={styles.pageLabel}
      style={{
        scale: scaleStyle(Ground.scale),
        translate: translateStyle(Ground.scale),
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
