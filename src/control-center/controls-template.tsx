import { triggerRerenderGuides } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Node } from '@/node-class/node'
import { ExtractMapStoreGeneric } from '@/types/extract-generic'
import { StoreKeys, useStore } from '@nanostores/react'
import { Flex, Select, Switch, Text, TextField } from '@radix-ui/themes'
import { MapStore } from 'nanostores'

function useCommonValue<M extends MapStore, K extends StoreKeys<M>>(
  propMapStores: M[],
  key: K,
  defaultValue: ExtractMapStoreGeneric<M>[K],
) {
  const firstProps = useStore(propMapStores[0], { keys: [key] }) // Only rerender when the key changes

  const firstValue = firstProps[key] ?? defaultValue
  const allSame = propMapStores.every(
    () => (propMapStores[0].get()[key] ?? defaultValue) === firstValue,
  )

  return allSame ? firstValue : undefined
}

type ControlsCommonFormProps<M extends MapStore, K extends StoreKeys<M>> = {
  propMapStores: M[]
  controlsLabel: string
  propertyKey: K
  defaultValue: ExtractMapStoreGeneric<M>[K]
}

export type Option<V> = {
  label: string
  value: V
}

export function SelectControls<M extends MapStore, K extends StoreKeys<M>>({
  controlsLabel,
  propMapStores,
  propertyKey: key,
  options,
  defaultValue,
}: ControlsCommonFormProps<M, K> & {
  options: Option<ExtractMapStoreGeneric<M>[K]>[]
}) {
  const commonValue = useCommonValue(propMapStores, key, defaultValue)

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
          propMapStores.forEach((store) => {
            store.setKey(key, value)
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

export function SwitchControls<M extends MapStore, K extends StoreKeys<M>>({
  controlsLabel,
  propMapStores,
  propertyKey: key,
  defaultValue,
}: ControlsCommonFormProps<M, K>) {
  const commonValue = useCommonValue(propMapStores, key, defaultValue)

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{controlsLabel}</Text>
      <Switch
        defaultChecked={commonValue}
        onCheckedChange={(checked) => {
          propMapStores.forEach((store) => {
            store.setKey(key, checked)
          })

          triggerRerenderGuides(true)
        }}
      />
    </Flex>
  )
}

export function TextFieldControls<M extends MapStore, K extends StoreKeys<M>>({
  controlsLabel,
  propMapStores,
  propertyKey: key,
  defaultValue,
}: ControlsCommonFormProps<M, K>) {
  const commonValue = useCommonValue(propMapStores, key, defaultValue)

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{controlsLabel}</Text>
      <TextField.Input
        defaultValue={commonValue}
        onChange={(e) => {
          const value = e.target.value

          propMapStores.forEach((store) => {
            store.setKey(key, value)
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
