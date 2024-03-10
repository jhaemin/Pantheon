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
import { Avatar } from '@radix-ui/themes-2.0.3'

export type RadixAvatarNodeProps = {
  src?: string
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  variant?: 'solid' | 'soft'
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
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
  fallback: NonNullable<ReactNode>
}

export class RadixAvatarNode extends Node {
  readonly nodeName = 'RadixAvatar'
  readonly componentName = 'Avatar'

  public readonly defaultProps: RadixAvatarNodeProps = {
    size: '3',
    variant: 'soft',
    fallback: 'A',
  }

  propsDefinition: Prop[] = [
    { key: 'src', type: 'string' },
    {
      key: 'size',
      type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      default: '3',
    },
    { key: 'variant', type: ['solid', 'soft'], default: 'soft' },
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
    { key: 'radius', type: ['none', 'small', 'medium', 'large', 'full'] },
    {
      key: 'fallback',
      type: { type: 'NonNullable<ReactNode>' },
      required: true,
      default: 'A',
    },
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

export function RadixAvatarNodeComponent({ node }: { node: RadixAvatarNode }) {
  const nodeProps = makeNodeProps(node)

  const props = useStore(node.$props)

  return <Avatar {...props} {...nodeProps} />
}
