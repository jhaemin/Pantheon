import { atom, computed } from 'nanostores'
import { Node, SerializedNode } from './node-class/node'
import { PageNode, PageNodeComponent } from './node-class/page'
import { ViewNode } from './node-class/view'

export const LATEST_LIBRARY = 'radix-themes-2.0.3'

export class StudioApp {
  public allNodes: Record<string, Node> = {}

  private _$pages = atom<PageNode[]>([])
  private _$views = atom<ViewNode[]>([])

  readonly $appTitle = atom('Studio App')
  readonly $library = atom(LATEST_LIBRARY) // TODO: auto set latest version

  public readonly $pages = computed(this._$pages, (pages) => pages)
  public readonly $views = computed(this._$views, (views) => views)

  nodeComponentMap: Record<string, any> = {
    Page: PageNodeComponent,
  }

  constructor(serializedApp?: SerializedApp) {
    if (serializedApp) {
      this.$appTitle.set(serializedApp.appTitle)
      this.$library.set(serializedApp.library)
    }

    this._$pages.subscribe((newPages, oldPages) => {
      if (oldPages) {
        oldPages.forEach((page) => {
          delete this.allNodes[page.id]
        })
      }

      newPages.forEach((page) => {
        this.allNodes[page.id] = page
      })
    })
  }

  getNodeById(nodeId: string) {
    const node = this.allNodes[nodeId]

    if (!node) {
      console.group('getRenderedNodeById - NOT FOUND')
      console.log('allNodes', studioApp.allNodes)
      console.warn(`Node is not registered in the app: ${nodeId}`)
      console.groupEnd()
      return null
    }

    return node
  }

  get pages() {
    return this._$pages.get()
  }

  addPage(page: PageNode) {
    this._$pages.set([...this.pages, page])

    this.allNodes[page.id] = page
  }

  insertPageBefore(page: PageNode, beforePage: PageNode | null) {
    if (beforePage === null) {
      this.addPage(page)
      return
    }

    const index = this.pages.indexOf(beforePage)
    const pages = [...this.pages]
    pages.splice(index, 0, page)

    this.allNodes[page.id] = page
  }

  removePage(page: PageNode) {
    this._$pages.set(this.pages.filter((p) => p !== page))

    delete this.allNodes[page.id]
  }

  get views() {
    return this._$views.get()
  }

  addView(view: ViewNode) {
    this._$views.set([...this.views, view])
  }

  removeView(view: ViewNode) {
    this._$views.set(this.views.filter((v) => v !== view))
  }
}

export type SerializedApp = {
  studioVersion: string
  appTitle: string
  library: string
  pages: SerializedNode[]
  views: SerializedNode[]
}

/**
 * The global default StudioApp instance
 */
export const studioApp = new StudioApp()
