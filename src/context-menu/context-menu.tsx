// import { $isContextMenuOpen, $selectedNodes } from '@/atoms'
// import {
//   commandFocusPage,
//   commandRemoveNodes,
//   commandUnwrapNode,
//   commandWrapNodes,
// } from '@/command'
// import { keepNodeSelectionAttribute } from '@/data-attributes'
// import { PageNode } from '@/node-class/page'
// import { getChildNodeIndex, isUnwrappableNode } from '@/node-lib'
// import { useStore } from '@nanostores/react'
// import { ChevronDownIcon } from '@radix-ui/react-icons'
// import clsx from 'clsx'
// import { atom } from 'nanostores'
// import { ContextMenuButton } from './context-menu-button'
// import styles from './context-menu.module.scss'

// export type ContextMenuPosition = {
//   x: number
//   y: number
// }

// export const $contextMenuPosition = atom<ContextMenuPosition>({ x: 0, y: 0 })

// export const contextMenuClassName = 'studio-context-menu'

// export function ContextMenu() {
//   const isContextMenuOpen = useStore($isContextMenuOpen)
//   const { x, y } = useStore($contextMenuPosition)
//   // const $selectedNodes = useStore($selectedNodeAtoms)
//   const selectedNodes = useStore($selectedNodes)

//   const canWrap = (() => {
//     if (selectedNodes.length === 0) return false

//     return selectedNodes.every(
//       (node) =>
//         node.nodeName !== 'Page' &&
//         node.parent?.id === selectedNodes[0].parent?.id,
//     )
//   })()

//   const canUnwrap = (() => {
//     if (selectedNodes.length !== 1) return false

//     if (!selectedNodes[0]) return false

//     return isUnwrappableNode(selectedNodes[0])
//   })()

//   const canMoveForward = (() => {
//     if (selectedNodes.length !== 1) return false

//     if (!selectedNodes[0]) return false

//     return (getChildNodeIndex(selectedNodes[0]) ?? -Infinity) > 0
//   })()

//   const canMoveBackward = (() => {
//     if (selectedNodes.length !== 1) return false

//     if (!selectedNodes[0]) return false

//     return (
//       (getChildNodeIndex(selectedNodes[0]) ?? Infinity) <
//       (selectedNodes[0]?.parent?.children.length ?? -Infinity) - 1
//     )
//   })()

//   const canSelectChildren =
//     selectedNodes.length === 1 &&
//     selectedNodes[0].children.length > 0 &&
//     selectedNodes[0].children.every((child) => !child.isUnselectable)

//   const canSelectParent = selectedNodes.every((node) => {
//     const parent = node.parent
//     return (
//       parent &&
//       parent.id === selectedNodes[0]?.parent?.id &&
//       !parent.isUnselectable
//     )
//   })

//   const canSelectPreviousSibling =
//     selectedNodes.length === 1 && selectedNodes[0].previousSibling !== null

//   const canSelectNextSibling =
//     selectedNodes.length === 1 && selectedNodes[0].nextSibling !== null

//   const canRemove = selectedNodes.length > 0

//   return (
//     <>
//       <div
//         {...keepNodeSelectionAttribute}
//         className={clsx(styles.contextMenuOverlay, {
//           [styles.open]: isContextMenuOpen,
//         })}
//         onMouseDown={() => {
//           $isContextMenuOpen.set(false)
//         }}
//       />
//       <div
//         {...keepNodeSelectionAttribute}
//         className={clsx(contextMenuClassName, styles.contextMenu, {
//           [styles.open]: isContextMenuOpen,
//         })}
//         style={{
//           top: y - 6,
//           left: x,
//         }}
//       >
//         {canSelectChildren && (
//           <ContextMenuButton
//             label="Select All Children"
//             icon={ChevronDownIcon}
//             onClick={() => $selectedNodes.set(selectedNodes[0].children)}
//           />
//         )}

//         {canSelectParent && (
//           <ContextMenuButton
//             label="Select Parent"
//             icon={ChevronDownIcon}
//             onClick={() => {
//               if (selectedNodes[0]?.parent) {
//                 $selectedNodes.set([selectedNodes[0].parent])
//               }
//             }}
//           />
//         )}

