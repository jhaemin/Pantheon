import { atom, computed } from 'nanostores'
import { Node } from './node-class/node'

/**
 * Use for finding the node by id when interacting with the DOM.
 */
export const $allRenderedNodes = atom<Record<string, Node>>({})

export const $devToolsRerenderFlag = atom(false)
export const $selectionRerenderFlag = atom(false)
export const $hoverRerenderFlag = atom(false)

export function triggerRerenderGuides(lazy = false) {
  if (lazy) {
    setTimeout(() => {
      $hoverRerenderFlag.set(!$hoverRerenderFlag.get())
      $selectionRerenderFlag.set(!$selectionRerenderFlag.get())
    }, 0)
  } else {
    $hoverRerenderFlag.set(!$hoverRerenderFlag.get())
    $selectionRerenderFlag.set(!$selectionRerenderFlag.get())
  }
}

export const $showDevTools = atom(false)

export const $isContextMenuOpen = atom(false)

export const $hoveredNode = atom<Node | null>(null)
export const $selectedNodes = atom<Node[]>([])

export const $isDraggingNode = atom(false)
export const $isAnimatingGround = atom(false)

export const $isResizingIframe = atom(false)

export const $dropZone = atom<{
  dropZoneElm: Element
  targetNode: Node
  dropNode: Node
  before?: string
} | null>(null)

export const $interactionMode = atom(false)

export const $designMode = atom(true)

$designMode.listen(() => {
  setTimeout(() => {
    triggerRerenderGuides()
  }, 0)
})

$interactionMode.listen((interactionMode) => {
  if (interactionMode) {
    $hoveredNode.set(null)
    $selectedNodes.set([])
    $dropZone.set(null)
  }
})

export const $currentPage = computed($selectedNodes, (selectedNodes) => {
  if (selectedNodes.length === 0) {
    return null
  }

  if (
    selectedNodes.every((node) => node.ownerPage === selectedNodes[0].ownerPage)
  ) {
    return selectedNodes[0].ownerPage
  }

  return null
})
