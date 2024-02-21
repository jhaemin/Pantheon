import { alphanumericId } from '@/alphanumeric'
import { NodeDefinition } from '@/node-definition'
import { NodeName } from '@/node-name'
import { serializeProps } from '@/serialize-props'
import { studioApp } from '@/studio-app'
import { MapStore, atom, computed, map } from 'nanostores'
import { type PageNode } from './page'

export type NodePreOptions = {
  isRemovable?: boolean
  isDraggable?: boolean
  isUnselectable?: boolean
  slotKey?: string
  slotLabel?: string
}

export abstract class Node {
  /** Unique ID */
  readonly id = alphanumericId(7)
  abstract readonly nodeName: NodeName
  readonly componentName?: string

  readonly isUnselectable: boolean

  constructor(preOptions?: NodePreOptions) {
    if (preOptions) {
      this._isRemovable = preOptions.isRemovable ?? true
      this._isDraggable = preOptions.isDraggable ?? true
      this.slotKey = preOptions.slotKey
      this.slotLabel = preOptions.slotLabel
    }

    this.isUnselectable = preOptions?.isUnselectable ?? false

    this._$children.listen((children) => {
      if (this.ownerPage) {
        this.ownerPage.refreshUnselectableNodes()
      }
    })

    this._$children.subscribe((newChildren, oldChildren) => {
      oldChildren?.forEach((child) => Node.releaseParent(child))
      newChildren.forEach((child) => Node.assignParent(child, this))
    })

    this.$slots.subscribe((newSlots, oldSlots) => {
      if (oldSlots) {
        Object.values(oldSlots).forEach(
          (slot) => slot && Node.releaseParent(slot),
        )
      }
      Object.values(newSlots).forEach(
        (slot) => slot && Node.assignParent(slot, this),
      )
    })
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

  get closestSlotOwner(): Node | null {
    if (Object.keys(this.$slots.get()).length > 0) {
      return this
    }
    return this.parent?.closestSlotOwner ?? null
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
    const updateTargets = [node, ...node.allNestedChildrenAndSlots]

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
      const updateTargets = [node, ...node.allNestedChildrenAndSlots]
      updateTargets.forEach((child) => {
        child._ownerPage = parent.ownerPage
        studioApp.allNodes[child.id] = child
      })
    }

    node._parent = parent
  }

  protected _$children = atom<Node[]>([])
  public readonly $children = computed(this._$children, (children) => children)

  /**
   * Return only iterable children, excluding slots.
   */
  get children() {
    return this.$children.get()
  }

  /**
   * Return all children including slots.
   */
  get childrenAndSlots() {
    const slots = this.$slots.get()

    return [...this.$children.get(), ...this.slotsArray]
  }

  set children(children: Node[]) {
    this._$children.set(children)
  }

  get allNestedChildren(): Node[] {
    return this.children.flatMap((child) => [child, ...child.allNestedChildren])
  }

  get allNestedChildrenAndSlots(): Node[] {
    return this.childrenAndSlots.flatMap((child) => [
      child,
      ...child.allNestedChildrenAndSlots,
    ])
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
      child.remove() // TODO: bulk remove by parent to avoid unnecessary re-render
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

    removableChildren.forEach((child) => {
      const isSlot = child.slotKey !== undefined

      if (isSlot && !this.slotsInfo[child.slotKey].required) {
        this.disableSlot(child)
      }
    })

    this.children = this.children.filter((c) => !removableChildren.includes(c))
  }

  /**
   * Remove all iterable children
   */
  public removeAllChildren() {
    this.removeChildren(this.children)
  }

  public readonly slotKey?: string
  public readonly slotLabel?: string

  public readonly $slots = atom<Record<string, Node | null>>({})

  public readonly slotsDefinitions: NodeDefinition['slots'] = []

  get slots() {
    return this.$slots.get()
  }

  get slotsArray() {
    return this.slotsInfoArray
      .map(({ key }) => this.$slots.get()[key])
      .filter((node) => !!node) as Node[]
  }

  public slotsInfoArray: { required: boolean; key: string; label: string }[] =
    []

  // private _slotsInfo: Record<
  //   string,
  //   { required: boolean; key: string; label: string }
  // > = {}

  /**
   * TODO: improve performance by memoizing because it never changes
   */
  get slotsInfo() {
    return Object.fromEntries(
      this.slotsInfoArray.map((slotInfo) => [slotInfo.key, slotInfo]),
    )
  }

  enableSlot(slotKey: string) {
    const slotInfo = this.slotsInfo[slotKey]
    const { required, key, label } = slotInfo

    if (slotInfo) {
      const newSlot = new FragmentNode({
        slotKey: key,
        slotLabel: label ?? key,
        isRemovable: !required,
        isDraggable: false,
      })

      this.setSlot(slotKey, newSlot)

      return newSlot
    } else {
      throw new Error(`Slot ${slotKey} is not defined in ${this.nodeName}`)
    }
  }

  toggleSlot(slotKey: string) {
    if (this.slotsInfo[slotKey].required) {
      throw new Error(`Slot ${slotKey} is required`)
    }

    if (this.$slots.get()[slotKey]) {
      this.disableSlotByKey(slotKey)
    } else {
      this.enableSlot(slotKey)
    }
  }

  setSlot(slotKey: string, node: Node) {
    if (this.slotsInfo[slotKey] === undefined) {
      throw new Error(`Slot ${slotKey} is not defined in ${this.nodeName}`)
    }

    this.$slots.set({ ...this.$slots.get(), [slotKey]: node })
  }

  disableSlot(node: Node) {
    const newSlots = { ...this.$slots.get() }
    const slotName = Object.keys(newSlots).find((key) => newSlots[key] === node)

    if (slotName) {
      const slotInfo = this.slotsInfo[slotName]

      if (slotInfo.required) {
        throw new Error(`Slot ${slotName} is required. Cannot be disabled.`)
      }

      newSlots[slotName] = null
      this.$slots.set(newSlots)
    }
  }

  disableSlotByKey(slotKey: string) {
    const slot = this.$slots.get()[slotKey]
    if (slot) {
      this.disableSlot(slot)
    }
  }

  /**
   * Remove itself from its parent.
   */
  remove() {
    if (this.parent) {
      this.parent.removeChild(this)
    }
  }

  /**
   * TODO: slots
   */
  public generateCode(): string {
    const props = this.props
    const serializedProps = serializeProps(props)
    const componentName = this.componentName ?? this.nodeName

    if (this.children.length === 0) {
      return `<${componentName} ${serializedProps} />`
    }

    return `<${componentName} ${serializedProps}>${this.children
      .map((child) => child.generateCode())
      .join('')}</${componentName}>`
  }

  public serialize(): any {
    return {
      nodeName: this.nodeName,
      props: this.props,
      children: this.children.map((child) => child.serialize()),
      slots: Object.fromEntries(
        Object.entries(this.$slots.get()).map(([key, value]) => [
          key,
          value?.serialize(),
        ]),
      ),
    }
  }
}

export class FragmentNode extends Node {
  readonly nodeName = 'Fragment'

  public generateCode(): string {
    if (this.children.length === 0) {
      return ''
    }

    if (this.children.length === 1) {
      return this.children[0].generateCode()
    }

    return `<>${this.children.map((child) => child.generateCode()).join('')}</>`
  }
}
