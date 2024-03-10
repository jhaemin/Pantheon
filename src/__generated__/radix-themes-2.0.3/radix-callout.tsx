import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card as RadixCard, Flex as RadixFlex } from '@radix-ui/themes'
import {
  SelectControls,
  SwitchControls,
  SlotToggleControls,
  TextFieldControls,
} from '@/control-center/controls-template'
import { NodeComponent } from '@/node-component'
import { Prop } from '@/node-definition'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { Callout } from '@radix-ui/themes-2.0.3'

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

export type RadixCalloutNodeSlotKey = 'icon' | 'text'

export class RadixCalloutNode extends Node<RadixCalloutNodeSlotKey> {
  readonly nodeName = 'RadixCallout'
  readonly componentName = 'Callout.Root'

  public readonly defaultProps: RadixCalloutNodeProps = {}

  get isDroppable() {
    return false
  }

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2', '3'], default: '2' },
    { key: 'variant', type: ['soft', 'surface', 'outline'], default: 'soft' },
    {
      key: 'color',
      type: [
        'tomato',
        'red',
        'ruby',
        'crimson',
        'pink',
        'plum',
        'purple',
        'violet',
        'iris',
        'indigo',
        'blue',
        'cyan',
        'teal',
        'jade',
        'green',
        'grass',
        'brown',
        'orange',
        'sky',
        'mint',
        'lime',
        'yellow',
        'amber',
        'gold',
        'bronze',
        'gray',
      ],
    },
    { key: 'highContrast', type: 'boolean' },
  ]

  readonly $props = map(this.defaultProps)
  readonly slotProps = {}

  slotsInfoArray = [
    {
      required: false,
      key: 'icon' as RadixCalloutNodeSlotKey,
      label: 'icon',
      componentName: 'Callout.Icon',
    },
    {
      required: true,
      key: 'text' as RadixCalloutNodeSlotKey,
      label: 'text',
      componentName: 'Callout.Text',
    },
  ]

  slotsDefinition = [
    { key: 'icon', componentName: 'Callout.Icon' },
    { key: 'text', componentName: 'Callout.Text', required: true },
  ]

  constructor() {
    super({
      isUnselectable: false,
    })

    this.enableSlot('text')
  }
}

export function RadixCalloutNodeComponent({
  node,
}: {
  node: RadixCalloutNode
}) {
  const nodeProps = makeNodeProps(node)

  const props = useStore(node.$props)
  const slots = useStore(node.$slots)

  return (
    <Callout.Root {...props} {...nodeProps}>
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
