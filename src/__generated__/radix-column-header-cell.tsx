import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card, Flex } from '@radix-ui/themes'

import { NodeComponent } from '@/node-component'
import { type ReactNode } from 'react'
import { Table } from '@radix-ui/themes'

export type RadixColumnHeaderCellNodeProps = {}

export class RadixColumnHeaderCellNode extends Node {
  readonly nodeName = 'RadixColumnHeaderCell'
  readonly componentName = 'Table.ColumnHeaderCell'

  public readonly defaultProps: RadixColumnHeaderCellNodeProps = {}

  readonly $props = map(this.defaultProps)

  slotsInfoArray = []

  readonly $slots = atom<{}>({})

  constructor() {
    super({
      isUnselectable: false,
    })

    // Enable required slot inside constructor instead of property initializer
    // because enableSlot() sets parent of the slot
  }
}

export function RadixColumnHeaderCellNodeComponent({
  node,
}: {
  node: RadixColumnHeaderCellNode
}) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.ColumnHeaderCell {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixColumnHeaderCell" />
      )}
    </Table.ColumnHeaderCell>
  )
}

export function RadixColumnHeaderCellNodeControls({
  nodes,
}: {
  nodes: RadixColumnHeaderCellNode[]
}) {
  return <></>
}
