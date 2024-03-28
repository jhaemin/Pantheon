import { atom, computed } from 'nanostores'
import { Library } from './library'
import { Node, SerializedNode } from './node-class/node'
import { PageNode } from './node-class/page'
import { ViewNode } from './node-class/view'
import { NodeDefinition } from './node-definition'

type InitApp = Omit<SerializedApp, 'pages' | 'views'> & {
  pages?: PageNode[]
  views?: ViewNode[]
}

export class StudioApp {
  public allNodes: Record<string, Node> = {}

  private _$pages = atom<PageNode[]>([])
  private _$views = atom<ViewNode[]>([])

  readonly $appTitle = atom('Studio App')
  readonly $libraries = atom<Library[]>([]) // TODO: auto set latest version

  public readonly $pages = computed(this._$pages, (pages) => pages)
  public readonly $views = computed(this._$views, (views) => views)

  $isReady = atom(false)

  private nodeDefinitions: Record<string, Record<string, NodeDefinition>> = {}

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

  initialize(initApp: InitApp) {
    this.$appTitle.set(initApp.appTitle)
    this.$libraries.set(initApp.libraries)

    if (initApp.pages) {
      this._$pages.set(initApp.pages)
    }

    if (initApp.views) {
      this._$views.set(initApp.views)
    }

    Promise.allSettled(
      initApp.libraries.map((library) => StudioApp.loadDefinition(library)),
    ).then((definitions) => {
      if (definitions.some((def) => def.status === 'rejected')) {
        throw new Error('Failed to load node definitions')
      }

      this.nodeDefinitions = definitions.reduce((acc, def, i) => {
        const library = initApp.libraries[i]
        const key = `${library.name}-${library.version}`

        if (def.status === 'fulfilled') {
          return { ...acc, [key]: def.value }
        }

        return acc
      }, {})

      this.$isReady.set(true)
    })
  }

  getNodeDefinition(library: Library, nodeName: string) {
    const libraryKey = `${library.name}-${library.version}`
    const nodeDefinition = this.nodeDefinitions[libraryKey]?.[nodeName]

    if (!nodeDefinition) {
      throw new Error(
        `Node definition is not found: ${library.name}-${library.version} ${nodeName}`,
      )
    }

    return nodeDefinition
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

  serialize(): SerializedApp {
    return {
      studioVersion: '1.0.0',
      appTitle: this.$appTitle.get(),
      libraries: this.$libraries.get(),
      pages: this.pages.map((page) => page.serialize()),
      views: this.views.map((view) => view.serialize()),
    }
  }

  static async loadDefinition(library: Library) {
    try {
      const libraryKey = `${library.name}-${library.version}`
      const { nodeDefinitions } = await import(
        `@/libraries/${libraryKey}/node-definitions`
      )

      return nodeDefinitions as Record<string, NodeDefinition>
    } catch (e) {
      throw new Error(
        `Failed to load node definitions from ${library.name}-${library.version}`,
      )
    }
  }
}

export type SerializedApp = {
  studioVersion: string
  appTitle: string
  libraries: Library[]
  pages: SerializedNode[]
  views: SerializedNode[]
}

/**
 * The global default StudioApp instance
 */
export const studioApp = new StudioApp()
