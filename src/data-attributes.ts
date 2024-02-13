import { Node } from './node-class/node'

export const dataAttributes = {
  node: 'data-studio-node',
  nodeId: 'data-studio-node-id',
  keepNodeSelection: 'data-studio-keep-node-selection',
  dropZone: 'data-studio-drop-zone',
  dropZoneId: 'data-studio-drop-zone-id',
  dropZoneTargetNodeId: 'data-studio-drop-zone-target-node-id',
  dropZoneBefore: 'data-studio-drop-zone-before',
}

export const keepNodeSelectionAttribute = {
  [dataAttributes.keepNodeSelection]: 'true',
}

export function makeNodeAttributes(node: Node) {
  return {
    [dataAttributes.node]: 'true',
    [dataAttributes.nodeId]: node.id,
  }
}

export function makeNodeDropZoneAttributes(node: Node) {
  return {
    [dataAttributes.dropZone]: 'true',
    [dataAttributes.dropZoneId]: node.id,
    [dataAttributes.dropZoneTargetNodeId]: node.id,
    [dataAttributes.dropZoneBefore]: '',
  }
}

export function makeDropZoneAttributes(dropZoneData: {
  dropZoneId: string
  dropZoneTargetNodeId: string
  dropZoneBefore: string
}) {
  const { dropZoneId, dropZoneTargetNodeId, dropZoneBefore } = dropZoneData

  return {
    [dataAttributes.dropZone]: 'true',
    [dataAttributes.dropZoneId]: dropZoneId,
    [dataAttributes.dropZoneTargetNodeId]: dropZoneTargetNodeId,
    [dataAttributes.dropZoneBefore]: dropZoneBefore,
  }
}

/**
 * TODO: instead of checking closest data attribute, stop propagation of the event
 */
export function shouldKeepNodeSelection(target: Element) {
  return target.closest(`[${dataAttributes.keepNodeSelection}]`)
}
