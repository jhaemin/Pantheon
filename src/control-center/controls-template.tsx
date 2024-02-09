import { triggerRerenderGuides } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { FragmentNode } from '@/node-class/fragment'
import { Node } from '@/node-class/node'
import { ExtractMapStoreGeneric } from '@/types/extract-generic'
import { useStore } from '@nanostores/react'
import { Flex, Select, Switch, Text } from '@radix-ui/themes'
import { map } from 'nanostores'

function useCommonValue<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>(nodes: N[], key: K) {
  // TODO: use `keys` of useStore options
  const firstProps = useStore(nodes[0]?.$props ?? map({}))
  const firstNode = nodes[0]

  if (!firstNode) return undefined

  const firstValue = firstProps[key] ?? firstNode.defaultProps[key]
  const allSame = nodes.every(
    (node) => (node.props[key] ?? node.defaultProps[key]) === firstValue,
  )

  return allSame ? firstValue : undefined
}

type ControlsCommonFormProps<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
> = {
  nodes: N[]
  controlsLabel: string
  propertyKey: K
}

export type Option<V> = {
  label: string
  value: V
}

export function SelectControls<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>({
  controlsLabel,
  nodes,
  propertyKey: key,
  options,
}: ControlsCommonFormProps<N, K> & {
  options: Option<ExtractMapStoreGeneric<N['$props']>[K]>[]
}) {
  const commonValue = useCommonValue(nodes, key)

  return (
    <Flex direction="row" align="center" justify="between">
      <Flex align="center">
        <Text size="2">{controlsLabel}</Text>
        {/* <IconButton variant="ghost" size="1" ml="2">
          <ResetIcon width={12} />
        </IconButton> */}
      </Flex>
      <Select.Root
        {...keepNodeSelectionAttribute}
        defaultValue={commonValue}
        onValueChange={(value) => {
          nodes.forEach((node) => {
            node.props = {
              ...node.props,
              [key]: value,
            }
          })

          triggerRerenderGuides(true)
        }}
      >
        <Select.Trigger />
        <Select.Content {...keepNodeSelectionAttribute}>
          {options.map(({ value, label }) => (
            <Select.Item key={value ?? '-1'} value={value}>
              {label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  )
}

export function SwitchControls<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>({ controlsLabel, nodes, propertyKey: key }: ControlsCommonFormProps<N, K>) {
  const commonValue = useCommonValue(nodes, key)

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{controlsLabel}</Text>
      <Switch
        defaultChecked={commonValue}
        onCheckedChange={(checked) => {
          nodes.forEach((node) => {
            node.props = {
              ...node.props,
              [key]: checked,
            }
          })

          triggerRerenderGuides(true)
        }}
      />
    </Flex>
  )
}

export function SlotToggleControls({
  nodes,
  slotKey,
}: {
  nodes: Node[]
  slotKey: string
}) {
  useStore(nodes[0].$slots)

  const allNodesSlotEnabled = nodes.every((node) => {
    return !!node.$slots.get()[slotKey]
  })

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{slotKey}</Text>
      <Switch
        defaultChecked={allNodesSlotEnabled}
        onCheckedChange={(checked) => {
          nodes.forEach((node) => {
            if (checked) {
              if (!node.$slots.get()[slotKey]) {
                node.setSlot(slotKey, new FragmentNode())
              }
            } else {
              node.removeSlotByKey(slotKey)
            }
          })

          triggerRerenderGuides(true)
        }}
      />
    </Flex>
  )
}
