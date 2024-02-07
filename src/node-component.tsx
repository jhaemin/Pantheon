import { dataAttributes } from '@/constants'
import { nodeComponentMap } from '@/node-map'
import { useEffect, useRef } from 'react'
import { Node } from './node-class/node'
import styles from './node-component.module.scss'

export function NodeComponent({ node }: { node: Node }) {
  const nodeWrapperElementRef = useRef<HTMLDivElement>(null!)
  const Component = nodeComponentMap[node.nodeName]

  const commonNodeElementProps = {
    [dataAttributes.node]: true,

    [dataAttributes.nodeId]: node.id,

    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    },

    ...(window.shared.isDroppableNode(node)
      ? {
          [dataAttributes.dropZone]: true,
          [dataAttributes.dropZoneId]: node.id,
          [dataAttributes.dropZoneTargetNodeId]: node.id,
          [dataAttributes.dropZoneBefore]: '',
        }
      : undefined),
  }

  /**
   * Very IMPORTANT logic
   *
   * When a node is mounted, we need to register it to `allEaselNodeAtoms`.
   * Then when a node is unmounted, we need to unregister it from `allEaselNodeAtoms`.
   *
   * Note that PageNode cannot be unmounted because once it is deleted, its iframe is removed from the DOM. Which means there is no chance for the PageNode to be unmounted.
   * So, to delete a PageNode, we need to run below logic in `EaselWrapper` component again.
   */
  useEffect(() => {
    window.shared.$allRenderedNodes.set({
      ...window.shared.$allRenderedNodes.get(),
      [node.id]: node,
    })

    Node.attachWrapperElement(node, nodeWrapperElementRef.current)

    return () => {
      const allRenderedNodes = window.shared.$allRenderedNodes.get()
      delete allRenderedNodes[node.id]
      window.shared.$allRenderedNodes.set({ ...allRenderedNodes })

      Node.detachWrapperElement(node)
    }
  }, [node])

  return (
    <div
      ref={nodeWrapperElementRef}
      id={node.id}
      className={styles.nodeComponentWrapper}
      {...commonNodeElementProps}
    >
      <Component node={node as never} /> {/* guaranteed type safety */}
    </div>
  )
}

export function renderChildren(children: Node[]) {
  return children.map((child) => <NodeComponent key={child.id} node={child} />)
}
