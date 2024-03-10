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
import { Badge } from '@radix-ui/themes-2.0.2'

export type RadixBadgeNodeProps = {
  size?: '1' | '2'
  variant?: 'solid' | 'soft' | 'surface' | 'outline'
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
}

export class RadixBadgeNode extends Node {
  readonly nodeName = 'RadixBadge'
  readonly componentName = 'Badge'

  public readonly defaultProps: RadixBadgeNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2'], default: '1' },
    {
      key: 'variant',
      type: ['solid', 'soft', 'surface', 'outline'],
      default: 'soft',
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
    { key: 'highContrast', type: 'boolean' },
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
}

export function RadixBadgeNodeComponent({ node }: { node: RadixBadgeNode }) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Badge {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Badge" />
      )}
    </Badge>
  )
}
