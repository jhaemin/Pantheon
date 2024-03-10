import { $selectedNodes } from '@/atoms'
import { commandRemoveNodes } from '@/command'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Prop } from '@/node-definition'
import { serializeApp } from '@/serial'
import { useStore } from '@nanostores/react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Separator,
  Text,
} from '@radix-ui/themes'
import {
  SelectControls,
  SlotToggleControls,
  SwitchControls,
  TextFieldControls,
} from './controls-template'

export function DynamicControlCenter() {
  const selectedNodes = useStore($selectedNodes)
  const areAllSelectedNodesTheSame = selectedNodes.every(
    (node) => node.nodeName === selectedNodes[0]?.nodeName,
  )
  const firstSelectedNode = selectedNodes[0]

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
      <ScrollArea
        type="hover"
        style={{
          height: 'calc(100vh - var(--space-8) - var(--space-7))', // Window height - header height - tabs height
        }}
      >
        <Box p="5" style={{ width: 300 }}>
          <Flex {...keepNodeSelectionAttribute} direction="column">
            {!firstSelectedNode && (
              <Button
                onClick={() => {
                  const serial = serializeApp()

                  const str = JSON.stringify(serial)
                  const base64 = btoa(str)

                  const dataUri = `data:application/json;base64,${base64}`

                  const downloadLink = document.createElement('a')
                  downloadLink.href = dataUri
                  downloadLink.download = 'studio-app.json'
                  downloadLink.click()
                }}
              >
                Serialize
              </Button>
            )}

            {firstSelectedNode && areAllSelectedNodesTheSame && (
              <>
                <Flex align="center" justify="between" mb="5">
                  <Text size="5" weight="bold">
                    {firstSelectedNode.nodeName}
                  </Text>
                  <Flex gap="3">
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
                            commandRemoveNodes(selectedNodes)
                          }}
                        >
                          Remove
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                </Flex>
                <Flex direction="column" gap="5">
                  {firstSelectedNode.slotsInfoArray.length > 0 && (
                    <Card size="2" variant="classic">
                      <Heading size="2" align="center">
                        Slots
                      </Heading>

                      <Separator size="4" my="3" />

                      <Flex direction="column" gap="3">
                        {firstSelectedNode.slotsInfoArray
                          .filter((slot) => slot.required !== true)
                          .map((slot) => (
                            <SlotToggleControls
                              key={slot.key}
                              slotKey={slot.key}
                              nodes={selectedNodes}
                            />
                          ))}
                      </Flex>
                    </Card>
                  )}

                  <Flex direction="column" gap="3">
                    {[
                      ...firstSelectedNode.propsDefinition,
                      ...(firstSelectedNode.slotsInfoArray
                        .filter(
                          (slot) =>
                            slot.props !== undefined && slot.props.length > 0,
                        )
                        .flatMap((slot) =>
                          slot.props?.map((prop) => ({
                            ...prop,
                            slotKey: slot.key,
                          })),
                        ) as (Prop & {
                        slotKey: string // Mark that this prop is for a slot
                      })[]),
                    ].map((prop) => {
                      if (Array.isArray(prop.type)) {
                        return (
                          <SelectControls
                            key={prop.key}
                            controlsLabel={prop.label ?? prop.key}
                            propMapStores={
                              'slotKey' in prop
                                ? selectedNodes.map(
                                    (node) =>
                                      node.slotProps[`$${prop.slotKey}`],
                                  )
                                : selectedNodes.map((node) => node.$props)
                            }
                            propertyKey={prop.key}
                            defaultValue={prop.default}
                            options={[
                              ...(prop.required
                                ? []
                                : [{ label: 'Unset', value: undefined }]),
                              ...prop.type.map((option) => {
                                if (typeof option === 'string') {
                                  return {
                                    label: option,
                                    value: option,
                                  }
                                }

                                return {
                                  label: option.label,
                                  value: option.value,
                                }
                              }),
                            ]}
                          />
                        )
                      } else if (prop.type === 'boolean') {
                        return (
                          <SwitchControls
                            key={prop.key}
                            controlsLabel={prop.label ?? prop.key}
                            propMapStores={selectedNodes.map(
                              (node) => node.$props,
                            )}
                            propertyKey={prop.key}
                            defaultValue={prop.default}
                          />
                        )
                      } else if (prop.type === 'string') {
                        return (
                          <TextFieldControls
                            key={prop.key}
                            controlsLabel={prop.label ?? prop.key}
                            propMapStores={selectedNodes.map(
                              (node) => node.$props,
                            )}
                            propertyKey={prop.key}
                            defaultValue={prop.default}
                          />
                        )
                      }
                    })}
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
        </Box>
      </ScrollArea>
    </Box>
  )
}
