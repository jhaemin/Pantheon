import {
  $hoverRerenderFlag,
  $hoveredNode,
  $isAnimatingGround,
  $isDraggingNode,
} from '@/atoms'
import { Ground } from '@/ground'
import { PageNode } from '@/node-class/page'
import { GuideDimension } from '@/types/guide-dimension'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import styles from './hover-guide.module.scss'

const initialDimension: GuideDimension = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
}

export function HoverGuide() {
  const isDraggingNode = useStore($isDraggingNode)
  const isMovingGround = useStore($isAnimatingGround)
  const hoverRerenderFlag = useStore($hoverRerenderFlag)
  const scale = useStore(Ground.$scale)
  const translate = useStore(Ground.$translate)
  const hoveredNode = useStore($hoveredNode)
  const [dimension, setDimension] = useState(initialDimension)

  const [isInvisible, setIsInvisible] = useState(
    isDraggingNode || isMovingGround,
  )

  useEffect(() => {
    if (!hoveredNode || !hoveredNode.ownerPage) {
      setDimension(initialDimension)
      return
    }

    const iframe = hoveredNode.ownerPage.iframeElement
    const nodeElm = hoveredNode.element

    if (!iframe || !nodeElm) {
      setDimension(initialDimension)
      return
    }

    const iframeRect = iframe.getBoundingClientRect()
    const nodeRect = nodeElm.getBoundingClientRect()

    if (hoveredNode instanceof PageNode) {
      setDimension({
        top: iframeRect.top,
        left: iframeRect.left,
        width: iframeRect.width,
        height: iframeRect.height,
      })
    } else {
      setDimension({
        top: nodeRect.top * scale + iframeRect.top,
        left: nodeRect.left * scale + iframeRect.left,
        width: nodeRect.width * scale,
        height: nodeRect.height * scale,
      })
    }

    setIsInvisible(isDraggingNode || isMovingGround)
  }, [
    hoveredNode,
    scale,
    translate,
    hoverRerenderFlag,
    isMovingGround,
    isDraggingNode,
  ])

  if (!hoveredNode) {
    return null
  }

  if (dimension.width === 0 || dimension.height === 0) {
    return null
  }

  if (isMovingGround || isDraggingNode) return null

  return (
    <div
      className={styles.hoverGuide}
      style={{
        transform: `translate(${dimension.left}px, ${dimension.top}px)`,
        width: dimension.width,
        height: dimension.height,
        opacity: isInvisible ? 0 : undefined,
      }}
    />
  )
}
