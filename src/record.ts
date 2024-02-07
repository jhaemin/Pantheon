// import { map } from 'nanostores'

// export type AddRecord = {
//   type: 'add'
//   $inserted: NodeAtom
//   $parent: NodeAtom<ContainableNode>
//   before?: string
// }

// export type DeleteRecord = {
//   type: 'delete'
//   $deleted: NodeAtom
//   $parent: NodeAtom<ContainableNode>
//   before?: string
// }

// export type MoveRecord = {
//   type: 'move'
//   $moved: NodeAtom
//   $from: NodeAtom<ContainableNode>
//   fromNextSiblingId?: string
//   $to: NodeAtom<ContainableNode>
//   toNextSiblingId?: string
// }

// export type Record = AddRecord | MoveRecord

// const $recordsHistory = map<{
//   recordsBundle: Record[][]
//   currentIndex: number
// }>({
//   recordsBundle: [],
//   currentIndex: -1,
// })

// $recordsHistory.subscribe(() => {
//   console.log($recordsHistory.get())
// })

// export function recordActionsBundle(actions: Record[]) {
//   const { recordsBundle, currentIndex } = $recordsHistory.get()

//   $recordsHistory.set({
//     recordsBundle: [...recordsBundle.slice(0, currentIndex + 1), actions],
//     currentIndex: currentIndex + 1,
//   })
// }

// export function undo() {
//   const { recordsBundle, currentIndex } = $recordsHistory.get()

//   const lastActions = recordsBundle[currentIndex]

//   if (lastActions) {
//     lastActions.forEach(undoSingleAction)
//     $recordsHistory.setKey('currentIndex', currentIndex - 1)
//   }
// }

// function undoSingleAction(action: Record) {
//   switch (action.type) {
//     case 'add':
//       deleteNode(action.$inserted)
//       break
//     case 'move':
//       const { $moved, $from, fromNextSiblingId } = action
//       insertNodeBefore($moved, $from, fromNextSiblingId)
//       break
//   }
// }

// export function redo() {
//   const { recordsBundle, currentIndex } = $recordsHistory.get()

//   const nextActions = recordsBundle[currentIndex + 1]

//   if (nextActions) {
//     nextActions.forEach(redoSingleAction)
//     $recordsHistory.setKey('currentIndex', currentIndex + 1)
//   }
// }

// function redoSingleAction(action: Record) {
//   switch (action.type) {
//     case 'add':
//       console.log('redo add')
//       const { $inserted, $parent, before } = action
//       insertNodeBefore($inserted, $parent, before)
//       // $selectedNodeAtoms.set([$inserted])
//       break
//   }
// }
