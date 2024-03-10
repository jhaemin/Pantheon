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
import { Switch } from '@radix-ui/themes-2.0.3'

export type RadixSwitchNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'surface' | 'soft'
  highContrast?: boolean
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export class RadixSwitchNode extends Node {
  readonly nodeName = 'RadixSwitch'
  readonly componentName = 'Switch'

  public readonly defaultProps: RadixSwitchNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2', '3'], default: '2' },
    {
      key: 'variant',
      type: ['classic', 'surface', 'soft'],
      default: 'surface',
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

  get isDroppable() {
    return false
  }
}

export function RadixSwitchNodeComponent({ node }: { node: RadixSwitchNode }) {
  const nodeProps = makeNodeProps(node)

  const props = useStore(node.$props)

  return <Switch {...props} {...nodeProps} />
}
