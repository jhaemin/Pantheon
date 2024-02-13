import { $currentPage, $hoveredNode, $selectedNodes } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { useStore } from '@nanostores/react'
import { Box, Flex, Text } from '@radix-ui/themes'
import { Fragment, useEffect, useRef } from 'react'
import styles from './tree.module.scss'

export function Tree() {
  const ref = useRef<HTMLDivElement>(null!)
  const currentPage = useStore($currentPage)

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
      p="5"
      style={{
        position: 'fixed',
        left: 300,
        width: 300,
        height: 'calc(100% - var(--space-8))',
        backgroundColor: '#fff',
        borderRight: '1px solid var(--gray-4)',
        top: 'var(--space-8)',
        zIndex: 100,
      }}
      {...keepNodeSelectionAttribute}
    >
      {currentPage ? (
        <>
          <Box mb="2">
            <PageLabel page={currentPage} />
          </Box>
          <Children node={currentPage} />
        </>
      ) : null}
    </Box>
  )
}

function PageLabel({ page }: { page: PageNode }) {
  const pageLabel = useStore(page.$pageLabel)

  return (
    <Text
      weight="bold"
      onMouseDown={() => {
        $selectedNodes.set([page])
      }}
    >
      {pageLabel}
    </Text>
  )
}

export function Children({ node }: { node: Node }) {
  useStore(node.$children)
  useStore(node.$slots)

  if (node.childrenWithSlots.length === 0) {
    return null
  }

  return (
    <Flex direction="column">
      {node.childrenWithSlots.map((node) => (
        <Fragment key={node.id}>
          <Box
            id={`tree-node-${node.id}`}
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
            {node.nodeName}
          </Box>
          <Box pl="3">
            <Children node={node} />
          </Box>
        </Fragment>
      ))}
    </Flex>
  )
}
