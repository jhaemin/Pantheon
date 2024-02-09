import { alphanumericId } from '@/alphanumeric'
import { NodeName } from '@/node-name'
import { serializeProps } from '@/serialize-props'
import { MapStore, atom, computed, map } from 'nanostores'
import { InsertNodesAction, RemoveNodeAction } from '../action'
import { PageNode } from './page'

export abstract class Node {
  /** Unique ID */
  readonly id = alphanumericId(7)
  abstract readonly nodeName: NodeName

  constructor(preOptions?: { isRemovable?: boolean; isDraggable?: boolean }) {
    if (preOptions) {
      this._isRemovable = preOptions.isRemovable ?? true
      this._isDraggable = preOptions.isDraggable ?? true
    }
  }

  /**
   * Wrapper element for the node.
   * `display: contents` is used to make the wrapper element invisible and let the children take its place.
   */
  private _wrapperElement: HTMLElement | null = null

  get wrapperElement() {
    return this._wrapperElement
  }

  static attachWrapperElement(node: Node, wrapperElement: HTMLElement) {
    node._wrapperElement = wrapperElement

    node.onMountCallbacks.forEach((callback) => callback(node.element))
  }

  static detachWrapperElement(node: Node) {
    node._wrapperElement = null
  }

  private onMountCallbacks: ((element: HTMLElement | null) => void)[] = []

  onMount(callback: (element: HTMLElement | null) => void) {
    this.onMountCallbacks.push(callback)
  }

  /**
   * A real element that the node represents.
   * For page, it is the body of the iframe.
   * Otherwise, it is the first child of the wrapper element.
   *
   * TODO: What about overlay?
   */
  get element(): HTMLElement | null {
    return (this._wrapperElement?.firstElementChild as HTMLElement) ?? null
  }

  /**
   * Default values for props defined by original component author.
   */
  readonly defaultProps?: any
  readonly $props: MapStore<any> = map({})
  /**
   * Additional props used by Studio.
   */
  readonly $additionalProps: MapStore<any> = map({})

  get props() {
    return this.$props?.get() ?? undefined
  }

  set props(any) {
    this.$props?.set(any)
  }

  private _isRemovable = true

  get isRemovable() {
    return this._isRemovable
  }

  get isDroppable() {
    return true
  }

  private _isDraggable = true

  get isDraggable() {
    return this._isDraggable
  }

  get ownerPage(): PageNode | null {
    return this.parent?.ownerPage ?? null
  }

  get closestSlotOwner(): Node | null {
    if (Object.keys(this.$slots.get()).length > 0) {
      return this
    }
    return this.parent?.closestSlotOwner ?? null
  }

  /** Only root node(PageNode)'s parent is null */
  private _parent: Node | null = null

  get parent() {
    return this._parent
  }

  protected static releaseParent(node: Node) {
    node._parent = null
  }

  protected static assignParent(node: Node, parent: Node) {
    node._parent = parent
  }

  protected _$children = atom<Node[]>([])
  public readonly $children = computed(this._$children, (children) => children)

  get children() {
    const slots = this.$slots.get()
    const slotNodes = Object.values(slots).filter((node) => !!node) as Node[]

    return [...this.$children.get(), ...slotNodes]
  }

  set children(children: Node[]) {
    this._$children.set(children)
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

  public append(...children: Node[]): InsertNodesAction | undefined {
    if (children.length === 0) return

    const insertNodesAction = new InsertNodesAction({
      insertedNodes: children,
      newContainableParent: this,
      newNextSibling: null,
      oldContainableParent: children[0].parent,
      oldNextSibling: children[0].nextSibling,
    })

    children.forEach((child) => {
      child.remove()
      Node.assignParent(child, this)
    })
    this.children = [...this.children, ...children]

    return insertNodesAction
  }

  public insertBefore(
    children: Node[],
    referenceNode: Node | null,
  ): InsertNodesAction | undefined {
    if (children.length === 0) return

    const removableChildren = children.filter((child) => child.isRemovable)

    if (!referenceNode) {
      return this.append(...removableChildren)
    }

    const insertNodesAction = new InsertNodesAction({
      insertedNodes: removableChildren,
      newContainableParent: this,
      newNextSibling: referenceNode,
      oldContainableParent: removableChildren[0].parent,
      oldNextSibling: removableChildren[0].nextSibling,
    })

    const referenceNodeNextSibling = referenceNode.nextSibling

    removableChildren.forEach((child) => {
      child.remove() // TODO: bulk remove by parent to avoid unnecessary re-render
      Node.assignParent(child, this)
    })

    // After removing inserting nodes,
    // if inserting nodes include referenceNode, we cannot find referenceNode.
    if (removableChildren.includes(referenceNode)) {
      if (referenceNodeNextSibling === null) {
        return this.append(...removableChildren)
      } else {
        return this.insertBefore(removableChildren, referenceNodeNextSibling)
      }
    }

    const referenceIndex = this.children.indexOf(referenceNode)

    this.children = [
      ...this.children.slice(0, referenceIndex),
      ...removableChildren,
      ...this.children.slice(referenceIndex),
    ]

    return insertNodesAction
  }

  /**
   * TODO: merge with `removeChildren`. Use spread
   */
  public removeChild(child: Node) {
    if (!child.isRemovable) return

    const removeNodeAction = new RemoveNodeAction({
      removedNode: child,
      oldParent: this,
      oldNextSibling: child.nextSibling,
    })

    Node.releaseParent(child)
    this.children = this.children.filter((c) => c !== child)

    this.removeSlot(child)

    return removeNodeAction
  }

  public removeChildren(children: Node[]) {
    const removableChildren = children.filter((child) => child.isRemovable)
    removableChildren.forEach((child) => Node.releaseParent(child))
    this.children = this.children.filter((c) => !removableChildren.includes(c))
  }

  public removeAllChildren() {
    this.removeChildren(this.children)
  }

  public readonly $slots = atom<Record<string, Node | null>>({})

  setSlot(slotKey: string, node: Node) {
    if (this.$slots.get()[slotKey]) {
      this.removeSlotByKey(slotKey)
    }

    Node.assignParent(node, this)
    this.$slots.set({ ...this.$slots.get(), [slotKey]: node })
  }

  removeSlot(node: Node) {
    Node.releaseParent(node)
    const newSlots = { ...this.$slots.get() }
    const slotName = Object.keys(newSlots).find((key) => newSlots[key] === node)
    if (slotName) {
      newSlots[slotName] = null
      this.$slots.set(newSlots)
    }
  }

  removeSlotByKey(slotKey: string) {
    const slot = this.$slots.get()[slotKey]
    if (slot) {
      this.removeSlot(slot)
    }
  }

  /**
   * Remove itself from its parent.
   */
  remove(): RemoveNodeAction | null {
    if (this.parent) {
      const removeNodeAction = new RemoveNodeAction({
        removedNode: this,
        oldParent: this.parent,
        oldNextSibling: this.nextSibling,
      })

      this.parent.removeChild(this)

      return removeNodeAction
    }

    return null
  }

  public generateCode(): string {
    const props = this.props
    const serializedProps = serializeProps(props)

    if (this.children.length === 0) {
      return `<${this.nodeName} ${serializedProps} />`
    }

    return `<${this.nodeName} ${serializedProps}>${this.children
      .map((child) => child.generateCode())
      .join('')}</${this.nodeName}>`
  }
}
