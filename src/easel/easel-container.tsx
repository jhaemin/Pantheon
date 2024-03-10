import { EaselWrapper } from '@/easel/easel-wrapper'
import { Ground } from '@/ground'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { useEffect, useRef } from 'react'
import styles from './easel-container.module.scss'

export const EASEL_CONTAINER_ID = 'studio-easel-container'

function scaleStyle(scale: number) {
  return scale.toString()
}

function translateStyle(translate: { x: number; y: number }) {
  return `${translate.x}px ${translate.y}px`
}

/**
 * A container of easels (pages)
 */
export function EaselContainer() {
  const ref = useRef<HTMLDivElement>(null!)
  const pages = useStore(studioApp.$pages)

  useEffect(() => {
    const unsubscribeScale = Ground.$scale.subscribe((scale) => {
      ref.current.style.scale = scaleStyle(scale)
    })

    const unsubscribeTranslate = Ground.$translate.subscribe((translate) => {
      ref.current.style.translate = translateStyle(translate)
    })

    return () => {
      unsubscribeScale()
      unsubscribeTranslate()
    }
  }, [])

  return (
    <div
      ref={ref}
      id={EASEL_CONTAINER_ID}
      className={styles.easelContainer}
      style={{
        scale: scaleStyle(Ground.scale),
        translate: translateStyle(Ground.translate),
      }}
    >
      {pages.map((page) => (
        <EaselWrapper key={page.id} page={page} />
      ))}
    </div>
  )
}
