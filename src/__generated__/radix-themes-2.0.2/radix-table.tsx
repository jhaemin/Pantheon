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
import { Table } from '@radix-ui/themes-2.0.2'

export type RadixTableNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'surface' | 'ghost'
}

export class RadixTableNode extends Node {
  readonly nodeName = 'RadixTable'
  readonly componentName = 'Table.Root'

  public readonly defaultProps: RadixTableNodeProps = {
    size: '2',
    variant: 'ghost',
  }

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2', '3'], default: '2' },
    { key: 'variant', type: ['surface', 'ghost'], default: 'ghost' },
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

export function RadixTableNodeComponent({ node }: { node: RadixTableNode }) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.Root {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Table" />
      )}
    </Table.Root>
  )
}
