import { alphanumericId } from '@/alphanumeric'
import { Library } from '@/library'
import { NodeDefinition } from '@/node-definition'
import { serializeProps } from '@/serialize-props'
import { studioApp } from '@/studio-app'
import { MapStore, atom, map } from 'nanostores'
import { ReactNode } from 'react'
import { PageNode } from './page'

export type NodeName = 'Page' | 'Text' | (string & {})

export type InitNode = Omit<SerializedNode, 'id' | 'children'> & {
  id?: string
  children?: Node[]
}

export class Node {
  /** Unique ID */
  id = alphanumericId(7)

  library: Library
  nodeName: NodeName

  $studioProps: MapStore<{
    label: string
  }> = map({})

  $props: MapStore<any> = map({})
  $style: MapStore<any> = map({})

  /**
   * Do not override this property in subclasses because it has a subscription in the constructor.
   */
  $children = atom<Node[]>([])

  constructor(initNode: InitNode) {
    /**
     * Automatically update parent and ownerPage when children are changed.
     */
    this.$children.subscribe((newChildren, oldChildren) => {
      if (oldChildren) {
        oldChildren.forEach((child) => {
          Node.releaseParent(child)
          delete studioApp.allNodes[child.id]
        })
      }

      newChildren.forEach((child) => {
        Node.assignParent(child, this)
        studioApp.allNodes[child.id] = child
      })
    })

    const { id, library, nodeName, children, props, style } = initNode

    this.library = library
    this.nodeName = nodeName

    if (id) {
      this.id = id
    }

    if (props) {
      this.$props.set(props)
    }

    if (style) {
      this.$style.set(style)
    }

    // NOTE: assigning children should be done after subscribing $children
    if (children) {
      this.$children.set(children.map((child) => child.clone()))
    }
  }

  get definition(): NodeDefinition {
    return this.#getDefinition()
  }

