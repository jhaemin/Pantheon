import { stringifyLibraryKey } from '@/library'
import { useStore } from '@nanostores/react'
import { batched } from 'nanostores'
import { ReactNode, createElement, useEffect, useState } from 'react'
import { DESIGN_MODE_EDGE_SPACE } from '../../constants'
import { makeNodeAttrs } from '../../data-attributes'
import { EmptyPlaceholder } from '../../empty-placeholder'
import { Node } from '../../node-class/node'
import { $dynamicComponents } from './easel-in-iframe'

function getNodeComponent(node: Node) {
  const { library } = node
  const libraryKey = stringifyLibraryKey(library)
  const dynamicComponents = $dynamicComponents.get()
  const definition = node.definition
  const mod = definition.mod ?? definition.nodeName
  const Component = definition.sub
    ? dynamicComponents[libraryKey]?.[mod]?.[definition.sub]
    : dynamicComponents[libraryKey]?.[mod]

  return Component
}

function getChildren(node: Node, children: Node[]) {
  if (node.definition.leaf) {
    return undefined
  }

  if (
    node.nodeName !== 'Page' &&
    children.length === 0 &&
    node.definition.gapless
  ) {
    const isDirect =
      node.definition.directChild ||
      node.parent?.definition.allChildrenDirect ||
      false

    // Inject node attributes to direct children because they are not wrapped with a display: contents div
    const attributes = isDirect ? makeNodeAttrs(node) : {}
    return <EmptyPlaceholder name={node.nodeName} {...attributes} />
  } else if (children.length === 0) {
    return undefined
  }

  return renderChildren(children)
}

function makeNodeProps(
  node: Node,
  props: Record<string, any>,
  style: Record<string, any>,
  designMode: boolean,
) {
  return {
    key: node.id,
    ...makeNodeAttrs(node),
    ...props,
    style: {
      ...style,
      paddingTop:
        node.definition.gapless && designMode
          ? DESIGN_MODE_EDGE_SPACE
          : style.paddingTop,
      boxShadow:
        node.definition.gapless && designMode
          ? '0 0 0 1px #ddd'
          : style.boxShadow,
      backgroundImage:
        node.definition.gapless && designMode
          ? 'url(/handle.png)'
          : style.backgroundImage,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 0',
      backgroundSize: '16px 12px',
    },
  }
}

export function NodeComponent({ node }: { node: Node }) {
  const { nodeName, library } = node
  const libraryKey = `${library.name}-${library.version}`
  const definition = node.definition
  const Component = getNodeComponent(node)
  const designMode = useStore(window.shared.$designMode)
  const massMode = useStore(window.shared.$massMode)

  const children = useStore(node.$children)
  const props = useStore(node.$props)
  const style = useStore(node.$style)

  const [_, setForceUpdate] = useState(false)

  /**
   * Since the direct children are rendered inside the parent node directly without a wrapper,
   * useStore() cannot be used to listen to the changes of the direct children.
   * So, we need to listen to the changes by using batched() and listen(),
   * then manually re-render the parent.
   */
  useEffect(() => {
    const directChildren = node.definition.allChildrenDirect
      ? children
      : children.filter((child) => child.definition.directChild)

    const $batch = batched(
      [
        ...directChildren.map((child) => child.$children),
        ...directChildren.map((child) => child.$props),
        ...directChildren.map((child) => child.$style),
      ],
      () => {
        setForceUpdate((prev) => !prev)
      },
    )

    const unsubscribe = $batch.listen(() => {})

    return () => {
      unsubscribe()
    }
  }, [node, children])

  /**
   * Note that PageNode cannot be unmounted because once it is deleted,
   * its iframe is immediately removed from the DOM.
   * Which means there is no chance for the PageNode to be unmounted.
   */
  useEffect(() => {
    node.executeOnMountCallbacks()
  }, [node])

  if (!Component || !definition) {
    return (
      <div {...makeNodeAttrs(node)}>
        Unsupported node: {nodeName} from {libraryKey}
      </div>
    )
  }

  // return <Component node={node as never} />
  // return createElement(
  //   Component,
  //   makeNodeProps(node, props, style, designMode),
  //   getChildren(node, children),
  // )

  return createElement(
    'span',
    {
      style: {
        display: 'contents',
        pointerEvents:
          massMode && (node.definition.sub || node.nodeName === 'Text')
            ? 'none'
            : undefined,
      },
      ...makeNodeAttrs(node),
    },
    createElement(
      Component,
      makeNodeProps(node, props, style, designMode),
      getChildren(node, children),
    ),
  )
}

export function renderChildren(children: Node[]): ReactNode {
  const reactNode = children.map((child) => {
    if (
      child.definition.directChild ||
      child.parent?.definition.allChildrenDirect
    ) {
      const designMode = window.shared.$designMode.get()
      const style = child.$style.get()
      const Component = getNodeComponent(child)

      return createElement(
        Component,
        makeNodeProps(child, child.$props.get(), style, designMode),
        getChildren(child, child.$children.get()),
      )
    }

    // TODO: need more investigation where this display: contents wrapping makes an error
    // Node.element is related.
    // node-lib.tsx closestNode.element?.parentElement is related.
    return <NodeComponent key={child.id} node={child} />
  })

  if (reactNode.length === 1) {
    return reactNode[0]
  }

  return reactNode
}
