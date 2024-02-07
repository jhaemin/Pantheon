import { atom } from 'nanostores'
import { Action } from './action'
import { $hoveredNode, $selectedNodes } from './atoms'
import { Node } from './node-class/node'

export type HistoryStackItem = {
  actions: Action[]
  previousSelectedNodes: Node[]
  nextSelectedNodes: Node[]
}

export class History {
  static $historyStack = atom<HistoryStackItem[]>([])
  static $historyPointer = atom(-1)

  static get historyStack() {
    return History.$historyStack.get()
  }

  static set historyStack(historyStack: HistoryStackItem[]) {
    History.$historyStack.set(historyStack)
  }

  static get historyPointer() {
    return History.$historyPointer.get()
  }

  static set historyPointer(historyPointer: number) {
    History.$historyPointer.set(historyPointer)
  }

  static push(historyStackItem: HistoryStackItem) {
    if (History.historyPointer < History.historyStack.length - 1) {
      History.historyStack = History.historyStack.slice(
        0,
        History.historyPointer + 1,
      )
    }

    History.historyStack = [...History.historyStack, historyStackItem]
    History.historyPointer += 1
  }

  static undo() {
    $hoveredNode.set(null)

    if (History.historyPointer >= 0) {
      const stackItem = History.historyStack[History.historyPointer]

      stackItem.actions.reverse().forEach((action) => action.undo())

      setTimeout(() => {
        $selectedNodes.set([...stackItem.previousSelectedNodes])
      }, 0)

      History.historyPointer -= 1
    }
  }

  static redo() {
    $hoveredNode.set(null)

    if (History.historyPointer < History.historyStack.length - 1) {
      History.historyPointer += 1

      const stackItem = History.historyStack[History.historyPointer]

      stackItem.actions.forEach((action) => action.redo())

      setTimeout(() => {
        $selectedNodes.set([...stackItem.nextSelectedNodes])
      }, 0)
    }
  }
}
