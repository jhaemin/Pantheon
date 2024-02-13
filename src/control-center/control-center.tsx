import { $hoveredNode, $selectedNodes } from '@/atoms'
import { commandDeleteNodes } from '@/command'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { nodeControlsMap } from '@/node-map'
import { useStore } from '@nanostores/react'
import { DotsHorizontalIcon, TargetIcon } from '@radix-ui/react-icons'
import {
  Badge,
  Box,
  DropdownMenu,
  Flex,
  IconButton,
  ScrollArea,
  Separator,
  Tabs,
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

  // NOTE: Too many ancestors lead to performance issue
  // const upwardTree =
  //   selectedNodes.length === 1 ? firstSelectedNode?.parents ?? [] : []

  const upwardTree = []

  if (firstSelectedNode) {
    upwardTree.unshift(firstSelectedNode)
  }

  return (
    <Box
      style={{
        height: 'calc(100vh - var(--space-8))',
        position: 'fixed',
        top: 'var(--space-8)',
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: '#fff',
        borderLeft: '1px solid var(--gray-4)',
      }}
    >
      <Tabs.Root defaultValue="nodes" {...keepNodeSelectionAttribute}>
        <Box px="2">
          <Tabs.List>
            <Tabs.Trigger value="nodes">Nodes</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
          </Tabs.List>
        </Box>

        <ScrollArea
          type="hover"
          style={{
            height: 'calc(100vh - var(--space-8) - var(--space-7))', // Window height - header height - tabs height
          }}
        >
          <Box p="5" style={{ width: 300 }}>
            <Tabs.Content value="nodes">
              <Flex {...keepNodeSelectionAttribute} direction="column">
                {selectedNodes.length > 0 &&
                areAllSelectedNodesTheSame &&
                Controls &&
                firstSelectedNode ? (
                  <Flex direction="column" gap="4">
                    {upwardTree.map((node, i) => {
                      const ParentControls = nodeControlsMap[node.nodeName]
                      const isSlot = node.slotKey !== undefined
                      const componentLabel = isSlot
                        ? `Slot: ${node.slotLabel ?? node.slotKey}`
                        : node.nodeName

                      return (
                        <Flex
                          key={node.id}
                          direction="column"
                          gap="3"
                          onMouseEnter={() => {
                            $hoveredNode.set(node)
                          }}
                          onMouseLeave={() => {
                            $hoveredNode.set(null)
                          }}
                        >
                          {i > 0 && <Separator size="4" my="1" />}
                          <Flex align="center" justify="between">
                            <Text size={i === 0 ? '5' : '3'} weight="bold">
                              {componentLabel}

                              {i > 0 && node.slotsArray.length > 0 && (
                                <Badge ml="2">slot owner</Badge>
                              )}

                              {/* {i === upwardTree.length - 1 && (
                                <Badge ml="2">root</Badge>
                              )} */}
                            </Text>
                            <Flex gap="3">
                              {i > 0 && (
                                <IconButton
                                  variant="ghost"
                                  onClick={() => {
                                    $selectedNodes.set([node])
                                  }}
                                >
                                  <TargetIcon />
                                </IconButton>
                              )}
                              <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                  <IconButton variant="ghost">
                                    <DotsHorizontalIcon />
                                  </IconButton>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                  <DropdownMenu.Item
                                    color="red"
                                    onMouseDown={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                    }}
                                    onClick={() => {
                                      commandDeleteNodes([node])
                                    }}
                                  >
                                    Remove
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Root>
                            </Flex>
                          </Flex>
                          <ParentControls
                            nodes={
                              i === 0
                                ? (selectedNodes as never)
                                : [node as never]
                            }
                          />
                        </Flex>
                      )
                    })}
                  </Flex>
                ) : (
                  <AppControls />
                )}
              </Flex>
            </Tabs.Content>
            <Tabs.Content value="code">
              {selectedNodes.length === 1 && firstSelectedNode && (
                <TSX node={firstSelectedNode} />
              )}
            </Tabs.Content>
          </Box>
        </ScrollArea>
        {/* </Box> */}
      </Tabs.Root>
    </Box>
  )
}
