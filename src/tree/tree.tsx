import { $hoveredNode, $isDraggingNode, $selectedNodes } from '@/atoms'
import {
  keepNodeSelectionAttribute,
  makeDropZoneAttributes,
  makeNodeAttrs,
} from '@/data-attributes'
import { EditorState } from '@/editor-state'
import {
  onMouseDownForDragAndDropNode,
  onMouseDownForSelecting,
} from '@/events'
import { Ground } from '@/ground'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { ChevronDownIcon, DotIcon } from '@radix-ui/react-icons'
import { Box, Flex, ScrollArea, Text } from '@radix-ui/themes'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './tree.module.scss'

/**
 * TODO: lock, hide, rename by double click
 */
export function Tree() {
  const ref = useRef<HTMLDivElement>(null!)
  const pages = useStore(studioApp.$pages)

  useEffect(() => {
    const unsubscribeHoveredNode = $hoveredNode.subscribe((hoveredNode) => {
      const elements = ref.current.querySelectorAll(`.${styles.hovered}`)

      elements.forEach((element) => {
        element.classList.remove(styles.hovered)
      })

      const dom = document.getElementById(`tree-node-${hoveredNode?.id}`)

      dom?.classList.add(styles.hovered)
    })

    const unsubscribeSelectionNodes = $selectedNodes.subscribe(
      (selectedNodes) => {
        process.nextTick(() => {
          const elements = ref.current.querySelectorAll(`.${styles.selected}`)

          elements.forEach((element) => {
            element.classList.remove(styles.selected)
          })

          const doms = selectedNodes.map((node) => {
            return document.getElementById(`tree-node-container-${node.id}`)
          })

          doms.forEach((dom) => dom?.classList.add(styles.selected))
        })
      },
    )

    return () => {
      unsubscribeHoveredNode()
      unsubscribeSelectionNodes()
    }
  }, [])

  return (
    <Box ref={ref} className={styles.tree} {...keepNodeSelectionAttribute}>
      <ScrollArea type="hover">
        <Box>
          {pages.map((page) => (
            <NodeTree key={page.id} node={page} depth={1} />
          ))}
        </Box>
      </ScrollArea>
    </Box>
  )
}

function NodeTree({ node, depth }: { node: Node; depth: number }) {
  const treeFolded = useStore(EditorState.$treeFoldedNodes, { keys: [node.id] })
  const children = useStore(node.$children)

  const nodeLabel = node.nodeName

  return (
    <>
      <Flex
        // {...makeNodeAttrs(node)}
        id={`tree-node-container-${node.id}`}
        className={styles.treeNodeContainer}
        direction="column"
        onDoubleClick={() => {
          if (node instanceof PageNode) {
            Ground.focus(node, true)
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation()

          const elm = document.getElementById(`tree-node-container-${node.id}`)!
          const elmRect = elm.getBoundingClientRect()

          onMouseDownForSelecting(e, node)

          onMouseDownForDragAndDropNode(e, {
            draggingNodes: $selectedNodes
              .get()
              .filter((node) => !(node instanceof PageNode)),
            cloneTargetElm: elm,
            elmX: e.clientX - elmRect.left,
            elmY: e.clientY - elmRect.top,
            elementScale: 1,
            draggingElm: elm,
          })
        }}
      >
        <Flex
          {...makeNodeAttrs(node)}
          id={`tree-node-${node.id}`}
          align="center"
          gap="2"
          className={styles.treeNode}
          style={{ paddingLeft: (depth - 1) * 16, paddingRight: 16 }}
          onMouseEnter={(e) => {
            if ($isDraggingNode.get()) return

            e.stopPropagation()
            $hoveredNode.set(node)
          }}
          onMouseLeave={(e) => {
            e.stopPropagation()
            $hoveredNode.set(null)
          }}
        >
          <Flex
            pl="2"
            align="center"
            justify="center"
            style={{ alignSelf: 'stretch' }}
            onMouseDown={(e) => {
              if (!node.isDroppable) return

              e.stopPropagation()

              EditorState.$treeFoldedNodes.setKey(node.id, !treeFolded[node.id])
            }}
          >
            {!node.isDroppable || node.children.length === 0 ? (
              // <Box style={{ width: 12, height: 12 }} />
              <DotIcon width={12} height={12} />
            ) : (
              <ChevronDownIcon
                width={12}
                height={12}
                className={clsx(styles.chevron, {
                  [styles.folded]: treeFolded[node.id],
                })}
              />
            )}
          </Flex>
          <Text size="2">{nodeLabel}</Text>
        </Flex>

        {!treeFolded[node.id] && children.length > 0 && (
          <>
            {/* A intervened drop zone before the first child node */}
            <div
              className={styles.intervenedDropZoneWrapper}
              style={{ marginLeft: depth * 16, zIndex: depth }}
            >
              <div
                className={styles.intervenedDropZone}
                {...makeDropZoneAttributes({
                  dropZoneId: children[0].id,
                  dropZoneBefore: children[0].id,
                  dropZoneTargetNodeId: children[0].parent?.id!,
                })}
              />
            </div>
            {children.map((node) => (
              <NodeTree key={node.id} node={node} depth={depth + 1} />
            ))}
          </>
        )}
      </Flex>

      {/* A intervened drop zone after the child */}
      <div
        className={styles.intervenedDropZoneWrapper}
        style={{ marginLeft: (depth - 1) * 16, zIndex: depth }}
      >
        <div
          className={styles.intervenedDropZone}
          {...makeDropZoneAttributes({
            dropZoneId: node.id,
            dropZoneBefore: node.nextSibling?.id,
            dropZoneTargetNodeId: node.parent?.id!,
          })}
        />
      </div>
    </>
  )
}
