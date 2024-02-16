import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card, Flex } from '@radix-ui/themes'
import {
  SelectControls,
  SwitchControls,
  SlotToggleControls,
  TextFieldControls,
} from '@/control-center/controls-template'
import { NodeComponent } from '@/node-component'
import { type ReactNode } from 'react'
import { Container } from '@radix-ui/themes'

export type RadixContainerNodeProps = {
  size?: '1' | '2' | '3' | '4'
  display?: 'none' | 'block'
}

export class RadixContainerNode extends Node {
  readonly nodeName = 'RadixContainer'
  readonly componentName = 'Container'

  public readonly defaultProps: RadixContainerNodeProps = {}

  readonly $props = map(this.defaultProps)

  slotsInfo = {}

  slotsInfoArray = []

  readonly $slots = atom<{}>({})

  constructor() {
    super({
      isUnselectable: false,
    })

    // Enable required slot inside constructor instead of property initializer
    // because enableSlot() sets parent of the slot
  }
}

export function RadixContainerNodeComponent({
  node,
}: {
  node: RadixContainerNode
}) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Container {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixContainer" />
      )}
    </Container>
  )
}

export function RadixContainerNodeControls({
  nodes,
}: {
  nodes: RadixContainerNode[]
}) {
  return (
    <>
      <SelectControls
        controlsLabel="size"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="size"
        defaultValue="4"
        options={[
          { label: 'default', value: undefined },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ]}
      />
      <SelectControls
        controlsLabel="display"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="display"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: 'none', value: 'none' },
          { label: 'block', value: 'block' },
        ]}
      />
    </>
  )
}
