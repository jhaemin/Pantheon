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
import { Code } from '@radix-ui/themes-2.0.2'

export type RadixCodeNodeProps = {
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  variant?: 'solid' | 'soft' | 'outline' | 'ghost'
  weight?: 'light' | 'regular' | 'medium' | 'bold'
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

export class RadixCodeNode extends Node {
  readonly nodeName = 'RadixCode'
  readonly componentName = 'Code'

  public readonly defaultProps: RadixCodeNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    {
      key: 'variant',
      type: ['solid', 'soft', 'outline', 'ghost'],
      default: 'soft',
    },
    { key: 'weight', type: ['light', 'regular', 'medium', 'bold'] },
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

export function RadixCodeNodeComponent({ node }: { node: RadixCodeNode }) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Code {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Code" />
      )}
    </Code>
  )
}
