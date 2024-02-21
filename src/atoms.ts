import { atom, onMount } from 'nanostores'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'

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

$selectedNodes.listen(() => {
  const selectedNodes = $selectedNodes.get()

  if (selectedNodes.length === 0) return

  if (
    selectedNodes.every((node) => node.ownerPage === selectedNodes[0].ownerPage)
  ) {
    $lastFocusedPage.set(selectedNodes[0].ownerPage)
  }
})

export const $isDraggingNode = atom(false)

$isDraggingNode.listen((isDraggingNode) => {
  if (isDraggingNode) {
    document.body.classList.add('dragging-node')
  } else {
    document.body.classList.remove('dragging-node')
  }
})

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

export const $lastFocusedPage = atom<PageNode | null>(null)

export const $drawerHeight = atom<number | undefined>(undefined)

export const $isDrawerLoaded = atom(false)

onMount($drawerHeight, () => {
  if (typeof window == 'undefined') return

  const height = localStorage.getItem('drawer-height') ?? '300'

  $drawerHeight.set(parseInt(height))
  $isDrawerLoaded.set(true)
})

$drawerHeight.subscribe((height) => {
  if (typeof window == 'undefined') return

  if (typeof height === 'number') {
    localStorage.setItem('drawer-height', height.toString())
    document.body.style.setProperty('--drawer-height', `${height}px`)
  }
})
