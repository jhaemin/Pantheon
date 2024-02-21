import {
  $hoveredNode,
  $isDraggingNode,
  $lastFocusedPage,
  $selectedNodes,
} from '@/atoms'
import {
  keepNodeSelectionAttribute,
  makeDropZoneAttributes,
  makeNodeDropZoneAttributes,
} from '@/data-attributes'
import { onMouseDownForDragAndDropNode } from '@/events'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { Box, Flex, ScrollArea, Text } from '@radix-ui/themes'
import { useEffect, useRef } from 'react'
import styles from './tree.module.scss'

export function Tree() {
  const ref = useRef<HTMLDivElement>(null!)
  const currentPage = useStore($lastFocusedPage)

  useEffect(() => {
    const unsubscribeHoveredNode = $hoveredNode.subscribe((hoveredNode) => {
      const elements = ref.current.querySelectorAll(`.${styles.hovered}`)

      elements.forEach((element) => {
        element.classList.remove(styles.hovered)
      })

      const dom = document.getElementById(
        `tree-node-container-${hoveredNode?.id}`,
      )

      dom?.classList.add(styles.hovered)
    })

    const unsubscribeSelectionNodes = $selectedNodes.subscribe(
      (selectedNodes) => {
        setTimeout(() => {
          const elements = ref.current.querySelectorAll(`.${styles.selected}`)

          elements.forEach((element) => {
            element.classList.remove(styles.selected)
          })

          const doms = selectedNodes.map((node) => {
            return document.getElementById(`tree-node-container-${node.id}`)
          })

          doms.forEach((dom) => dom?.classList.add(styles.selected))
        }, 0)
      },
    )

    return () => {
      unsubscribeHoveredNode()
      unsubscribeSelectionNodes()
    }
  }, [])

  return (
    <Box ref={ref} className={styles.tree} {...keepNodeSelectionAttribute}>
      <ScrollArea>
        <Box p="4">
          {currentPage ? <NodeTree node={currentPage} /> : <AppTree />}
        </Box>
      </ScrollArea>
    </Box>
  )
}

function PageLabel({ page }: { page: PageNode }) {
  const pageLabel = useStore(page.$pageLabel)
  const trimmedPageLabel = pageLabel.trim()

  return (
    <Flex
      id={`tree-node-${page.id}`}
      className={styles.treeNode}
      align="center"
      px="2"
      onMouseEnter={() => {
        if ($isDraggingNode.get()) return

        $hoveredNode.set(page)
      }}
      onMouseLeave={() => {
        $hoveredNode.set(null)
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        $selectedNodes.set([page])
      }}
    >
      <Text weight="bold" color={trimmedPageLabel === '' ? 'gray' : undefined}>
        {trimmedPageLabel === '' ? 'Untitled' : trimmedPageLabel}
      </Text>
    </Flex>
  )
}

function NodeTree({ node }: { node: Node }) {
  useStore(node.$children)
  useStore(node.$slots)

  const slotLabel = node.slotLabel ?? node.slotKey
  const nodeLabel = slotLabel
    ? `Slot: ${slotLabel}`
    : node.componentName ?? node.nodeName

  return (
    <Flex
      id={`tree-node-container-${node.id}`}
      className={styles.treeNodeContainer}
      direction="column"
      {...(node.isDroppable ? makeNodeDropZoneAttributes(node) : {})}
      onMouseOver={(e) => {
        if ($isDraggingNode.get()) return

        e.stopPropagation()
        $hoveredNode.set(node)
      }}
      onMouseOut={(e) => {
        e.stopPropagation()
        $hoveredNode.set(null)
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        $selectedNodes.set([node])

        const elm = document.getElementById(`tree-node-container-${node.id}`)!
        const elmRect = elm.getBoundingClientRect()

        onMouseDownForDragAndDropNode(e, {
          cloneTargetElm: elm,
          elmX: e.clientX - elmRect.left,
          elmY: e.clientY - elmRect.top,
          elementScale: 1,
          draggingElm: elm,
          draggingNode: node,
        })
      }}
    >
      {node instanceof PageNode ? (
        <PageLabel page={node} />
      ) : (
        <>
          <Flex
            id={`tree-node-${node.id}`}
            align="center"
            px="2"
            className={styles.treeNode}
          >
            <Text size="2">{nodeLabel}</Text>
          </Flex>
          <div
            className={styles.previousDropZone}
            {...makeDropZoneAttributes({
              dropZoneId: node.id,
              dropZoneBefore: node.id,
              dropZoneTargetNodeId: node.parent?.id!,
            })}
          />
          <div
            className={styles.nextDropZone}
            {...makeDropZoneAttributes({
              dropZoneId: node.id,
              dropZoneBefore: node.nextSibling?.id,
              dropZoneTargetNodeId: node.parent?.id!,
            })}
          />
        </>
      )}
      {node.childrenAndSlots.map((node) => (
        <Box key={node.id} ml="3">
          <NodeTree node={node} />
        </Box>
      ))}
    </Flex>
  )
}

function AppTree() {
  const pages = useStore(studioApp.$pages)

  return (
    <Flex direction="column">
      {pages.map((page) => (
        <PageLabel key={page.id} page={page} />
      ))}
    </Flex>
  )
}
