import { nodeComponentMap } from '@/node-map'
import { useEffect, useRef } from 'react'
import {
  makeNodeAttributes,
  makeNodeDropZoneAttributes,
} from './data-attributes'
import { Node } from './node-class/node'
import styles from './node-component.module.scss'

export function NodeComponent({ node }: { node: Node }) {
  const nodeWrapperElementRef = useRef<HTMLDivElement>(null!)
  const Component = nodeComponentMap[node.nodeName]

  const commonNodeElementProps = {
    ...makeNodeAttributes(node),

    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    },

    ...(node.isDroppable ? makeNodeDropZoneAttributes(node) : undefined),
  }

  /**
   * VERY IMPORTANT LOGIC
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

    // Page's wrapper element is the body of the iframe
    if (node.nodeName === 'Page') {
      Node.attachWrapperElement(node, document.body)
    }
    // Otherwise
    else {
      Node.attachWrapperElement(node, nodeWrapperElementRef.current)
    }

    return () => {
      const allRenderedNodes = window.shared.$allRenderedNodes.get()
      delete allRenderedNodes[node.id]
      window.shared.$allRenderedNodes.set({ ...allRenderedNodes })

      Node.detachWrapperElement(node)
    }
  }, [node])

  // PageNode's wrapper element is the body itself
  if (node.nodeName === 'Page') {
    return <Component node={node as never} />
  }

  return (
    // display: contents wrapper
    <span
      ref={nodeWrapperElementRef}
      id={node.id}
      className={styles.nodeComponentWrapper}
      {...commonNodeElementProps}
    >
      <Component node={node as never} />
      {/* guaranteed type safety */}
    </span>
  )
}

export function renderChildren(children: Node[]) {
  return children.map((child) => <NodeComponent key={child.id} node={child} />)
}
