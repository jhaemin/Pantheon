import { Action, AddPageAction, RemovePageAction } from './action'
import { $hoveredNode, $selectedNodes } from './atoms'
import { Ground } from './ground'
import { History, HistoryStackItem } from './history'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'
import { isUnwrappableNode } from './node-lib'
import { NodeName } from './node-name'
import { InferNodeByName, nodeNameNodeMap } from './node-name-node-map'
import { studioApp } from './studio-app'

export function commandAppendNodes(parent: Node, nodes: Node[]) {
  const insertAction = parent.append(...nodes)

  if (!insertAction) return

  History.push({
    actions: [insertAction],
    previousSelectedNodes: $selectedNodes.get(),
    nextSelectedNodes: nodes,
  })

  setTimeout(() => {
    $selectedNodes.set(nodes)
  }, 0)
}

export function commandInsertNodes(
  parent: Node,
  nodes: Node[],
  before: Node | null,
) {
  const insertAction = parent.insertBefore(nodes, before)

  if (!insertAction) return

  History.push({
    actions: [insertAction],
    previousSelectedNodes: $selectedNodes.get(),
    nextSelectedNodes: nodes,
  })

  setTimeout(() => {
    $selectedNodes.set(nodes)
  }, 0)
}

export function commandDeleteNodes(nodes: Node[]) {
  const nextSelectionCandidate = nodes[0]?.previousSibling ?? nodes[0]?.parent
  const nextSelectedNodes = nextSelectionCandidate
    ? [nextSelectionCandidate]
    : []

  const historyItem: HistoryStackItem = {
    actions: [],
    previousSelectedNodes: [...$selectedNodes.get()],
    nextSelectedNodes,
  }

  nodes.forEach((node) => {
    const removeAction = node.remove()

    if (removeAction) {
      historyItem.actions.push(removeAction)
    }
  })

  History.push(historyItem)

  $selectedNodes.set(nextSelectedNodes)
  $hoveredNode.set(null)
}

export function commandWrapNodes<T extends NodeName>(
  nodes: Node[],
  wrappingNodeName: T,
): InferNodeByName<T> | undefined {
  if (nodes.length === 0) return

  const firstSelectedNode = $selectedNodes.get()[0]

  // If nothing selected, ignore.
  if (!firstSelectedNode) {
    return
  }

  const firstNode = nodes[0]

  if (!firstNode) return

  const parent = firstNode.parent

  if (!parent || !(parent instanceof Node)) return

  let nextSibling = firstNode.nextSibling

  let loopCount = 0

  while (nodes.find((node) => node.id === nextSibling?.id) !== undefined) {
    if (nextSibling) {
      nextSibling = nextSibling.nextSibling
    }

    loopCount++

    if (loopCount > 1000) {
      throw new Error('Infinite loop')
    }
  }

  const newWrapperNode = new nodeNameNodeMap[wrappingNodeName]()

  const appendAction = newWrapperNode.append(...nodes)
  const insertBeforeAction = parent.insertBefore([newWrapperNode], nextSibling)

  const actions: Action[] = []

  if (appendAction) actions.push(appendAction)
  if (insertBeforeAction) actions.push(insertBeforeAction)

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

  // First remove the unwrapping node from its parent
  const removeAction = parent.removeChild(unwrappingNode)
  const insertAction = parent.insertBefore(unwrappingNode.children, nextSibling)

  // TODO: Implement remove actions and History.push

  // const actions: Action[] = removeAction ? [removeAction] : []
  // if (insertAction) actions.push(insertAction)

  // History.push({
  //   actions,
  //   previousSelectedNodes: $selectedNodes.get(),
  //   nextSelectedNodes: unwrappingNode.children,
  // })
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