//         {canWrap && (
//           <>
//             <ContextMenuButton
//               label="Wrap with Container"
//               icon={ChevronDownIcon}
//               onClick={() => {
//                 const flexNode = commandWrapNodes(
//                   selectedNodes,
//                   'RadixContainer',
//                 )

//                 if (flexNode) {
//                   $selectedNodes.set([flexNode])
//                 }
//               }}
//             />
//             <ContextMenuButton
//               label="Wrap with Flex"
//               icon={ChevronDownIcon}
//               onClick={() => {
//                 const flexNode = commandWrapNodes(selectedNodes, 'RadixFlex')

//                 if (flexNode) {
//                   $selectedNodes.set([flexNode])
//                 }
//               }}
//             />
//           </>
//         )}

//         {canUnwrap && (
//           <ContextMenuButton
//             label={`Unwrap ${selectedNodes[0]?.nodeName}`}
//             icon={ChevronDownIcon}
//             onClick={() => {
//               if (selectedNodes[0] && isUnwrappableNode(selectedNodes[0])) {
//                 const children = selectedNodes[0].children
//                 commandUnwrapNode(selectedNodes[0])
//                 $selectedNodes.set(children)
//               }
//             }}
//           />
//         )}

//         {canSelectPreviousSibling && (
//           <ContextMenuButton
//             label="Select Previous Sibling"
//             icon={ChevronDownIcon}
//             onClick={() => {
//               if (selectedNodes[0]?.previousSibling) {
//                 $selectedNodes.set([selectedNodes[0].previousSibling])
//               }
//             }}
//           />
//         )}

//         {canSelectNextSibling && (
//           <ContextMenuButton
//             label="Select Next Sibling"
//             icon={ChevronDownIcon}
//             onClick={() => {
//               if (selectedNodes[0]?.nextSibling) {
//                 $selectedNodes.set([selectedNodes[0].nextSibling])
//               }
//             }}
//           />
//         )}

//         {canMoveForward && (
//           <ContextMenuButton
//             label="Move Forward"
//             icon={ChevronDownIcon}
//             onClick={() => {
//               const parent = selectedNodes[0]?.parent
//               const previousSibling = selectedNodes[0]?.previousSibling

//               if (previousSibling && parent) {
//                 parent.insertBefore(selectedNodes[0], previousSibling)
//               }
//             }}
//           />
//         )}

//         {canMoveBackward && (
//           <ContextMenuButton
//             label="Move Backward"
//             icon={ChevronDownIcon}
//             onClick={() => {
//               const parent = selectedNodes[0]?.parent
//               const nextSibling = selectedNodes[0]?.nextSibling

//               if (nextSibling && parent) {
//                 parent.insertBefore(selectedNodes[0], nextSibling.nextSibling)
//               }
//             }}
//           />
//         )}

//         {selectedNodes.length === 1 && selectedNodes[0] instanceof PageNode && (
//           <ContextMenuButton
//             label="Focus"
//             icon={ChevronDownIcon}
//             onClick={() => commandFocusPage(selectedNodes[0] as PageNode, true)}
//           />
//         )}

//         {canSelectChildren && (
//           <ContextMenuButton
//             label="Remove All Children"
//             shortcut="⌫"
//             icon={ChevronDownIcon}
//             onClick={() => commandRemoveNodes(selectedNodes[0].children)}
//           />
//         )}

//         {canRemove && (
//           <ContextMenuButton
//             label="Remove"
//             shortcut="⌫"
//             icon={ChevronDownIcon}
//             onClick={() => commandRemoveNodes(selectedNodes)}
//           />
//         )}
//       </div>
//     </>
//   )

//   // return createPortal(
//   //   <>
//   //     <div
//   //       className={clsx(styles.contextMenuOverlay, {
//   //         [styles.open]: isContextMenuOpen,
//   //       })}
//   //       {...{
//   //         [dataAttributes.keepNodeSelection]: '',
//   //       }}
//   //       onMouseDown={() => {
//   //         $isContextMenuOpen.set(false)
//   //       }}
//   //     />
//   //     <div
//   //       className={clsx(contextMenuClassName, styles.contextMenu, {
//   //         [styles.open]: isContextMenuOpen,
//   //       })}
//   //       style={{
//   //         top: y - 6,
//   //         left: x,
//   //       }}
//   //       {...{
//   //         [dataAttributes.keepNodeSelection]: true,
//   //       }}
//   //     >
//   //       {canSelectChildren && (
//   //         <ContextMenuButton
//   //           label="Select All Children"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => $selectedNodes.set(selectedNodes[0].children)}
//   //         />
//   //       )}

