import { nodeComponentMap } from '@/node-map'
import { useEffect, useRef } from 'react'
import {
  makeNodeAttributes,
  makeNodeDropZoneAttributes,
} from './data-attributes'
import { Node } from './node-class/node'

/**
 * TODO: inject data attributes to the node component directly
 */
export function NodeComponent({ node }: { node: Node }) {
  const nodeWrapperElementRef = useRef<HTMLDivElement>(null!)
  const Component = nodeComponentMap[node.nodeName]

  const commonNodeElementProps = {
    ...makeNodeAttributes(node),
    ...(node.isDroppable ? makeNodeDropZoneAttributes(node) : undefined),
  }

  /**
   * Note that PageNode cannot be unmounted because once it is deleted, its iframe is removed from the DOM. Which means there is no chance for the PageNode to be unmounted.
   * So, to delete a PageNode, we need to run below logic in `EaselWrapper` component again.
   */
  useEffect(() => {
    node.executeOnMountCallbacks()
  }, [node])

  return <Component node={node as never} {...commonNodeElementProps} />
}

export function renderChildren(children: Node[]) {
  return children.map((child) => <NodeComponent key={child.id} node={child} />)
}
