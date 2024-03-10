import { useEffect, useRef } from 'react'
import { makeNodeProps } from './data-attributes'
import { Node } from './node-class/node'
import { nodeComponentMap } from './node-map'

/**
 * TODO: inject data attributes to the node component directly
 */
export function NodeComponent({ node }: { node: Node }) {
  const nodeWrapperElementRef = useRef<HTMLDivElement>(null!)
  const Component = nodeComponentMap[node.nodeName]

  /**
   * Note that PageNode cannot be unmounted because once it is deleted,
   * its iframe is immediately removed from the DOM.
   * Which means there is no chance for the PageNode to be unmounted.
   */
  useEffect(() => {
    node.executeOnMountCallbacks()
  }, [node])

  if (!Component) {
    return <div {...makeNodeProps(node)}>Unsupported component</div>
  }

  return <Component node={node as never} />
}

export function renderChildren(children: Node[]) {
  return children.map((child) => <NodeComponent key={child.id} node={child} />)
}
