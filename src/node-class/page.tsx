import { RemoveNodeAction } from '@/action'
import { Prop } from '@/node-definition'
import { StudioApp, studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { renderChildren } from '../node-component'
import { Node } from './node'

export const DEFAULT_PAGE_LABEL = 'New Page'

export class PageNode extends Node {
  readonly nodeName = 'Page'
  public ownerApp: StudioApp = studioApp

  public $props = map({
    title: DEFAULT_PAGE_LABEL,
  })
  public propsDefinition: Prop[] = [
    {
      key: 'title',
      type: 'string',
      default: DEFAULT_PAGE_LABEL,
      label: 'Title',
      required: true,
    },
  ]

  public $unselectableNodes = atom<Node[]>([])

  public refreshUnselectableNodes() {
    this.$unselectableNodes.set(
      this.allNestedChildren.filter((child) => child.isUnselectable),
    )
  }

  private _iframeElement: HTMLIFrameElement | null = null

  get iframeElement() {
    return this._iframeElement
  }

  get element() {
    return this._iframeElement?.contentDocument?.body ?? null
  }

  private onIframeMountCallbacks: ((
    iframeElement: HTMLIFrameElement,
  ) => void)[] = []

  onIframeMount(callback: (iframeElement: HTMLIFrameElement) => void) {
    this.onIframeMountCallbacks.push(callback)

    // Return a function to unsubscribe
    return () => {
      this.onIframeMountCallbacks = this.onIframeMountCallbacks.filter(
        (cb) => cb !== callback,
      )
    }
  }

  get isDraggable(): boolean {
    return false
  }

  static attachIframeElement(
    pageNode: PageNode,
    iframeElement: HTMLIFrameElement,
  ) {
    pageNode._iframeElement = iframeElement
    pageNode.onIframeMountCallbacks.forEach((callback) =>
      callback(iframeElement),
    )
  }

  static detachIframeElement(pageNode: PageNode) {
    pageNode._iframeElement = null
  }

  readonly $dimensions = map<{ width: number; height: number }>({
    width: 720,
    height: 640,
  })
  readonly $coordinates = map<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  readonly $info = map<{ label: string }>({
    label: 'New Page',
  })

  get dimensions() {
    return this.$dimensions.get()
  }

  set dimensions(value: { width: number; height: number }) {
    this.$dimensions.set(value)
  }

  get coordinates() {
    return this.$coordinates.get()
  }

  set coordinates(value: { x: number; y: number }) {
    this.$coordinates.set(value)
  }

  get ownerPage(): PageNode {
    return this
  }

  remove(): RemoveNodeAction {
    studioApp.removePage(this)
    return new RemoveNodeAction({
      removedNode: this,
      oldParent: null,
      oldNextSibling: null,
    })
  }

  public generateCode(): string {
    if (this.children.length === 0) {
      return 'null'
    }

    const openTag = this.children.length === 1 ? '' : '<>'
    const closeTag = this.children.length === 1 ? '' : '</>'

    return `${openTag}${this.children.map((child) => child.generateCode()).join('')}${closeTag}`
  }

  public serialize() {
    return {
      ...super.serialize(),
      title: this.$props.get().title,
    }
  }
}

export function PageNodeComponent({ node }: { node: PageNode }) {
  const children = useStore(node.$children)

  return <>{renderChildren(children)}</>
}
