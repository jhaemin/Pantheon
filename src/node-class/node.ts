import { alphanumericId } from '@/alphanumeric'
import { NodeDefinition, Prop, Slot } from '@/node-definition'
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
  componentName?: string
}

export abstract class Node<SlotKey extends string = string> {
  /** Unique ID */
  readonly id = alphanumericId(7)
  abstract readonly nodeName: NodeName
  public componentName?: string

  readonly isUnselectable: boolean

  constructor(preOptions?: NodePreOptions) {
    if (preOptions) {
      this._isRemovable = preOptions.isRemovable ?? true
      this._isDraggable = preOptions.isDraggable ?? true
      this.slotKey = preOptions.slotKey
      this.slotLabel = preOptions.slotLabel
      this.componentName = preOptions.componentName
    }

    this.isUnselectable = preOptions?.isUnselectable ?? false

    this._$children.listen((children) => {
      if (this.ownerPage) {
        this.ownerPage.refreshUnselectableNodes()
      }
    })

    /**
     * Automatically update parent and ownerPage when children are changed.
     */
    this._$children.subscribe((newChildren, oldChildren) => {
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

    /**
     * Automatically update parent and ownerPage when slots are changed.
     */
    this.$slots.subscribe((newSlots, oldSlots) => {
      if (oldSlots) {
        Object.values(oldSlots).forEach((slot) => {
          if (slot) {
            Node.releaseParent(slot)
            delete studioApp.allNodes[slot.id]
          }
        })
      }

      Object.values(newSlots).forEach((slot) => {
        if (slot) {
          Node.assignParent(slot, this)
          studioApp.allNodes[slot.id] = slot
        }
      })
    })
  }

  private updateComponentName(componentName: string) {
    this.componentName = componentName
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
   */
  get element(): HTMLElement | null {
    return (
      this.ownerPage?.iframeElement?.contentDocument?.getElementById(
        `node-${this.id}`,
      ) ?? null
    )
  }

  public readonly propsDefinition: Prop[] = []

  /**
   * Default values for props defined by original component author.
   */
  readonly defaultProps?: any
  readonly $props: MapStore<any> = map({})
  readonly slotProps: Record<string, MapStore<any>> = {}

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

  /**
   * Do not override this property in subclasses because it has a subscription in the constructor.
   */
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

  /**
   * Do not override this property in subclasses because it has a subscription in the constructor.
   */
  public readonly $slots = atom<{
    [key in SlotKey]?: Node | null
  }>({})

  public readonly slotsDefinition: NonNullable<NodeDefinition['slots']> = []

  get slots() {
    return this.$slots.get()
  }

  get slotsArray() {
    return this.slotsInfoArray
      .map(({ key }) => this.$slots.get()[key])
      .filter((node) => !!node) as Node[]
  }

  public slotsInfoArray: Omit<Slot<SlotKey>, 'slots'>[] = []

  private _slotsInfo: Record<string, Omit<Slot<SlotKey>, 'slots'>> | null = null

  get slotsInfo() {
    if (this._slotsInfo === null) {
      this._slotsInfo = Object.fromEntries(
        this.slotsInfoArray.map((slotInfo) => [slotInfo.key, slotInfo]),
      )
    }

    return this._slotsInfo
  }

  enableSlot(slotKey: string) {
    const slotInfo = this.slotsInfo[slotKey]
    const { required, key, label, componentName } = slotInfo

    if (slotInfo) {
      const newSlot = new FragmentNode({
        slotKey: key,
        slotLabel: label ?? key,
        isRemovable: !required,
        isDraggable: false,
        componentName,
      })

      this.setSlot(slotKey, newSlot)

      this.$slots.set({
        ...this.$slots.get(),
        [slotKey]: newSlot,
      })

      return newSlot
    } else {
      throw new Error(`Slot ${slotKey} is not defined in ${this.nodeName}`)
    }
  }

  toggleSlot(slotKey: SlotKey) {
    if (this.slotsInfo[slotKey].required) {
      throw new Error(`Slot ${slotKey} is required. Cannot be toggled.`)
    }

    if (this.$slots.get()[slotKey]) {
      this.disableSlotByKey(slotKey)
    } else {
      this.enableSlot(slotKey)
    }
  }

  setSlot(slotKey: string, node: Node | null) {
    if (this.slotsInfo[slotKey] === undefined) {
      throw new Error(`Slot ${slotKey} is not defined in ${this.nodeName}`)
    }

    this.$slots.set({
      ...this.$slots.get(),
      [slotKey]: node,
    })
  }

  disableSlot(node: Node) {
    const newSlots = { ...this.$slots.get() }
    const slotName = Object.keys(newSlots).find(
      (key) => newSlots[key as SlotKey] === node,
    )

    if (slotName) {
      const slotInfo = this.slotsInfo[slotName]

      if (slotInfo.required) {
        throw new Error(`Slot ${slotName} is required. Cannot be disabled.`)
      }

      this.setSlot(slotName, null)
    }
  }

  disableSlotByKey(slotKey: SlotKey) {
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

    const generateSlots = (
      slotsDefinition: NodeDefinition['slots'],
    ): string => {
      if (!slotsDefinition || slotsDefinition.length === 0) {
        return ''
      }

      return slotsDefinition
        .map((slotDef) => {
          const slotNode = this.$slots.get()[slotDef.key as SlotKey]

          const openTag = slotDef.componentName
            ? `<${slotDef.componentName} ${serializeProps(slotNode?.props ?? {})}>`
            : ''
          const closeTag = slotDef.componentName
            ? `</${slotDef.componentName}>`
            : ''

          if (slotNode) {
            return `${openTag}
              ${generateSlots(slotDef.slots)}
              ${slotNode.generateCode()}
            ${closeTag}`
          }

          return ''
        })
        .join('')
    }

    const slots = generateSlots(this.slotsDefinition)

    if (this.childrenAndSlots.length === 0) {
      return `<${componentName} ${serializedProps} />`
    }

    return `<${componentName} ${serializedProps}>
      ${slots}
      ${this.children.map((child) => child.generateCode()).join('')}
    </${componentName}>`
  }

  public serialize(): SerializedNode {
    return {
      nodeName: this.nodeName,
      componentName: this.componentName,
      props: this.props,
      children: this.children.map((child) => child.serialize()),
      slots: Object.fromEntries(
        Object.entries(this.$slots.get()).map(([key, value]) => [
          key,
          (value as Node)?.serialize(),
        ]),
      ),
    }
  }
}

export type SerializedNode = {
  nodeName: string
  componentName?: string
  props: Record<string, any>
  children: SerializedNode[]
  slots: Record<string, SerializedNode>
}

/**
 * This class should reside in this file because it extends Node and Node uses it.
 */
export class FragmentNode extends Node {
  readonly nodeName = 'Fragment'
  readonly componentName = 'Fragment'

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
