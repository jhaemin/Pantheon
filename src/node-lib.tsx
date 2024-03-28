import { Node } from './node-class/node'
import { studioApp } from './studio-app'

// TODO: handle direct children. display: contents vs direct

export function getClosestNodeFromElm(elm: Element): Node | null {
  // If the target is the body element, it means the target is the page node itself
  if (elm.isSameNode(elm.ownerDocument.body)) {
    if (!elm.ownerDocument.body.id.startsWith('node-')) {
      return null
    }

    const nodeId = elm.ownerDocument.body.id.split('-')[1]

    if (!nodeId) {
      return null
    }

    return studioApp.getNodeById(nodeId)!
  }

  const idElm = elm.closest(`[id^="node-"]`)

  if (idElm === null) {
    return null
  }

  const nodeId = idElm.id.split('-')[1]

  if (!nodeId) {
    throw new Error('Node does not have an id')
  }

  const node = studioApp.getNodeById(nodeId)

  if (!node) {
    return null
  }

  return node
}

/**
 * Some containable nodes don't allow to select children nodes. (temporarily)
 *
 * For example, Text inside Flex is selectable while Text inside Button is not selectable.
 */
export function getClosestSelectableNodeFromElm(elm: Element): Node | null {
  const closestNode = getClosestNodeFromElm(elm)

  if (!closestNode) {
    return null
  }

  if (!closestNode.isSelectable) {
    // Page node element is always body element.
    // But other node elements are first element child of the node wrapper element.
    return getClosestSelectableNodeFromElm(
      closestNode.element?.parentElement?.parentElement ?? document.body,
    )
  }

  return closestNode
}

export function getClosestDraggableNodeSet(elm: Element): Node | null {
  const closestNode = getClosestNodeFromElm(elm)

  if (!closestNode) {
    return null
  }

  if (!closestNode.isDraggable) {
    // Page node element is always body element.
    // But other node elements are first element child of the node wrapper element.
    return getClosestDraggableNodeSet(
      closestNode.element?.parentElement?.parentElement ?? document.body,
    )
  }

  return closestNode
}

/**
 * TODO: check with node property instead of node name
 */
export function isUnwrappableNode(node: Node) {
  return false

  // if (node.children.length === 0) return false

  // const nodeName = node.nodeName
  // const unwrappableNodeNames: NodeName[] = ['RadixFlex', 'RadixContainer']

  // return unwrappableNodeNames.includes(nodeName)
}
