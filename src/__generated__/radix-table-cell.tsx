import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card, Flex } from '@radix-ui/themes'

import { NodeComponent } from '@/node-component'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { Table } from '@radix-ui/themes'

export type RadixTableCellNodeProps = {}

export class RadixTableCellNode extends Node {
  readonly nodeName = 'RadixTableCell'
  readonly componentName = 'Table.Cell'

  public readonly defaultProps: RadixTableCellNodeProps = {}

  readonly $props = map(this.defaultProps)

  slotsInfoArray = []

  slotsDefinition = undefined

  constructor() {
    super({
      isUnselectable: false,
    })

    // Enable required slot inside constructor instead of property initializer
    // because enableSlot() sets parent of the slot
  }
}

export function RadixTableCellNodeComponent({
  node,
}: {
  node: RadixTableCellNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.Cell {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixTableCell" />
      )}
    </Table.Cell>
  )
}

export function RadixTableCellNodeControls({
  nodes,
}: {
  nodes: RadixTableCellNode[]
}) {
  return <></>
}
