import { atom, computed } from 'nanostores'
import { PageNode } from './node-class/page'

export class StudioApp {
  private _$pages = atom<PageNode[]>([])
  readonly $pages = computed(this._$pages, (pages) => pages)

  get pages() {
    return this._$pages.get()
  }

  addPage(page: PageNode) {
    this._$pages.set([...this.pages, page])
  }

  insertPageBefore(page: PageNode, beforePage: PageNode | null) {
    if (beforePage === null) {
      this.addPage(page)
      return
    }

    const index = this.pages.indexOf(beforePage)
    const pages = [...this.pages]
    pages.splice(index, 0, page)
  }

  removePage(page: PageNode) {
    this._$pages.set(this.pages.filter((p) => p !== page))
  }
}

/**
 * The global default StudioApp instance
 */
export const studioApp = new StudioApp()
