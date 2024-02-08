import { triggerRerenderGuides } from '@/atoms'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Node } from '@/node-class/node'
import { ExtractMapStoreGeneric } from '@/types/extract-generic'
import { useStore } from '@nanostores/react'
import { Flex, Select, Text } from '@radix-ui/themes'
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
      <Text size="2">{controlsLabel}</Text>
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

export function ControlsSwitchForm<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>({ controlsLabel, nodes, propertyKey: key }: ControlsCommonFormProps<N, K>) {
  const value = useCommonValue(nodes, key)

  return (
    <Flex>
      <Flex>
        <Flex align="center" justify="between">
          {/* <Typography variant="body2">{controlsLabel}</Typography>
          <Switch
            checked={value}
            onChange={(e) => {
              nodes.forEach((node) => {
                node.props = {
                  ...node.props,
                  [key]: e.target.checked,
                }
              })

              triggerRerenderGuides(true)
            }}
          /> */}
        </Flex>
      </Flex>
    </Flex>
  )
}

export function ControlsTextInputForm<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>({ controlsLabel, nodes, propertyKey: key }: ControlsCommonFormProps<N, K>) {
  const value = useCommonValue(nodes, key)

  return (
    <Flex>
      <Flex>{controlsLabel}</Flex>
      <Flex>
        {/* <TextInput
          value={value}
          onChange={(e) => {
            nodes.forEach((node) => {
              node.props = {
                ...node.props,
                [key]: e.target.value,
              }
            })

            triggerRerenderGuides(true)
          }}
        /> */}
      </Flex>
    </Flex>
  )
}

export function ControlsStepperForm<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>({ controlsLabel, nodes, propertyKey: key }: ControlsCommonFormProps<N, K>) {
  const value = useCommonValue(nodes, key)

  return (
    <Flex>
      <Flex>{controlsLabel}</Flex>
      <Flex>
        {/* <Stepper
          type="number"
          value={value}
          onChange={(e) => {
            nodes.forEach((node) => {
              node.props = {
                ...node.props,
                [key]: Number(e.target.value),
              }
            })

            triggerRerenderGuides(true)
          }}
        /> */}
      </Flex>
    </Flex>
  )
}
