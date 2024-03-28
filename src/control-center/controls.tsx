import { PropChangeAction } from '@/action'
import { $selectedNodes, triggerRerenderGuides } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { History, HistoryStackItem } from '@/history'
import { ExtractMapStoreGeneric } from '@/types/extract-generic'
import { StoreKeys, useStore } from '@nanostores/react'
import { Flex, Select, Switch, Text, TextField } from '@radix-ui/themes'
import { MapStore } from 'nanostores'
import { ReactNode, useEffect, useRef, useState } from 'react'

function useCommonValue<M extends MapStore, K extends StoreKeys<M>>(
  propMapStores: M[],
  key: K,
  defaultValue: ExtractMapStoreGeneric<M>[K],
) {
  const [_, update] = useState({})
  const firstProps = useStore(propMapStores[0], { keys: [key] }) // Only rerender when the key changes

  const firstValue = firstProps[key]
  const allSame = propMapStores.every(
    (store) => (store.get()[key] ?? defaultValue) === firstValue,
  )

  useEffect(() => {
    const unsubscribes = propMapStores.map((store) => {
      return store.listen(() => {
        update({})
      })
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [propMapStores])

  return allSame ? firstValue : undefined
}

type ControlsCommonFormProps<M extends MapStore, K extends StoreKeys<M>> = {
  propMapStores: M[]
  controlsLabel: string
  propertyKey: K
  defaultValue: ExtractMapStoreGeneric<M>[K]
  extraButton?: ReactNode
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
        value={commonValue === undefined ? 'undefined' : commonValue}
        onValueChange={(value) => {
          const historyStackItem: HistoryStackItem = {
            actions: [],
            previousSelectedNodes: $selectedNodes.get(),
            nextSelectedNodes: $selectedNodes.get(),
          }

          propMapStores.forEach((store) => {
            historyStackItem.actions.push(
              new PropChangeAction({
                propMapStore: store,
                oldProp: { key, value: store.get()[key] },
                newProp: {
                  key,
                  value: value === 'undefined' ? undefined : value,
                },
              }),
            )

            store.setKey(key, value === 'undefined' ? undefined : value)
          })

          History.push(historyStackItem)

          triggerRerenderGuides(true)
        }}
      >
        <Select.Trigger />
        <Select.Content {...keepNodeSelectionAttribute} highContrast>
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
        highContrast
        checked={commonValue ?? false}
        onCheckedChange={(checked) => {
          const historyStackItem: HistoryStackItem = {
            actions: [],
            previousSelectedNodes: $selectedNodes.get(),
            nextSelectedNodes: $selectedNodes.get(),
          }

          propMapStores.forEach((store) => {
            historyStackItem.actions.push(
              new PropChangeAction({
                propMapStore: store,
                oldProp: { key, value: store.get()[key] },
                newProp: { key, value: checked },
              }),
            )

            store.setKey(key, checked)
          })

          History.push(historyStackItem)

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
  extraButton,
}: ControlsCommonFormProps<M, K>) {
  const previousValues = useRef<any[]>([])
  const timeout = useRef<number>(0)
  const commonValue = useCommonValue(propMapStores, key, defaultValue)

  useEffect(() => {
    previousValues.current = propMapStores.map((store) => store.get()[key])
  }, [propMapStores, key])

  return (
    <Flex direction="row" align="center" justify="between">
      <Text size="2">{controlsLabel}</Text>
      <Flex direction="row" align="center" gap="2">
        {extraButton}
        <TextField.Root
          value={commonValue ?? ''}
          placeholder={
            propMapStores.length > 1 && commonValue === undefined
              ? 'Multiple values'
              : undefined
          }
          onChange={(e) => {
            const value = e.target.value

            propMapStores.forEach((store) => {
              store.setKey(key, value)
            })

            triggerRerenderGuides(true)

            window.clearTimeout(timeout.current)

            timeout.current = window.setTimeout(() => {
              const historyStackItem: HistoryStackItem = {
                actions: [],
                nextSelectedNodes: $selectedNodes.get(),
                previousSelectedNodes: $selectedNodes.get(),
              }

              propMapStores.forEach((store, i) => {
                historyStackItem.actions.push(
                  new PropChangeAction({
                    propMapStore: store,
                    oldProp: { key, value: previousValues.current[i] },
                    newProp: { key, value },
                  }),
                )
              })

              History.push(historyStackItem)

              previousValues.current = propMapStores.map(
                (store) => store.get()[key],
              )
            }, 250)
          }}
        />
      </Flex>
    </Flex>
  )
}
