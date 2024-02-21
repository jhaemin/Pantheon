import { atom, computed } from 'nanostores'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'
import { ViewNode } from './node-class/view'

class StudioApp {
  private _$pages = atom<PageNode[]>([])
  private _$views = atom<ViewNode[]>([])

  readonly $pages = computed(this._$pages, (pages) => pages)
  readonly $views = computed(this._$views, (views) => views)

  public allNodes: Record<string, Node> = {}

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

  constructor() {
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

/**
 * The global default StudioApp instance
 */
export const studioApp = new StudioApp()
