import { $selectedNodes } from '@/atoms'
import { commandInsertNodes } from '@/command'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { onMouseDownForDragAndDropNode } from '@/events'
import { Node } from '@/node-class/node'
import { ReactNode, useRef } from 'react'
import styles from './drawer-item-wrapper.module.scss'

export function DrawerItemWrapper({
  children,
  createNode,
}: {
  children: ReactNode
  createNode: () => Node
}) {
  const ref = useRef<HTMLDivElement>(null!)

  return (
    <div {...keepNodeSelectionAttribute} className={styles.drawerItemWrapper}>
      <div
        ref={ref}
        className={styles.drawerItemComponentWrapper}
        onMouseDown={(e) => {
          const cloneTargetElm = e.currentTarget
          const rect = cloneTargetElm.getBoundingClientRect()

          onMouseDownForDragAndDropNode(e, {
            draggingNodes: [createNode()],
            cloneTargetElm: ref.current.firstElementChild!,
            elmX: e.clientX - rect.left,
            elmY: e.clientY - rect.top,
            elementScale: 1,
            draggingElm: ref.current.firstElementChild!,
          })
        }}
        onClick={() => {
          const selectedNodes = $selectedNodes.get()
          if (selectedNodes.length !== 1) return
          if (
            !selectedNodes[0].parent ||
            (selectedNodes[0].isDroppable &&
              selectedNodes[0].children.length === 0)
          ) {
            commandInsertNodes(selectedNodes[0], [createNode()], null)
          } else if (selectedNodes[0].parent) {
            commandInsertNodes(
              selectedNodes[0].parent,
              [createNode()],
              selectedNodes[0].nextSibling,
            )
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}