//   //       {canSelectParent && (
//   //         <ContextMenuButton
//   //           label="Select Parent"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => {
//   //             if (selectedNodes[0]?.parent) {
//   //               $selectedNodes.set([selectedNodes[0].parent])
//   //             }
//   //           }}
//   //         />
//   //       )}

//   //       {canWrap && (
//   //         <>
//   //           <ContextMenuButton
//   //             label="Wrap with Container"
//   //             icon={ChevronDownIcon}
//   //             onClick={() => {
//   //               const flexNode = commandWrapNodes(selectedNodes, 'Container')

//   //               if (flexNode) {
//   //                 $selectedNodes.set([flexNode])
//   //               }
//   //             }}
//   //           />
//   //           <ContextMenuButton
//   //             label="Wrap with Flex"
//   //             icon={ChevronDownIcon}
//   //             onClick={() => {
//   //               const flexNode = commandWrapNodes(selectedNodes, 'Flex')

//   //               if (flexNode) {
//   //                 $selectedNodes.set([flexNode])
//   //               }
//   //             }}
//   //           />
//   //         </>
//   //       )}

//   //       {canUnwrap && (
//   //         <ContextMenuButton
//   //           label={`Unwrap ${selectedNodes[0]?.nodeName}`}
//   //           icon={ChevronDownIcon}
//   //           onClick={() => {
//   //             if (selectedNodes[0] && isUnwrappableNode(selectedNodes[0])) {
//   //               const children = selectedNodes[0].children
//   //               commandUnwrapNode(selectedNodes[0])
//   //               $selectedNodes.set(children)
//   //             }
//   //           }}
//   //         />
//   //       )}

//   //       {canSelectPreviousSibling && (
//   //         <ContextMenuButton
//   //           label="Select Previous Sibling"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => {
//   //             if (selectedNodes[0]?.previousSibling) {
//   //               $selectedNodes.set([selectedNodes[0].previousSibling])
//   //             }
//   //           }}
//   //         />
//   //       )}

//   //       {canSelectNextSibling && (
//   //         <ContextMenuButton
//   //           label="Select Next Sibling"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => {
//   //             if (selectedNodes[0]?.nextSibling) {
//   //               $selectedNodes.set([selectedNodes[0].nextSibling])
//   //             }
//   //           }}
//   //         />
//   //       )}

//   //       {canMoveForward && (
//   //         <ContextMenuButton
//   //           label="Move Forward"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => {
//   //             const parent = selectedNodes[0]?.parent
//   //             const previousSibling = selectedNodes[0]?.previousSibling

//   //             if (previousSibling && parent) {
//   //               parent.insertBefore([selectedNodes[0]], previousSibling)
//   //             }
//   //           }}
//   //         />
//   //       )}

//   //       {canMoveBackward && (
//   //         <ContextMenuButton
//   //           label="Move Backward"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => {
//   //             const parent = selectedNodes[0]?.parent
//   //             const nextSibling = selectedNodes[0]?.nextSibling

//   //             if (nextSibling && parent) {
//   //               parent.insertBefore([selectedNodes[0]], nextSibling.nextSibling)
//   //             }
//   //           }}
//   //         />
//   //       )}

//   //       {selectedNodes.length === 1 && selectedNodes[0] instanceof PageNode && (
//   //         <ContextMenuButton
//   //           label="Focus"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => commandFocusPage(selectedNodes[0] as PageNode, true)}
//   //         />
//   //       )}

//   //       {canSelectChildren && (
//   //         <ContextMenuButton
//   //           label="Remove All Children"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => commandDeleteNodes(selectedNodes[0].children)}
//   //         />
//   //       )}

//   //       {canRemove && (
//   //         <ContextMenuButton
//   //           label="Remove"
//   //           icon={ChevronDownIcon}
//   //           onClick={() => commandDeleteNodes(selectedNodes)}
//   //         />
//   //       )}
//   //     </div>
//   //   </>,
//   //   document.body,
//   // )
// }
