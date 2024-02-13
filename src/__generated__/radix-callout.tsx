import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node } from '@/node-class/node'
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
import { FragmentNode } from '@/node-class/fragment'
import type { ReactNode } from 'react'
import { Callout } from '@radix-ui/themes'

export type RadixCalloutNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'soft' | 'surface' | 'outline'
  color?:
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'brown'
    | 'orange'
    | 'sky'
    | 'mint'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'gold'
    | 'bronze'
    | 'gray'
  highContrast?: boolean
}

export class RadixCalloutNode extends Node {
  readonly nodeName = 'RadixCallout'

  public readonly defaultProps: RadixCalloutNodeProps = {}

  get isDroppable() {
    return false
  }

  readonly $props = map(this.defaultProps)

  readonly $slots = atom<{ icon: FragmentNode | null; text: FragmentNode }>({
    icon: null,
    text: new FragmentNode(),
  })

  constructor() {
    super({
      isUnselectable: false,
    })

    this.setSlot(
      'text',
      new FragmentNode({
        isRemovable: false,
        isDraggable: false,
      }),
    )
  }
}

export function RadixCalloutNodeComponent({
  node,
}: {
  node: RadixCalloutNode
}) {
  const props = useStore(node.$props)
  const slots = useStore(node.$slots)

  return (
    <Callout.Root {...props}>
      {slots.icon && (
        <Callout.Icon>
          <NodeComponent node={slots.icon} />
        </Callout.Icon>
      )}
      {slots.text && (
        <Callout.Text>
          <NodeComponent node={slots.text} />
        </Callout.Text>
      )}
    </Callout.Root>
  )
}

export function RadixCalloutNodeControls({
  nodes,
}: {
  nodes: RadixCalloutNode[]
}) {
  return (
    <>
      <Card size="1">
        <Flex direction="column" gap="3">
          <SlotToggleControls slotKey="icon" nodes={nodes} />
        </Flex>
      </Card>

      <SelectControls
        controlsLabel="size"
        nodes={nodes}
        propertyKey="size"
        options={[
          { label: 'default', value: undefined },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ]}
      />
      <SelectControls
        controlsLabel="variant"
        nodes={nodes}
        propertyKey="variant"
        options={[
          { label: 'default', value: undefined },
          { label: 'soft', value: 'soft' },
          { label: 'surface', value: 'surface' },
          { label: 'outline', value: 'outline' },
        ]}
      />
      <SelectControls
        controlsLabel="color"
        nodes={nodes}
        propertyKey="color"
        options={[
          { label: 'default', value: undefined },
          { label: 'tomato', value: 'tomato' },
          { label: 'red', value: 'red' },
          { label: 'ruby', value: 'ruby' },
          { label: 'crimson', value: 'crimson' },
          { label: 'pink', value: 'pink' },
          { label: 'plum', value: 'plum' },
          { label: 'purple', value: 'purple' },
          { label: 'violet', value: 'violet' },
          { label: 'iris', value: 'iris' },
          { label: 'indigo', value: 'indigo' },
          { label: 'blue', value: 'blue' },
          { label: 'cyan', value: 'cyan' },
          { label: 'teal', value: 'teal' },
          { label: 'jade', value: 'jade' },
          { label: 'green', value: 'green' },
          { label: 'grass', value: 'grass' },
          { label: 'brown', value: 'brown' },
          { label: 'orange', value: 'orange' },
          { label: 'sky', value: 'sky' },
          { label: 'mint', value: 'mint' },
          { label: 'lime', value: 'lime' },
          { label: 'yellow', value: 'yellow' },
          { label: 'amber', value: 'amber' },
          { label: 'gold', value: 'gold' },
          { label: 'bronze', value: 'bronze' },
          { label: 'gray', value: 'gray' },
        ]}
      />
      <SwitchControls
        controlsLabel="highContrast"
        nodes={nodes}
        propertyKey="highContrast"
      />
    </>
  )
}
