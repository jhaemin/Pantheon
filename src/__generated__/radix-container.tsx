import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Container } from '@radix-ui/themes'
import {
  SelectControls,
  SwitchControls,
  SlotToggleControls,
} from '@/control-center/controls-template'
import { Card, Flex } from '@radix-ui/themes'
import { NodeComponent } from '@/node-component'
import { FragmentNode } from '@/node-class/fragment'

export type RadixContainerNodeProps = {
  size?: '1' | '2' | '3' | '4'
  display?: 'none' | 'block'
}

export class RadixContainerNode extends Node {
  readonly nodeName = 'RadixContainer'

  public readonly defaultProps: RadixContainerNodeProps = {
    size: '4',
  }

  readonly $props = map(this.defaultProps)

  readonly $slots = atom({})

  constructor() {
    super()
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
        propertyKey="size"
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
        propertyKey="display"
        options={[
          { label: 'default', value: undefined },
          { label: 'none', value: 'none' },
          { label: 'block', value: 'block' },
        ]}
      />
    </>
  )
}
