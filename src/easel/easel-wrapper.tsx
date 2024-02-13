import {
  $allRenderedNodes,
  $designMode,
  $hoveredNode,
  $interactionMode,
  $isDraggingNode,
  $isResizingIframe,
} from '@/atoms'
import {
  keepNodeSelectionAttribute,
  makeNodeAttributes,
  makeNodeDropZoneAttributes,
} from '@/data-attributes'
import { onMouseDownIframe } from '@/events'
import { Ground } from '@/ground'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { getClosestSelectableNodeSet } from '@/node-lib'
import { useStore } from '@nanostores/react'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './easel-wrapper.module.scss'
import { PageLabel } from './page-label'
import { Resizer } from './resizer'
import { UnselectableNodes } from './unselectable-nodes'

export const EASEL_WRAPPER_CLASS_NAME = 'studio-easel-wrapper'

export function getEaselIframeId(pageId: string) {
  return `easel-iframe-${pageId}`
}

/**
 * Previously hovered element used for simulating mouseover with mousemove.
 */
let previousMouseOverElement: Element | null = null

// Clear previously remembered hovered node.
// When node reverts back by history undo at where the cursor is by, it doesn't trigger simulated mouseover event.
// Because previousMouseOverElement is not cleared.
$hoveredNode.listen(() => {
  previousMouseOverElement = null
})

export function EaselWrapper({ page }: { page: PageNode }) {
  const interactionMode = useStore($interactionMode)
  const iframeRef = useRef<HTMLIFrameElement>(null!)
  const dimensions = useStore(page.$dimensions)
  const coordinates = useStore(page.$coordinates)

  useEffect(() => {
    if (!iframeRef.current) return

    PageNode.attachIframeElement(page, iframeRef.current)

    const iframeWindow = iframeRef.current?.contentWindow!

    // Inject global references to iframe's window object.
    iframeWindow.parentFrame = iframeRef.current
    iframeWindow.pageNode = page

    // Inject shared data
    iframeWindow.shared = {
      $allRenderedNodes,
      $designMode,
    }

    iframeWindow.addEventListener('DOMContentLoaded', () => {
      const attributes = {
        ...makeNodeAttributes(page),
        ...makeNodeDropZoneAttributes(page),
      }

      Object.entries(attributes).forEach(([key, value]) => {
        iframeWindow.document.body.setAttribute(key, value)
      })
    })

    return () => {
      PageNode.detachIframeElement(page)

      const nextAllRenderedNodes = { ...$allRenderedNodes.get() }

      function removeNodesFromAllRenderedNodes(...nodes: Node[]) {
        nodes.forEach((node) => {
          delete nextAllRenderedNodes[node.id]
          removeNodesFromAllRenderedNodes(...node.children)
        })
      }

      removeNodesFromAllRenderedNodes(page)

      $allRenderedNodes.set(nextAllRenderedNodes)
    }
  }, [page])

  if (!page) {
    return null
  }

  return (
    <div
      className={clsx(EASEL_WRAPPER_CLASS_NAME, styles.easelWrapper)}
      {...keepNodeSelectionAttribute}
      style={{
        translate: `${coordinates.x}px ${coordinates.y}px`,
      }}
      onMouseLeave={() => {
        previousMouseOverElement = null
        $hoveredNode.set(null)
      }}
      onMouseMove={(e) => {
        // Hover node while moving mouse on the iframe

        if ($isDraggingNode.get() || $isResizingIframe.get()) {
          return
        }

        const rect = iframeRef.current.getBoundingClientRect()
        const pointScale = 1 / Ground.scale
        const elementAtCursor =
          iframeRef.current?.contentDocument?.elementFromPoint(
            (e.clientX - rect.left) * pointScale,
            (e.clientY - rect.top) * pointScale,
          )

        // Simulate mouseover with mousemove
        if (
          elementAtCursor &&
          !elementAtCursor.isSameNode(previousMouseOverElement)
        ) {
          previousMouseOverElement = elementAtCursor

          const { node: hoveredNode } =
            getClosestSelectableNodeSet(elementAtCursor)

          if (hoveredNode) {
            $hoveredNode.set(hoveredNode)
          }
        }
      }}
      onMouseDown={(e) => onMouseDownIframe(e, page, false)}
    >
      <iframe
        id={getEaselIframeId(page.id)}
        className="easel-iframe"
        ref={iframeRef}
        src="/easel"
        style={{
          pointerEvents: interactionMode ? 'auto' : 'none',
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: 'white',
        }}
      />

      <PageLabel page={page} />
      <Resizer page={page} />
      <UnselectableNodes page={page} />
    </div>
  )
}
