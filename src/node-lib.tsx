import { dataAttributes } from './data-attributes'
import { Node } from './node-class/node'
import { studioApp } from './studio-app'

/**
 * Calculates the index of a child node in its parent's children array
 *
 * If the given node is not a child of any node, `undefined` is returned
 */
export function getChildNodeIndex(child: Node) {
  const parent = child.parent

  if (!parent) {
    return undefined
  }

  return parent.children.indexOf(child)
}

export function getClosestNodeFromElm(elm: Element): Node | null {
  // If the target is the body element, it means the target is the page node itself
  if (elm.isSameNode(elm.ownerDocument.body)) {
    const nodeId = getNodeIdFromElement(elm.ownerDocument.body)

    if (!nodeId) {
      return null
    }

    return studioApp.getNodeById(nodeId)!
  }

  const elmWithNodeAttribute = elm.closest(`[${dataAttributes.node}]`)

  if (!elmWithNodeAttribute) {
    return null
  }

  const nodeId = elmWithNodeAttribute.getAttribute(dataAttributes.nodeId)!

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

  if (closestNode.isUnselectable) {
    // Page node element is always body element.
    // But other node elements are first element child of the node wrapper element.
    return getClosestSelectableNodeFromElm(
      closestNode.element?.parentElement ?? document.body,
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
      closestNode.element?.parentElement ?? document.body,
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

export function getNodeIdFromElement(elm: Element) {
  return elm.getAttribute(dataAttributes.nodeId)
}
