import { $hoveredNode, $lastFocusedPage, $selectedNodes } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
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
    const unsubscribe = $selectedNodes.subscribe((selectedNodes) => {
      setTimeout(() => {
        const elements = ref.current.querySelectorAll(`.${styles.selected}`)

        elements.forEach((element) => {
          element.classList.remove(styles.selected)
        })

        const doms = selectedNodes.map((node) => {
          return document.getElementById(`tree-node-${node.id}`)
        })

        doms.forEach((dom) => dom?.classList.add(styles.selected))
      }, 0)
    })

    return () => {
      unsubscribe()
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
    <Flex direction="column">
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
          onMouseDown={() => {
            $selectedNodes.set([node])
          }}
        >
          <Text size="2">{nodeLabel}</Text>
        </Flex>
      )}
      {node.childrenWithSlots.map((node) => (
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
