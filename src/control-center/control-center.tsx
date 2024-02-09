import { $hoveredNode, $selectedNodes } from '@/atoms'
import { commandDeleteNodes } from '@/command'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { nodeControlsMap } from '@/node-map'
import { useStore } from '@nanostores/react'
import { DotsHorizontalIcon, TargetIcon } from '@radix-ui/react-icons'
import {
  Badge,
  DropdownMenu,
  Flex,
  IconButton,
  Separator,
  Text,
} from '@radix-ui/themes'
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

  const parents =
    selectedNodes.length === 1 ? firstSelectedNode?.parents ?? [] : []

  if (firstSelectedNode) {
    parents.unshift(firstSelectedNode)
  }

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
        <Flex direction="column" gap="4">
          {parents.map((parent, i) => {
            const ParentControls = nodeControlsMap[parent.nodeName]

            return (
              <Flex
                key={parent.id}
                direction="column"
                gap="4"
                onMouseEnter={() => {
                  $hoveredNode.set(parent)
                }}
                onMouseLeave={() => {
                  $hoveredNode.set(null)
                }}
              >
                {i > 0 && <Separator size="4" my="1" />}
                <Flex align="center" justify="between">
                  <Text size={i === 0 ? '5' : '3'} weight="bold">
                    {parent.nodeName}
                    {i > 0 && parent.slotsArray.length > 0 && (
                      <Badge ml="2">slot owner</Badge>
                    )}
                    {i === parents.length - 1 && <Badge ml="2">root</Badge>}
                  </Text>
                  <Flex gap="3">
                    {i > 0 && (
                      <IconButton
                        variant="ghost"
                        onClick={() => {
                          $selectedNodes.set([parent])
                        }}
                      >
                        <TargetIcon />
                      </IconButton>
                    )}
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" color="gray">
                          <DotsHorizontalIcon />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={() => {
                            commandDeleteNodes([parent])
                          }}
                        >
                          Remove
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                </Flex>
                <ParentControls nodes={[parent as never]} />
              </Flex>
            )
          })}

          {selectedNodes.length === 1 && firstSelectedNode && (
            <>
              <Separator size="4" my="1" />
              <TSX node={firstSelectedNode} />
            </>
          )}
        </Flex>
      ) : (
        <AppControls />
      )}
    </Flex>
  )
}
