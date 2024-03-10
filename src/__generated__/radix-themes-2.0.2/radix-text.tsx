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
import { Text } from '@radix-ui/themes-2.0.2'

export type RadixTextNodeProps = {
  as?: 'p' | 'label' | 'div' | 'span'
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

export class RadixTextNode extends Node {
  readonly nodeName = 'RadixText'
  readonly componentName = 'Text'

  public readonly defaultProps: RadixTextNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'as', type: ['p', 'label', 'div', 'span'], default: 'span' },
    { key: 'size', type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    { key: 'weight', type: ['light', 'regular', 'medium', 'bold'] },
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

export function RadixTextNodeComponent({ node }: { node: RadixTextNode }) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Text {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Text" />
      )}
    </Text>
  )
}
