import { Node } from './node-class/node'

export const dataAttributes = {
  node: 'data-studio-node',
  nodeId: 'data-studio-node-id',
  ownerPageId: 'data-studio-owner-page-id',
  keepNodeSelection: 'data-studio-keep-node-selection',
  dropZone: 'data-studio-drop-zone',
  dropZoneId: 'data-studio-drop-zone-id',
  dropZoneOwnerPageId: 'data-studio-drop-zone-owner-page-id',
  dropZoneTargetNodeId: 'data-studio-drop-zone-target-node-id',
  dropZoneBefore: 'data-studio-drop-zone-before',
}

export const keepNodeSelectionAttribute = {
  [dataAttributes.keepNodeSelection]: 'true',
}

export function makeNodeBaseAttrs(node: Node) {
  return {
    [dataAttributes.node]: 'true',
    [dataAttributes.nodeId]: node.id,
    [dataAttributes.ownerPageId]: node.ownerPage?.id,
  }
}

export function makeNodeDropZoneAttrs(node: Node) {
  return {
    [dataAttributes.dropZone]: 'true',
    [dataAttributes.dropZoneId]: node.id,
    [dataAttributes.dropZoneTargetNodeId]: node.id,
    [dataAttributes.dropZoneBefore]: '',
    [dataAttributes.dropZoneOwnerPageId]: node.ownerPage?.id,
  }
}

export function makeDropZoneAttributes(dropZoneData: {
  dropZoneId: string
  dropZoneTargetNodeId: string
  dropZoneBefore: string | undefined
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

export function makeNodeAttrs(node: Node) {
  return {
    id: `node-${node.id}`,
    ...makeNodeBaseAttrs(node),
    ...(node.isDroppable ? makeNodeDropZoneAttrs(node) : undefined),
  }
}
