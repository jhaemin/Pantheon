import { $hoveredNode, $lastFocusedPage, $selectedNodes } from '@/atoms'
import {
  keepNodeSelectionAttribute,
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
    <Box
      ref={ref}
      style={{
        position: 'fixed',
        left: 0,
        width: 300,
        height: 'calc(100% - var(--space-8) - var(--drawer-height))',
        backgroundColor: '#fff',
        borderRight: '1px solid var(--gray-4)',
        top: 'var(--space-8)',
        zIndex: 99,
      }}
      {...keepNodeSelectionAttribute}
    >
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
      {...makeNodeDropZoneAttributes(page)}
      align="center"
      px="2"
      onMouseEnter={() => {
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
    >
      {node instanceof PageNode ? (
        <PageLabel page={node} />
      ) : (
        <Flex
          id={`tree-node-${node.id}`}
          align="center"
          px="2"
          className={styles.treeNode}
          onMouseEnter={() => {
            $hoveredNode.set(node)
          }}
          onMouseLeave={() => {
            $hoveredNode.set(null)
          }}
          onMouseDown={(e) => {
            $selectedNodes.set([node])

            const elm = document.getElementById(
              `tree-node-container-${node.id}`,
            )!
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
          <Text size="2">{nodeLabel}</Text>
        </Flex>
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
