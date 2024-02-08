import { $selectedNodes } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { nodeControlsMap } from '@/node-map'
import { useStore } from '@nanostores/react'
import { Flex, Separator, Text } from '@radix-ui/themes'
import { AppControls } from './app-controls'
import { TSX } from './tsx'

export function ControlCenter() {
  const selectedNodes = useStore($selectedNodes)

  const areAllSelectedNodesTheSame = selectedNodes.every(
    (node) => node.nodeName === selectedNodes[0]?.nodeName,
  )

  const firstSelectedNode = selectedNodes[0]

  const Controls = firstSelectedNode
    ? nodeControlsMap[firstSelectedNode.nodeName]
    : null

  return (
    <Flex
      {...keepNodeSelectionAttribute}
      direction="column"
      p="5"
      style={{
        width: 300,
        position: 'fixed',
        top: 'var(--space-8)',
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderLeft: '1px solid var(--gray-4)',
        zIndex: 100,
      }}
    >
      {selectedNodes.length > 0 &&
      areAllSelectedNodesTheSame &&
      Controls &&
      firstSelectedNode ? (
        <Flex direction="column">
          <Text size="5" weight="bold" mb="4">
            {firstSelectedNode.nodeName}
          </Text>
          <Flex direction="column" gap="4">
            <Controls nodes={selectedNodes as never} />

            <Separator size="4" />

            {selectedNodes.length === 1 && firstSelectedNode && (
              <TSX node={firstSelectedNode} />
            )}
          </Flex>
        </Flex>
      ) : (
        <AppControls />
      )}
    </Flex>
  )
}
