import { $selectedNodes } from './atoms'
import { Node } from './node-class/node'
import { PageNode } from './node-class/page'
import { studioApp } from './studio-app'

export abstract class Action {
  abstract undo(): void
  abstract redo(): void
}

export class AddPageAction extends Action {
  private page: PageNode

  constructor({ page }: { page: PageNode }) {
    super()
    this.page = page
  }

  undo(): void {
    studioApp.removePage(this.page)
  }

  redo(): void {
    studioApp.addPage(this.page)
  }
}

export class RemovePageAction extends Action {
  private page: PageNode

  constructor({ page }: { page: PageNode }) {
    super()
    this.page = page
  }

  undo(): void {
    studioApp.addPage(this.page)
  }

  redo(): void {
    studioApp.removePage(this.page)
  }
}

export class InsertNodeAction extends Action {
  private insertedNode: Node
  private oldParent: Node | null
  private oldNextSibling: Node | null
  private newParent: Node
  private newNextSibling: Node | null

  constructor({
    insertedNode,
    oldParent,
    oldNextSibling,
    newParent,
    newNextSibling,
  }: {
    insertedNode: Node
    oldParent: Node | null
    oldNextSibling: Node | null
    newParent: Node
    newNextSibling: Node | null
  }) {
    super()
    this.insertedNode = insertedNode
    this.oldParent = oldParent
    this.oldNextSibling = oldNextSibling
    this.newParent = newParent
    this.newNextSibling = newNextSibling
  }

  undo(): void {
    // Inserted from other parent
    if (this.oldParent) {
      this.oldParent.insertBefore(this.insertedNode, this.oldNextSibling)
    }
    // Inserted newly
    else {
      this.insertedNode.remove()
    }
  }

  redo(): void {
    this.newParent.insertBefore(this.insertedNode, this.newNextSibling)
  }
}

export class RemoveNodeAction extends Action {
  private removedNode: Node
  /**
   * If parent is null, it means the node is a page node
   */
  private oldParent: Node | null
  private oldNextSibling: Node | null

  constructor({
    removedNode,
    oldParent,
    oldNextSibling,
  }: {
    removedNode: Node
    oldParent: Node | null
    oldNextSibling: Node | null
  }) {
    super()
    this.removedNode = removedNode
    this.oldParent = oldParent
    this.oldNextSibling = oldNextSibling
  }

  undo(): void {
    if (this.oldParent) {
      this.oldParent.insertBefore([this.removedNode], this.oldNextSibling)
    } else {
      // Page
      studioApp.insertPageBefore(
        this.removedNode as PageNode,
        this.oldNextSibling as PageNode,
      )
    }
  }

  redo(): void {
    this.removedNode.remove()
    $selectedNodes.set([])
  }
}

export class EnableSlotAction extends Action {
  private slotParent: Node
  private slot: Node

  constructor({ slotParent, slot }: { slotParent: Node; slot: Node }) {
    super()
    this.slotParent = slotParent
    this.slot = slot
  }

  undo(): void {
    this.slotParent.disableSlot(this.slot)
  }

  redo(): void {
    this.slotParent.setSlot(this.slot.slotKey!, this.slot)
  }
}

export class DisableSlotAction extends Action {
  private slotParent: Node
  private slot: Node

  constructor({ slotParent, slot }: { slotParent: Node; slot: Node }) {
    super()
    this.slotParent = slotParent
    this.slot = slot
  }

  undo(): void {
    this.slotParent.setSlot(this.slot.slotKey!, this.slot)
  }

  redo(): void {
    this.slotParent.disableSlot(this.slot)
  }
}

export class PageResizeAction extends Action {
  private page: PageNode
  private oldSize: { width: number; height: number }
  private newSize: { width: number; height: number }

  constructor({
    page,
    oldSize,
    newSize,
  }: {
    page: PageNode
    oldSize: { width: number; height: number }
    newSize: { width: number; height: number }
  }) {
    super()
    this.page = page
    this.oldSize = oldSize
    this.newSize = newSize
  }

  undo(): void {
    this.page.dimensions = this.oldSize
  }

  redo(): void {
    this.page.dimensions = this.newSize
  }
}

export class PageMoveAction extends Action {
  private pages: PageNode[]
  private delta: { x: number; y: number }

  constructor({
    pages,
    delta,
  }: {
    pages: PageNode[]
    delta: { x: number; y: number }
  }) {
    super()
    this.pages = pages
    this.delta = delta
  }

  undo(): void {
    this.pages.forEach((page) => {
      page.coordinates = {
        x: page.coordinates.x - this.delta.x,
        y: page.coordinates.y - this.delta.y,
      }
    })
  }

  redo(): void {
    this.pages.forEach((page) => {
      page.coordinates = {
        x: page.coordinates.x + this.delta.x,
        y: page.coordinates.y + this.delta.y,
      }
    })
  }
}