  #getDefinition(): NodeDefinition {
    return studioApp.getNodeDefinition(this.library, this.nodeName)
  }

  private onMountCallbacks: ((element: HTMLElement | null) => void)[] = []

  onMount(callback: (element: HTMLElement | null) => void) {
    this.onMountCallbacks.push(callback)
  }

  executeOnMountCallbacks() {
    this.onMountCallbacks.forEach((callback) => callback(this.element))
  }

  /**
   * A real element that the node represents.
   * For page, it is the body of the iframe.
   * Otherwise, it is the first child of the wrapper element.
   *
   * TODO: What about overlay?
   *
   * Find the element by id from the ownerPage's iframe.
   * If the element has display: contents, its first child is the real element.
   * Otherwise, the found element is the real element itself.
   */
  get element(): HTMLElement | null {
    const element =
      this.ownerPage?.iframeElement?.contentDocument?.getElementById(
        `node-${this.id}`,
      )

    if (!element) {
      return null
    }

    if (element?.style.display === 'contents') {
      return element.firstElementChild as HTMLElement
    }

    return element
  }

  get style() {
    return this.$style.get()
  }

  get props() {
    return this.$props.get()
  }

  set props(any) {
    this.$props?.set(any)
  }

  get isRemovable() {
    return true
  }

  get isMovable() {
    return true
  }

  get isDroppable() {
    return this.definition.leaf !== true
  }

  get isDraggable() {
    return true
  }

  get isSelectable() {
    return true
  }

  private _ownerPage: PageNode | null = null

  get ownerPage() {
    return this._ownerPage
  }

  /** Only root node(PageNode)'s parent is null */
  private _parent: Node | null = null

  get parent() {
    return this._parent
  }

  get parents() {
    const parents: Node[] = []
    let parent = this.parent
    while (parent) {
      parents.push(parent)
      parent = parent.parent
    }
    return parents
  }

  /**
   * Release parent and ownerPage from the node and its children including slots.
   */
  private static releaseParent(node: Node) {
    const updateTargets = [node, ...node.allNestedChildren]

    updateTargets.forEach((child) => {
      child._ownerPage = null
    })

    node._parent = null
  }

  /**
   * Assign parent and transfer parent's ownerPage to the node and its children including slots.
   */
  private static assignParent(node: Node, parent: Node) {
    if (parent.ownerPage) {
      const updateTargets = [node, ...node.allNestedChildren]
      updateTargets.forEach((child) => {
        child._ownerPage = parent.ownerPage
        studioApp.allNodes[child.id] = child
      })
    }

    node._parent = parent
  }

  /**
   * Return only iterable children, excluding slots.
   */
  get children() {
    return this.$children.get()
  }

  set children(children: Node[]) {
    this.$children.set(children)
  }

  get allNestedChildren(): Node[] {
    return this.children.flatMap((child) => [child, ...child.allNestedChildren])
  }

  get previousSibling(): Node | null {
    if (this.parent) {
      const index = this.parent.children.indexOf(this)
      return this.parent.children[index - 1] ?? null
    }

    return null
  }

  get nextSibling(): Node | null {
    if (this.parent) {
      const index = this.parent.children.indexOf(this)
      return this.parent.children[index + 1] ?? null
    }

    return null
  }

  public append(...children: Node[]) {
    if (children.length === 0) return

    const removableChildren = children.filter(
      (child) => child.isRemovable && child !== this,
    )

    removableChildren.forEach((child) => {
      child.remove()
    })

    this.children = [...this.children, ...removableChildren]
  }

  public insertBefore(children: Node[] | Node, referenceNode: Node | null) {
    const childrenArray = Array.isArray(children) ? children : [children]

    if (childrenArray.length === 0) return

    const removableChildren = childrenArray.filter(
      (child) => child.isRemovable && child !== this,
    )

    if (!referenceNode) {
      this.append(...removableChildren)
      return
    }

    // Remember referenceNode's nextSibling
    const referenceNodeNextSibling = referenceNode.nextSibling

    removableChildren.forEach((child) => {
      // TODO: bulk remove by parent to avoid unnecessary re-render
      child.remove()
    })

    // After removing inserting nodes,
    // if inserting nodes include referenceNode, we cannot find referenceNode.
    if (removableChildren.includes(referenceNode)) {
      // If referenceNode was the last child of the parent, append to the end.
      if (referenceNodeNextSibling === null) {
        this.append(...removableChildren)
        return
      }
      // Insert before referenceNode's nextSibling
      else {
        this.insertBefore(removableChildren, referenceNodeNextSibling)
        return
      }
    }

    const referenceIndex = this.children.indexOf(referenceNode)

    this.children = [
      ...this.children.slice(0, referenceIndex),
      ...removableChildren,
      ...this.children.slice(referenceIndex),
    ]
  }

  public removeChild(child: Node) {
    this.removeChildren([child])
  }

  public removeChildren(children: Node[]) {
    if (children.some((child) => child.parent !== this)) {
      throw new Error('Some children are not contained by this node')
    }

    const removableChildren = children.filter((child) => child.isRemovable)

    this.children = this.children.filter((c) => !removableChildren.includes(c))
  }

  /**
   * Remove all iterable children
   */
  public removeAllChildren() {
    this.removeChildren(this.children)
  }

  /**
   * Remove itself from its parent.
   */
  remove() {
    if (this.parent) {
      this.parent.removeChild(this)
    }
  }

  generateCode(): string {
    const definition = this.#getDefinition()

    if (definition.generateCode) {
      return definition.generateCode(this)
    }

    const props = this.props
    const serializedProps = serializeProps(props, definition.props ?? [])
    const componentName = `${definition.mod}${definition.sub ? `.${definition.sub}` : ''}`

    if (this.children.length === 0) {
      return `<${componentName} ${serializedProps} />`
    }

    return `<${componentName} ${serializedProps}>
      ${this.children.map((child) => child.generateCode()).join('')}
    </${componentName}>`
  }

  clone(): Node {
    return new Node({
      library: this.library,
      nodeName: this.nodeName,
      props: this.props,
      style: this.style,
      children: this.children.map((child) => child.clone()),
    })
  }

  serialize(): SerializedNode {
    return {
      id: this.id,
      library: this.library,
      nodeName: this.nodeName,
      props: this.props,
      style: this.$style.get(),
      children:
        this.children === undefined || this.children.length === 0
          ? undefined
          : this.children.map((child) => child.serialize()),
    }
  }

  render = (): ReactNode => {
    return null
  }
}

export type SerializedNode = {
  id: string
  library: Library
  nodeName: NodeName
  props?: Record<string, any>
  style?: Record<string, any>
  children?: SerializedNode[]
}

export type NodeComponent<N extends Node> = (props: { node: N }) => JSX.Element
