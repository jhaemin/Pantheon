import { type ReadableAtom, type WritableAtom } from 'nanostores'
import { PageNode } from './node-class/node'
import { StudioApp } from './studio-app'

type Shared = {
  /**
   * Share data between easel and top window
   *
   * It can be accessed both from top window and easel iframe.
   * They're injected from `EaselWrapper` component.
   */
  $designMode: WritableAtom<boolean>
  $massMode: WritableAtom<boolean>
  $scale: ReadableAtom<number>
}

declare global {
  interface Window {
    /**
     * Share page atom between iframe and parent window
     */
    parentFrame: HTMLIFrameElement

    /**
     * Only use inside iframe.
     * If you want to access from top window, just import modules.
     */
    shared: Shared

    ownerApp: StudioApp

    // Node class
    pageNode: PageNode
  }
}
