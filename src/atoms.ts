import { atom, map } from 'nanostores'
import { FC } from 'react'
import { Node } from './node-class/node'
import { NodeDefinition } from './node-definition'

export const $devToolsRerenderFlag = atom(false)
export const $selectionRerenderFlag = atom(false)
export const $hoverRerenderFlag = atom(false)

export function triggerRerenderGuides(lazy = false) {
  if (lazy) {
    process.nextTick(() => {
      $hoverRerenderFlag.set(!$hoverRerenderFlag.get())
      $selectionRerenderFlag.set(!$selectionRerenderFlag.get())
    })
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
  droppingNodes: Node[]
  before?: string
} | null>(null)

export const $interactiveMode = atom(false)

export const $designMode = atom(false)

$designMode.listen(() => {
  process.nextTick(() => {
    triggerRerenderGuides()
  })
})

$interactiveMode.listen((interactiveMode) => {
  if (interactiveMode) {
    $hoveredNode.set(null)
    $selectedNodes.set([])
    $dropZone.set(null)
  }
})

export const $massMode = atom(false)

export const $dynamicLibrary = map<
  Record<
    string,
    {
      nodeDefinitions: Record<string, NodeDefinition>
      components: Record<string, FC>
    }
  >
>({})
