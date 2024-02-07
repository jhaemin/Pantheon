import { Node } from '@/node-class/node'
import { ExtractMapStoreGeneric } from '@/types/extract-generic'
import { useStore } from '@nanostores/react'
import { Container, Flex, Text } from '@radix-ui/themes'

function useCommonValue<
  N extends Node,
  K extends keyof ExtractMapStoreGeneric<N['$props']>,
>(nodes: N[], key: K) {
  // TODO: use `keys` of useStore options
  const firstProps = useStore(nodes[0].$props!)
  const firstNode = nodes[0]
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

export function ControlsRadioGroupForm<
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
  const value = useCommonValue(nodes, key)

  return (
    <Flex direction="column">
      <Text>{controlsLabel}</Text>
      <Container>
        {/* <RadioGroup.Root
          name={controlsLabel}
          small
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
        >
          {options.map((option) => (
            <RadioButtonGroup.Item
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </RadioGroup.Root> */}
      </Container>
    </Flex>
  )
}

export function ControlsSelectForm<
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
  const value = useCommonValue(nodes, key)

  return (
    <Flex>
      <Flex>{controlsLabel}</Flex>
      <Flex>
        {/* <Select
          native
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
          small
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select> */}
      </Flex>
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
