import { triggerRerenderGuides } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Node } from '@/node-class/node'
import { ExtractMapStoreGeneric } from '@/types/extract-generic'
import { useStore } from '@nanostores/react'
import { Flex, Select, Switch, Text, TextField } from '@radix-ui/themes'
import { MapStore, map } from 'nanostores'

function useCommonValue<
  N extends Node,
  PK extends keyof N,
  K extends keyof ExtractMapStoreGeneric<N[PK]>,
>(
  nodes: N[],
  atomKey: PK,
  key: K,
  defaultValue: ExtractMapStoreGeneric<N[PK]>[K],
) {
  // TODO: use `keys` of useStore options
  const firstProps = useStore((nodes[0]?.[atomKey] as MapStore) ?? map({}))
  const firstNode = nodes[0]

  if (!firstNode) return undefined

  const firstValue = firstProps[key] ?? firstNode.defaultProps[key]
  const allSame = nodes.every(
    (node) =>
      ((node[atomKey] as MapStore).get()[key] ?? defaultValue) === firstValue,
  )

  return allSame ? firstValue : undefined
}

type ControlsCommonFormProps<
  N extends Node,
  PK extends keyof N,
  K extends keyof ExtractMapStoreGeneric<N[PK]>,
> = {
  nodes: N[]
  propsAtomKey: PK
  controlsLabel: string
  propertyKey: K
  defaultValue: ExtractMapStoreGeneric<N[PK]>[K]
}

export type Option<V> = {
  label: string
  value: V
}

export function SelectControls<
  N extends Node,
  PK extends keyof N,
  K extends keyof ExtractMapStoreGeneric<N[PK]>,
>({
  controlsLabel,
  nodes,
  propsAtomKey,
  propertyKey: key,
  options,
  defaultValue,
}: ControlsCommonFormProps<N, PK, K> & {
  options: Option<ExtractMapStoreGeneric<N['$props']>[K]>[]
}) {
  const commonValue = useCommonValue(nodes, propsAtomKey, key, defaultValue)

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
            const store = node[propsAtomKey] as MapStore
            store.set({
              ...store.get(),
              [key]: value,
            })
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
  PK extends keyof N,
  K extends keyof ExtractMapStoreGeneric<N[PK]>,
>({
  controlsLabel,
  nodes,
  propsAtomKey,
  propertyKey: key,
  defaultValue,
}: ControlsCommonFormProps<N, PK, K>) {
  const commonValue = useCommonValue(nodes, propsAtomKey, key, defaultValue)

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{controlsLabel}</Text>
      <Switch
        defaultChecked={commonValue}
        onCheckedChange={(checked) => {
          nodes.forEach((node) => {
            const store = node[propsAtomKey] as MapStore
            store.set({
              ...store.get(),
              [key]: checked,
            })
          })

          triggerRerenderGuides(true)
        }}
      />
    </Flex>
  )
}

export function TextFieldControls<
  N extends Node,
  PK extends keyof N,
  K extends keyof ExtractMapStoreGeneric<N[PK]>,
>({
  controlsLabel,
  nodes,
  propsAtomKey,
  propertyKey: key,
  defaultValue,
}: ControlsCommonFormProps<N, PK, K>) {
  const commonValue = useCommonValue(nodes, propsAtomKey, key, defaultValue)

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{controlsLabel}</Text>
      <TextField.Input
        defaultValue={commonValue}
        onChange={(e) => {
          const value = e.target.value
          nodes.forEach((node) => {
            const store = node[propsAtomKey] as MapStore
            store.set({
              ...store.get(),
              [key]: value,
            })
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
        checked={allNodesSlotEnabled}
        onCheckedChange={(checked) => {
          nodes.forEach((node) => {
            node.toggleSlot(slotKey)
          })

          triggerRerenderGuides(true)
        }}
      />
    </Flex>
  )
}
