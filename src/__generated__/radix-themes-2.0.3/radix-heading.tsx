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
import { Heading } from '@radix-ui/themes-2.0.3'

export type RadixHeadingNodeProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  align?: 'left' | 'center' | 'right'
  trim?: 'normal' | 'start' | 'end' | 'both'
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

export class RadixHeadingNode extends Node {
  readonly nodeName = 'RadixHeading'
  readonly componentName = 'Heading'

  public readonly defaultProps: RadixHeadingNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'as', type: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], default: 'h1' },
    {
      key: 'size',
      type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      default: '6',
    },
    {
      key: 'weight',
      type: ['light', 'regular', 'medium', 'bold'],
      default: 'bold',
    },
    { key: 'align', type: ['left', 'center', 'right'] },
    { key: 'trim', type: ['normal', 'start', 'end', 'both'] },
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

  slotsInfoArray = []

  constructor() {
    super({
      isUnselectable: false,
    })
  }
}

export function RadixHeadingNodeComponent({
  node,
}: {
  node: RadixHeadingNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Heading {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Heading" />
      )}
    </Heading>
  )
}
