import { $dropZone } from '@/atoms'
import { Ground } from '@/ground'
import { findEaselIframe } from '@/node-lib'
import { useStore } from '@nanostores/react'
import styles from './drop-zone-guide.module.scss'

export function DropZoneGuide() {
  const scale = useStore(Ground.$scale)
  const dropZone = useStore($dropZone)

  if (!dropZone) return null

  const { targetNode, dropZoneElm } = dropZone

  const dropZoneRect = dropZoneElm.getBoundingClientRect()
  const iframe = findEaselIframe(targetNode.ownerPage!)

  if (iframe) {
    const iframeRect = iframe.getBoundingClientRect()

    const width = dropZoneRect.width
    const height = dropZoneRect.height

    if (width === 0 || height === 0) return null

    if (dropZoneElm instanceof HTMLElement) {
      return (
        <div
          className={styles.dropZoneGuide}
          style={{
            top: dropZoneRect.top,
            left: dropZoneRect.left,
            width,
            height,
          }}
        />
      )
    }

    return (
      <div
        className={styles.dropZoneGuide}
        style={{
          top: dropZoneRect.top * scale + iframeRect.top,
          left: dropZoneRect.left * scale + iframeRect.left,
          width: width * scale,
          height: height * scale,
        }}
      />
    )
  }

  return (
    <div
      className={styles.dropZoneGuide}
      style={{
        top: dropZoneRect.top,
        left: dropZoneRect.left,
        width: dropZoneRect.width,
        height: dropZoneRect.height,
      }}
    />
  )
}
