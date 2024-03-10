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
import { Card } from '@radix-ui/themes-2.0.3'

export type RadixCardNodeProps = {
  size?: '1' | '2' | '3' | '4' | '5'
  variant?: 'surface' | 'classic' | 'ghost'
}

export class RadixCardNode extends Node {
  readonly nodeName = 'RadixCard'
  readonly componentName = 'Card'

  public readonly defaultProps: RadixCardNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2', '3', '4', '5'], default: '1' },
    {
      key: 'variant',
      type: ['surface', 'classic', 'ghost'],
      default: 'surface',
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
}

export function RadixCardNodeComponent({ node }: { node: RadixCardNode }) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Card {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Card" />
      )}
    </Card>
  )
}
