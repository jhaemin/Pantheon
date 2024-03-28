import { $selectedNodes, triggerRerenderGuides } from '@/atoms'
import { commandRemoveNodes } from '@/command'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons'
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Select,
  Separator,
  Text,
} from '@radix-ui/themes'
import { map } from 'nanostores'
import { useEffect, useState } from 'react'
import { SelectControls, SwitchControls, TextFieldControls } from './controls'
import { TSX } from './tsx'

export function ControlCenter() {
  const [_, update] = useState({})
  const selectedNodes = useStore($selectedNodes)

  const areAllSelectedNodesTheSame = selectedNodes.every(
    (node) => node.nodeName === selectedNodes[0]?.nodeName,
  )
  const firstSelectedNode = selectedNodes[0]
  useStore(firstSelectedNode?.$style ?? map({}))

  const nodeDefinition = firstSelectedNode?.definition

  useEffect(() => {
    const unsubscribes = selectedNodes.map((node) => {
      return node.$style.listen(() => {
        update({})
      })
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [selectedNodes])

  return (
    <Box
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: '50%',
        width: '100%',
        zIndex: 100,
        backgroundColor: 'var(--color-page-background)',
      }}
    >
      <ScrollArea type="hover">
        <Box p="3">
          <Flex {...keepNodeSelectionAttribute} direction="column">
            {!firstSelectedNode && (
              <Button
                onClick={() => {
                  const serial = studioApp.serialize()

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
                  {nodeDefinition.props && (
                    <Flex direction="column" gap="3">
                      {nodeDefinition.props.map((prop) => {
                        if (prop.format.type === 'options') {
                          return (
                            <SelectControls
                              key={prop.key}
                              controlsLabel={prop.label ?? prop.key}
                              propMapStores={selectedNodes.map(
                                (node) => node.$props,
                              )}
                              propertyKey={prop.key}
                              defaultValue={prop.default}
                              options={[
                                ...(prop.required
                                  ? []
                                  : [{ label: 'Unset', value: 'undefined' }]),
                                ...prop.format.options.map((option) => {
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
                        } else if (prop.format.type === 'boolean') {
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
                        } else if (prop.format.type === 'string') {
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

                      <Separator size="4" my="2" />

                      <Heading size="2">Custom Styles</Heading>

                      {Array.from(
                        new Set(
                          selectedNodes.flatMap((node) =>
                            Object.keys(node.$style.get()),
                          ),
                        ),
                      )
                        .sort()
                        .map((styleKey) => (
                          <TextFieldControls
                            key={styleKey}
                            controlsLabel={styleKey}
                            propMapStores={selectedNodes.map(
                              (node) => node.$style,
                            )}
                            propertyKey={styleKey}
                            defaultValue={undefined}
                            extraButton={
                              <IconButton
                                variant="ghost"
                                color="red"
                                onClick={() => {
                                  selectedNodes.forEach((node) => {
                                    node.$style.setKey(styleKey, undefined)
                                  })

                                  triggerRerenderGuides(true)
                                }}
                              >
                                <TrashIcon />
                              </IconButton>
                            }
                          />
                        ))}

                      <Flex direction="row" align="center">
                        <Select.Root
                          value=""
                          onValueChange={(value) => {
                            selectedNodes.forEach((node) => {
                              node.$style.setKey(value, '')
                            })
                          }}
                        >
                          <Select.Trigger
                            placeholder="Add a custom style"
                            style={{ width: '100%' }}
                          />
                          <Select.Content
                            {...keepNodeSelectionAttribute}
                            position="popper"
                            highContrast
                          >
                            {['flex', 'margin', 'padding', 'maxWidth'].map(
                              (styleKey) => (
                                <Select.Item key={styleKey} value={styleKey}>
                                  {styleKey}
                                </Select.Item>
                              ),
                            )}
                          </Select.Content>
                        </Select.Root>
                      </Flex>
                    </Flex>
                  )}

                  {selectedNodes.length === 1 && (
                    <>
                      <Separator size="4" />
                      <TSX node={firstSelectedNode} />
                    </>
                  )}
                </Flex>
              </>
            )}
          </Flex>
        </Box>
      </ScrollArea>
    </Box>
  )
}
