import {
  Action,
  AddPageAction,
  DisableSlotAction,
  InsertNodeAction,
  RemoveNodeAction,
  RemovePageAction,
} from './action'
import { $hoveredNode, $selectedNodes } from './atoms'
import { Ground } from './ground'
import { History, HistoryStackItem } from './history'
import { type InferNodeByName } from './infer-node-by-name'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'
import { isUnwrappableNode } from './node-lib'
import { NodeName } from './node-name'
import { nodeNameNodeMap } from './node-name-node-map'
import { studioApp } from './studio-app'

export function commandInsertNodes(
  parent: Node,
  nodes: Node[],
  before: Node | null,
) {
  const removableNodes = nodes.filter((node) => node.isRemovable)

  const actions = removableNodes.map((node) => {
    return new InsertNodeAction({
      insertedNode: node,
      oldParent: node.parent,
      oldNextSibling: node.nextSibling,
      newParent: parent,
      newNextSibling: before,
    })
  })

  parent.insertBefore(nodes, before)

  History.push({
    actions,
    previousSelectedNodes: $selectedNodes.get(),
    nextSelectedNodes: nodes,
  })

  setTimeout(() => {
    $selectedNodes.set(nodes)
  }, 0)
}

export function commandRemoveNodes(nodes: Node[]) {
  const removableNodes = nodes.filter((node) => node.isRemovable)

  const nextSelectionCandidate =
    removableNodes[0]?.previousSibling ?? removableNodes[0]?.parent
  const nextSelectedNodes = nextSelectionCandidate
    ? [nextSelectionCandidate]
    : []

  const actions = removableNodes.map((node) => {
    const action = (() => {
      if (node.slotKey) {
        if (!node.parent) {
          throw new Error('Node has no parent')
        }

        return new DisableSlotAction({
          slot: node,
          slotParent: node.parent,
        })
      }

      return new RemoveNodeAction({
        removedNode: node,
        oldParent: node.parent,
        oldNextSibling: node.nextSibling,
      })
    })()

    node.remove()

    return action
  })

  const historyItem: HistoryStackItem = {
    actions,
    previousSelectedNodes: [...$selectedNodes.get()],
    nextSelectedNodes,
  }

  // If nothing to delete, ignore.
  if (actions.length === 0) return

  History.push(historyItem)

  $selectedNodes.set(nextSelectedNodes)
  $hoveredNode.set(null)
}

export function commandWrapNodes<T extends NodeName>(
  nodes: Node[],
  wrappingNodeName: T,
): InferNodeByName<T> | undefined {
  const removableNodes = nodes.filter((node) => node.isRemovable)
  if (removableNodes.length === 0) return

  const firstSelectedNode = $selectedNodes.get()[0]

  // If nothing selected, ignore.
  if (!firstSelectedNode) {
    return
  }

  const firstNode = removableNodes[0]

  if (!firstNode) return

  const parent = firstNode.parent

  if (!parent || !(parent instanceof Node)) return

  let nextSibling = firstNode.nextSibling

  let loopCount = 0

  while (
    removableNodes.find((node) => node.id === nextSibling?.id) !== undefined
  ) {
    if (nextSibling) {
      nextSibling = nextSibling.nextSibling
    }

    loopCount++

    if (loopCount > 1000) {
      throw new Error('Infinite loop')
    }
  }

  const actions: Action[] = []

  const newWrapperNode = new nodeNameNodeMap[wrappingNodeName]()

  removableNodes.forEach((node) => {
    if (node.slotKey) {
      if (!node.parent) {
        throw new Error('Node has no parent')
      }

      actions.push(
        new DisableSlotAction({
          slot: node,
          slotParent: node.parent,
        }),
      )
    } else {
      actions.push(
        new RemoveNodeAction({
          removedNode: node,
          oldParent: node.parent,
          oldNextSibling: node.nextSibling,
        }),
      )
    }
  })

  newWrapperNode.append(...removableNodes)

  actions.push(
    new InsertNodeAction({
      insertedNode: newWrapperNode,
      oldParent: newWrapperNode.parent,
      oldNextSibling: newWrapperNode.nextSibling,
      newParent: parent,
      newNextSibling: nextSibling,
    }),
  )

  parent.insertBefore(newWrapperNode, nextSibling)

  History.push({
    actions,
    previousSelectedNodes: $selectedNodes.get(),
    nextSelectedNodes: [newWrapperNode],
  })

  return newWrapperNode as InferNodeByName<T>
}

export function commandUnwrapNode(unwrappingNode: Node) {
  if (!isUnwrappableNode(unwrappingNode)) return

  const nextSibling = unwrappingNode.nextSibling
  const parent = unwrappingNode.parent

  if (!(parent instanceof Node)) return

  const actions: Action[] = []

  actions.push(
    new RemoveNodeAction({
      removedNode: unwrappingNode,
      oldParent: unwrappingNode.parent,
      oldNextSibling: unwrappingNode.nextSibling,
    }),
  )

  // First remove the unwrapping node from its parent
  parent.removeChild(unwrappingNode)

  unwrappingNode.children.forEach((child) => {
    actions.push(
      new InsertNodeAction({
        insertedNode: child,
        oldParent: child.parent,
        oldNextSibling: child.nextSibling,
        newParent: parent,
        newNextSibling: nextSibling,
      }),
    )
  })

  parent.insertBefore(unwrappingNode.children, nextSibling)
}

export function commandFocusPage(page: PageNode, animation = false) {
  Ground.focus(page, animation)
}

export function commandAddPage() {
  const newPage = new PageNode()

  History.push({
    actions: [new AddPageAction({ page: newPage })],
    previousSelectedNodes: $selectedNodes.get(),
    nextSelectedNodes: [newPage],
  })

  const maxX = Math.max(
    0,
    ...studioApp.pages.map(
      ({ coordinates: { x }, dimensions: { width } }) => x + width,
    ),
  )

  const minY = Math.min(
    0,
    ...studioApp.pages.map(
      ({ coordinates: { y }, dimensions: { height } }) => y + height,
    ),
  )

  newPage.coordinates = {
    x: maxX + 100,
    y: minY + 100,
  }

  studioApp.addPage(newPage)

  const unsubscribe = newPage.onIframeMount(() => {
    unsubscribe()

    $selectedNodes.set([newPage])
    Ground.focus(newPage, studioApp.pages.length > 1)
  })
}

export function commandRemovePage(page: PageNode) {
  History.push({
    actions: [new RemovePageAction({ page })],
    previousSelectedNodes: $selectedNodes.get(),
    nextSelectedNodes: [],
  })

  studioApp.removePage(page)
  $selectedNodes.set([])
}
