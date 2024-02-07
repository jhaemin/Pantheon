import { EaselWrapper } from '@/easel/easel-wrapper'
import { Ground } from '@/ground'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { useRef } from 'react'
import styles from './easel-container.module.scss'

export const EASEL_CONTAINER_ID = 'studio-easel-container'

/**
 * A container of easels (pages)
 */
export function EaselContainer() {
  const ref = useRef<HTMLDivElement>(null!)
  const scale = useStore(Ground.$scale)
  const translate = useStore(Ground.$translate)

  const pages = useStore(studioApp.$pages)

  // TODO: implement focus
  // useEffect(() => {
  //   const pageNode = pages[0]
  //   const groundRect = Ground.element.getBoundingClientRect()

  //   if (pageNode) {
  //     Ground.setTranslate(
  //       (groundRect.width - pageNode.$viewportSize.get().width) / 2,
  //       80,
  //     )
  //   }
  // }, [])

  return (
    <div
      ref={ref}
      id={EASEL_CONTAINER_ID}
      className={styles.easelContainer}
      style={{
        scale: scale,
        translate: `${translate.x}px ${translate.y}px`,
      }}
    >
      {pages.map((page) => (
        <EaselWrapper key={page.id} page={page} />
      ))}
    </div>
  )
}
