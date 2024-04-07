import {
  $designMode,
  $hoveredNode,
  $isAnimatingGround,
  $isDraggingNode,
  $selectedNodes,
  $selectionRerenderFlag,
} from '@/atoms'
import { Ground } from '@/ground'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { GuideDimension } from '@/types/guide-dimension'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import styles from './selection-guide.module.scss'

export function selectNode(
  e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
  willSelectNode: Node,
) {
  if (e.metaKey || e.ctrlKey || e.shiftKey) {
    const selectedNodes = $selectedNodes.get()

    if (selectedNodes.includes(willSelectNode)) {
      $selectedNodes.set(
        selectedNodes.filter((node) => node !== willSelectNode),
      )
    } else {
      $selectedNodes.set([...selectedNodes, willSelectNode])
    }
  } else {
    $selectedNodes.set([willSelectNode])
  }
}

type SelectionGuide = GuideDimension & {
  node: Node
}

export function SelectionGuide() {
  useStore($designMode)

  const isDraggingNode = useStore($isDraggingNode)
  const isMovingGround = useStore($isAnimatingGround)
  const selectionRerenderFlag = useStore($selectionRerenderFlag)

  const [dimensions, setDimensions] = useState<(SelectionGuide | null)[]>([])

  const [isInvisible, setIsInvisible] = useState(
    isDraggingNode || isMovingGround,
  )

  const scale = useStore(Ground.$scale)
  const translate = useStore(Ground.$translate)

  const hoveredNode = useStore($hoveredNode)
  const selectedNodes = useStore($selectedNodes)

  useEffect(() => {
    const newDimensions = selectedNodes.map((node) => {
      if (!node.ownerPage) return null

      const iframe = node.ownerPage.iframeElement
      const nodeElm = node.element

      if (!iframe || !nodeElm) {
        return null
      }

      const iframeRect = iframe.getBoundingClientRect()
      const nodeRect = nodeElm.getBoundingClientRect()

      if (node instanceof PageNode) {
        return {
          top: iframeRect.top,
          left: iframeRect.left,
          width: iframeRect.width,
          height: iframeRect.height,
          node,
        }
      }

      const dimension: SelectionGuide = {
        top: nodeRect.top * scale + iframeRect.top,
        left: nodeRect.left * scale + iframeRect.left,
        width: nodeRect.width * scale,
        height: nodeRect.height * scale,
        node,
      }

      return dimension
    })

    setDimensions(newDimensions)

    setIsInvisible(isDraggingNode || isMovingGround)
  }, [
    selectedNodes,
    scale,
    translate,
    selectionRerenderFlag,
    isMovingGround,
    isDraggingNode,
  ])

  return dimensions.map((dimension, i) => {
    if (!dimension || dimension.width === 0 || dimension.height === 0)
      return null

    return (
      <div
        key={i}
        className={styles.selectionGuide}
        style={{
          transform: `translate(${dimension.left}px, ${dimension.top}px)`,
          width: dimension.width,
          height: dimension.height,
          zIndex: hoveredNode === dimension.node ? 2 : 0,
          opacity: isInvisible ? 0 : undefined,
        }}
      />
    )
  })
}
