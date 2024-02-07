import {
  $allRenderedNodes,
  $dropZone,
  $hoveredNode,
  $isContextMenuOpen,
  $isDraggingNode,
  $selectedNodes,
} from '@/atoms'
import {
  DESIGN_MODE_EDGE_SPACE,
  DRAG_THRESHOLD,
  dataAttributes,
} from '@/constants'
import { PageMoveAction } from './action'
import { alphanumericId } from './alphanumeric'
import { commandInsertNodes } from './command'
import { $contextMenuPosition } from './context-menu/context-menu'
import { EASEL_WRAPPER_CLASS_NAME } from './easel/easel-wrapper'
import { Ground } from './ground'
import { History } from './history'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'
import {
  findEaselIframe,
  findNodeElm,
  getClosestMoveableNodeSet,
  getClosestSelectableNodeSet,
  getRenderedNodeById,
  isDroppableNode,
} from './node-lib'
import { selectNode } from './ui-guides/selection-guide'

const TEMP_DROP_ZONE_CLASS_NAME = 'studio-temp-dropzone'

export function onMouseDownForDragAndDropNode(
  e: React.MouseEvent,
  data: {
    draggingNode: Node
    cloneTargetElm: Element
    elmX: number
    elmY: number
    elementScale: number
  },
) {
  const { draggingNode, cloneTargetElm, elmX, elmY, elementScale } = data

  const draggingElm = findNodeElm(draggingNode)

  const scale = Ground.scale

  const startX = e.clientX
  const startY = e.clientY

  /**
   * Used for simulating mouseover with mousemove.
   */
  let previousMouseOverElement: Element | null = null

  const onMouseMove = (e: MouseEvent) => {
    const deltaX = Math.abs(e.clientX - startX)
    const deltaY = Math.abs(e.clientY - startY)

    // To prevent accidental drag when user just wants to click,
    // only trigger drag when mouse move more than the amount of threshold pixels
    if (
      !$isDraggingNode.get() &&
      (deltaX >= DRAG_THRESHOLD || deltaY >= DRAG_THRESHOLD)
    ) {
      triggerDragStart()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  const triggerDragStart = () => {
    $isDraggingNode.set(true)
    $hoveredNode.set(null)
    $selectedNodes.set([])

    const clone = cloneTargetElm.cloneNode(true) as HTMLElement
    const computedStyles = window.getComputedStyle(cloneTargetElm)

    Array.from(computedStyles).forEach((key) => {
      clone.style.setProperty(key, computedStyles.getPropertyValue(key))
    })

    clone.style.pointerEvents = 'none'
    clone.style.position = 'fixed'
    clone.style.transformOrigin = '0 0'
    clone.style.transform = `scale(${elementScale})`
    clone.style.left = e.clientX - elmX + 'px'
    clone.style.top = e.clientY - elmY + 'px'
    clone.style.opacity = '0.5'

    document.body.appendChild(clone)

    const onMouseMoveAfterDrag = (e: MouseEvent) => {
      clone.style.left = e.clientX - elmX + 'px'
      clone.style.top = e.clientY - elmY + 'px'

      /**
       * Element under cursor
       */
      let elementAtCursor = document.elementFromPoint(e.clientX, e.clientY)

      if (elementAtCursor?.classList.contains(EASEL_WRAPPER_CLASS_NAME)) {
        const iframe = elementAtCursor.querySelector('iframe')

        if (iframe) {
          const iframeRect = iframe.getBoundingClientRect()
          const iframeDocument = iframe.contentDocument
          const pointScale = 1 / scale

          const iframeElementAtCursor = iframeDocument?.elementFromPoint(
            (e.clientX - iframeRect.left) * pointScale,
            (e.clientY - iframeRect.top) * pointScale,
          )

          if (iframeElementAtCursor) {
            elementAtCursor = iframeElementAtCursor
          }
        }
      }

      if (
        elementAtCursor &&
        !elementAtCursor.isSameNode(previousMouseOverElement)
      ) {
        previousMouseOverElement = elementAtCursor // Update previous element

        // Mouseover an element.

        // Clear temporary drop zones
        if (!elementAtCursor.closest(`.${TEMP_DROP_ZONE_CLASS_NAME}`)) {
          clearTempDropZones()
        }

        if (draggingElm?.contains(elementAtCursor)) {
          // Ignore elements inside dragging element
          $dropZone.set(null)
        } else {
          const { elm: closestNodeElm, node: closestNode } =
            getClosestSelectableNodeSet(elementAtCursor)

          const parent = closestNode?.parent

          // Append temporary drop zones around the element
          if (
            closestNode &&
            !(closestNode instanceof PageNode) && // Do not add temporary drop zones to page node
            parent &&
            isDroppableNode(parent)
          ) {
            appendTemporaryDropZone(closestNode, closestNodeElm)
          }

          // Hover on body blank space.
          // If page node, body is drop zone.
          if (closestNode && closestNode instanceof PageNode) {
            const pageElm = closestNodeElm.querySelector<HTMLElement>(
              `[${dataAttributes.dropZone}]`,
            )!

            $dropZone.set({
              dropZoneElm: pageElm?.ownerDocument.body,
              dropNode: draggingNode,
              targetNode: closestNode as PageNode,
              before:
                pageElm.getAttribute(dataAttributes.dropZoneBefore) ??
                undefined,
            })
          }
          // Hover on element except body blank space.
          else {
            const dropZoneElm = elementAtCursor.closest<HTMLElement>(
              `[${dataAttributes.dropZone}]`,
            )

            if (dropZoneElm) {
              const targetId = dropZoneElm.getAttribute(
                dataAttributes.dropZoneTargetNodeId,
              )

              if (!targetId) return

              const targetNode = getRenderedNodeById(targetId)

              if (!targetNode) return

              const before =
                dropZoneElm.getAttribute(dataAttributes.dropZoneBefore) ??
                undefined

              // Hover on temporary drop zone around droppable node
              if (dropZoneElm.classList.contains(TEMP_DROP_ZONE_CLASS_NAME)) {
                $dropZone.set({
                  dropZoneElm: dropZoneElm,
                  targetNode,
                  dropNode: draggingNode,
                  before,
                })
              } else {
                // Hover on element that is not droppable node.
                // So that drop zone becomes body again.
                // This situation is different from hover on body blank space.
                if (
                  dropZoneElm.parentElement?.isSameNode(
                    dropZoneElm.ownerDocument.body,
                  )
                ) {
                  $dropZone.set({
                    dropZoneElm: dropZoneElm.ownerDocument.body,
                    targetNode,
                    dropNode: draggingNode,
                    before,
                  })
                }
                // Hover on droppable node
                else {
                  const firstElementChild = dropZoneElm.firstElementChild

                  // If it doesn't exist, it means React component renders itself whole in somewhere else with portal.
                  if (firstElementChild) {
                    $dropZone.set({
                      dropZoneElm: firstElementChild,
                      targetNode,
                      dropNode: draggingNode,
                      before,
                    })
                  }
                }
              }
            }
            // Hover on nothing relevant
            else {
              $dropZone.set(null)
            }
          }
        }
      }
    }

    const onMouseUpAfterDrag = () => {
      window.removeEventListener('mousemove', onMouseMoveAfterDrag)
      window.removeEventListener('mouseup', onMouseUpAfterDrag)

      $isDraggingNode.set(false)

      clearTempDropZones()

      clone.remove()

      const dropZone = $dropZone.get()

      if (dropZone) {
        const { targetNode, dropNode, before } = dropZone

        commandInsertNodes(
          targetNode,
          [dropNode],
          before ? $allRenderedNodes.get()[before] : null,
        )
      }

      $dropZone.set(null)
    }

    window.addEventListener('mousemove', onMouseMoveAfterDrag)
    window.addEventListener('mouseup', onMouseUpAfterDrag)
  }
}

function clearTempDropZones() {
  document
    .querySelectorAll(`.${TEMP_DROP_ZONE_CLASS_NAME}`)
    .forEach((elm) => elm.remove())
}

function appendTemporaryDropZone(node: Node, nodeElm: Element) {
  const scale = Ground.scale
  const nodeElmRect = nodeElm.getBoundingClientRect()

  const leftDropZone = document.createElement('div')
  const rightDropZone = document.createElement('div')
  const topDropZone = document.createElement('div')
  const bottomDropZone = document.createElement('div')

  leftDropZone.classList.add(TEMP_DROP_ZONE_CLASS_NAME)
  rightDropZone.classList.add(TEMP_DROP_ZONE_CLASS_NAME)
  topDropZone.classList.add(TEMP_DROP_ZONE_CLASS_NAME)
  bottomDropZone.classList.add(TEMP_DROP_ZONE_CLASS_NAME)

  leftDropZone.setAttribute(dataAttributes.dropZone, '')
  rightDropZone.setAttribute(dataAttributes.dropZone, '')
  topDropZone.setAttribute(dataAttributes.dropZone, '')
  bottomDropZone.setAttribute(dataAttributes.dropZone, '')

  const parentNodeId = node.parent?.id

  if (!parentNodeId) return

  leftDropZone.setAttribute(dataAttributes.dropZoneTargetNodeId, parentNodeId)
  rightDropZone.setAttribute(dataAttributes.dropZoneTargetNodeId, parentNodeId)
  topDropZone.setAttribute(dataAttributes.dropZoneTargetNodeId, parentNodeId)
  bottomDropZone.setAttribute(dataAttributes.dropZoneTargetNodeId, parentNodeId)

  leftDropZone.setAttribute(dataAttributes.dropZoneId, alphanumericId())
  rightDropZone.setAttribute(dataAttributes.dropZoneId, alphanumericId())
  topDropZone.setAttribute(dataAttributes.dropZoneId, alphanumericId())
  bottomDropZone.setAttribute(dataAttributes.dropZoneId, alphanumericId())

  leftDropZone.setAttribute(dataAttributes.dropZoneBefore, node.id)
  rightDropZone.setAttribute(
    dataAttributes.dropZoneBefore,
    node.nextSibling?.id ?? '',
  )
  topDropZone.setAttribute(dataAttributes.dropZoneBefore, node.id)
  bottomDropZone.setAttribute(
    dataAttributes.dropZoneBefore,
    node.nextSibling?.id ?? '',
  )

  const easelRect = node.ownerPage
    ? findEaselIframe(node.ownerPage)?.getBoundingClientRect()
    : undefined

  // ahead/behind drop zones are always affected by zoom
  // because they are inside easel iframe

  leftDropZone.style.position = 'fixed'
  leftDropZone.style.left =
    nodeElmRect.left * scale + (easelRect?.left ?? 0) + 'px'
  leftDropZone.style.top =
    nodeElmRect.top * scale + (easelRect?.top ?? 0) + 'px'
  leftDropZone.style.width = DESIGN_MODE_EDGE_SPACE + 'px'
  leftDropZone.style.height = nodeElmRect.height * scale + 'px'
  leftDropZone.style.background = `
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        rgba(255, 255, 255, 0.5) 5px,
        rgba(255, 255, 255, 0.5) 10px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))
    `
  leftDropZone.style.transform = 'translate(-50%, 0%)'
  leftDropZone.style.zIndex = '1'

  rightDropZone.style.position = 'fixed'
  rightDropZone.style.left =
    nodeElmRect.left * scale +
    (easelRect?.left ?? 0) +
    nodeElmRect.width * scale +
    'px'
  rightDropZone.style.top =
    nodeElmRect.top * scale + (easelRect?.top ?? 0) + 'px'
  rightDropZone.style.width = DESIGN_MODE_EDGE_SPACE + 'px'
  rightDropZone.style.height = nodeElmRect.height * scale + 'px'
  rightDropZone.style.background = `
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        rgba(255, 255, 255, 0.5) 5px,
        rgba(255, 255, 255, 0.5) 10px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))
    `
  rightDropZone.style.transform = 'translate(-50%, 0%)'
  rightDropZone.style.zIndex = '1'

  topDropZone.style.position = 'fixed'
  topDropZone.style.left =
    nodeElmRect.left * scale + (easelRect?.left ?? 0) + 'px'
  topDropZone.style.top = nodeElmRect.top * scale + (easelRect?.top ?? 0) + 'px'
  topDropZone.style.width = nodeElmRect.width * scale + 'px'
  topDropZone.style.height = DESIGN_MODE_EDGE_SPACE + 'px'
  topDropZone.style.background = `
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        rgba(255, 255, 255, 0.5) 5px,
        rgba(255, 255, 255, 0.5) 10px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))
    `
  topDropZone.style.transform = 'translate(0%, -50%)'
  topDropZone.style.zIndex = '1'

  bottomDropZone.style.position = 'fixed'
  bottomDropZone.style.left =
    nodeElmRect.left * scale + (easelRect?.left ?? 0) + 'px'
  bottomDropZone.style.top =
    nodeElmRect.top * scale +
    (easelRect?.top ?? 0) +
    nodeElmRect.height * scale +
    'px'
  bottomDropZone.style.width = nodeElmRect.width * scale + 'px'
  bottomDropZone.style.height = DESIGN_MODE_EDGE_SPACE + 'px'
  bottomDropZone.style.background = `
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        rgba(255, 255, 255, 0.5) 5px,
        rgba(255, 255, 255, 0.5) 10px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))
    `
  bottomDropZone.style.transform = 'translate(0%, -50%)'
  bottomDropZone.style.zIndex = '1'

  Ground.element.appendChild(leftDropZone)
  Ground.element.appendChild(rightDropZone)
  Ground.element.appendChild(topDropZone)
  Ground.element.appendChild(bottomDropZone)
}

export function onMouseDownForSelecting(
  e: React.MouseEvent,
  nodeAtCursor: Node,
) {
  const startX = e.clientX
  const startY = e.clientY

  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    if (
      Math.abs(deltaX) >= DRAG_THRESHOLD ||
      Math.abs(deltaY) >= DRAG_THRESHOLD
    ) {
      // Clear events when drag threshold is reached
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }

  const onMouseUp = () => {
    // Clear mouse move and up events
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    // Select node on mouse up within DRAG_THRESHOLD
    selectNode(e, nodeAtCursor)
  }

  // Attach mouse move and up events
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

/**
 * Drag by clicking on page node.
 *
 * If other nodes that are not page node are selected, they are not moved.
 * Only selected page nodes are moved.
 */
export function onMouseDownPageForDragging(
  e: React.MouseEvent,
  page: PageNode,
) {
  const startX = e.clientX
  const startY = e.clientY

  /**
   * Initial coordinates of selected page nodes.
   */
  const initialCoordinates: Record<string, { x: number; y: number }> = {}

  $selectedNodes.get().forEach((node) => {
    if (node instanceof PageNode) {
      initialCoordinates[node.id] = {
        x: node.coordinates.x,
        y: node.coordinates.y,
      }
    }
  })

  const onMoueMove = (e: MouseEvent) => {
    const deltaX = Math.abs(e.clientX - startX)
    const deltaY = Math.abs(e.clientY - startY)

    if (deltaX >= DRAG_THRESHOLD || deltaY >= DRAG_THRESHOLD) {
      triggerDragStart()
      window.removeEventListener('mousemove', onMoueMove)
    }
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMoueMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMoueMove)
  window.addEventListener('mouseup', onMouseUp)

  const triggerDragStart = () => {
    const onMouseMoveOverThreshold = (e: MouseEvent) => {
      $isDraggingNode.set(true)

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      const scale = Ground.scale

      $selectedNodes.get().forEach((node) => {
        // Only move page nodes
        if (node instanceof PageNode) {
          node.coordinates = {
            x: initialCoordinates[node.id].x + deltaX / scale,
            y: initialCoordinates[node.id].y + deltaY / scale,
          }
        }
      })
    }

    const onMouseUpAfterDrag = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / Ground.scale
      const deltaY = (e.clientY - startY) / Ground.scale

      $isDraggingNode.set(false)

      History.push({
        actions: [
          new PageMoveAction({
            pages: $selectedNodes
              .get()
              .filter((node) => node instanceof PageNode) as PageNode[],
            delta: {
              x: deltaX,
              y: deltaY,
            },
          }),
        ],
        previousSelectedNodes: $selectedNodes.get(),
        nextSelectedNodes: $selectedNodes.get(),
      })

      window.removeEventListener('mousemove', onMouseMoveOverThreshold)
      window.removeEventListener('mouseup', onMouseUpAfterDrag)
    }

    window.addEventListener('mousemove', onMouseMoveOverThreshold)
    window.addEventListener('mouseup', onMouseUpAfterDrag)
  }
}

export function onMouseDownIframe(
  e: React.MouseEvent,
  page: PageNode,
  isPageItself: boolean,
) {
  const iframeElement = page.iframeElement

  if (!iframeElement) return

  const rect = iframeElement.getBoundingClientRect()
  const pointScale = 1 / Ground.scale
  const elementAtCursor = isPageItself
    ? null
    : iframeElement.contentDocument?.elementFromPoint(
        (e.clientX - rect.left) * pointScale,
        (e.clientY - rect.top) * pointScale,
      )

  if (!isPageItself && !elementAtCursor) return

  // Context menu (Right click)
  // Why mousedown instead of contextmenu event?: Doesn't work on Safari.
  if (e.button === 2) {
    e.preventDefault()

    const node = elementAtCursor
      ? getClosestSelectableNodeSet(elementAtCursor).node
      : page

    if (node && !$selectedNodes.get().includes(node)) {
      $selectedNodes.set([node])
    }

    $contextMenuPosition.set({ x: e.clientX, y: e.clientY })
    $isContextMenuOpen.set(true)
  }

  // Left click
  if (e.button === 0) {
    // Find closest selectable node and select it on mouse down
    const nodeAtCursor = elementAtCursor
      ? getClosestSelectableNodeSet(elementAtCursor).node
      : page

    // Node exists under cursor
    if (nodeAtCursor) {
      // If node is already selected.
      // - Only select it on mouse up within DRAG_THRESHOLD.
      if ($selectedNodes.get().includes(nodeAtCursor)) {
        onMouseDownForSelecting(e, nodeAtCursor)
      }
      // Select node on mouse down that is not already selected
      else {
        selectNode(e, nodeAtCursor)
      }

      // Find closest moveable node and start dragging it on mouse down
      const { node: movableNode, elm: movableElement } = elementAtCursor
        ? getClosestMoveableNodeSet(elementAtCursor)
        : {
            node: null,
            elm: null,
          }

      if (movableNode) {
        const movableElmRect = movableElement.getBoundingClientRect()
        const scale = Ground.scale

        onMouseDownForDragAndDropNode(e, {
          draggingNode: movableNode,
          cloneTargetElm: movableElement,
          elmX: e.clientX - rect.left - movableElmRect.left * scale,
          elmY: e.clientY - rect.top - movableElmRect.top * scale,
          elementScale: scale,
        })
      } else if (nodeAtCursor instanceof PageNode) {
        onMouseDownPageForDragging(e, nodeAtCursor)
      }
    }
  }
}
