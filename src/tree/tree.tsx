import { $currentPage } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Node } from '@/node-class/node'
import { PageNode } from '@/node-class/page'
import { useStore } from '@nanostores/react'
import { Box, Flex, Text } from '@radix-ui/themes'
import { Fragment } from 'react'

export function Tree() {
  const currentPage = useStore($currentPage)

  return (
    <Box
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

  return <Text weight="bold">{pageLabel}</Text>
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
          <Box>{node.nodeName}</Box>
          <Box pl="3">
            <Children node={node} />
          </Box>
        </Fragment>
      ))}
    </Flex>
  )
}
