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
import { TextField } from '@radix-ui/themes-2.0.2'

export type RadixTextFieldNodeProps = {
  placeholder?: string
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'surface' | 'soft'
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
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export class RadixTextFieldNode extends Node {
  readonly nodeName = 'RadixTextField'
  readonly componentName = 'TextField.Input'

  public readonly defaultProps: RadixTextFieldNodeProps = {
    size: '2',
    variant: 'surface',
  }

  propsDefinition: Prop[] = [
    { key: 'placeholder', type: 'string' },
    { key: 'size', type: ['1', '2', '3'], default: '2' },
    {
      key: 'variant',
      type: ['classic', 'surface', 'soft'],
      default: 'surface',
    },
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
    { key: 'radius', type: ['none', 'small', 'medium', 'large', 'full'] },
  ]

  readonly $props = map(this.defaultProps)
  readonly slotProps = {}

  slotsInfoArray = []

  constructor() {
    super({
      isUnselectable: false,
    })
  }

  get isDroppable() {
    return false
  }
}

export function RadixTextFieldNodeComponent({
  node,
}: {
  node: RadixTextFieldNode
}) {
  const nodeProps = makeNodeProps(node)

  const props = useStore(node.$props)

  return <TextField.Input {...props} {...nodeProps} />
}
