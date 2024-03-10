import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card as RadixCard, Flex as RadixFlex } from '@radix-ui/themes'

import { NodeComponent } from '@/node-component'
import { Prop } from '@/node-definition'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { Table } from '@radix-ui/themes-2.0.2'

export type RadixTableColumnHeaderCellNodeProps = {}

export class RadixTableColumnHeaderCellNode extends Node {
  readonly nodeName = 'RadixTableColumnHeaderCell'
  readonly componentName = 'Table.ColumnHeaderCell'

  public readonly defaultProps: RadixTableColumnHeaderCellNodeProps = {}

  readonly $props = map(this.defaultProps)
  readonly slotProps = {}

  slotsInfoArray = []

  constructor() {
    super({
      isUnselectable: false,
    })
  }
}

export function RadixTableColumnHeaderCellNodeComponent({
  node,
}: {
  node: RadixTableColumnHeaderCellNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.ColumnHeaderCell {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Table" />
      )}
    </Table.ColumnHeaderCell>
  )
}
