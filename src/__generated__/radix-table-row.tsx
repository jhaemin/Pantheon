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

export type RadixTableRowNodeProps = {}

export class RadixTableRowNode extends Node {
  readonly nodeName = 'RadixTableRow'
  readonly componentName = 'Table.Row'

  public readonly defaultProps: RadixTableRowNodeProps = {}

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

export function RadixTableRowNodeComponent({
  node,
}: {
  node: RadixTableRowNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.Row {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixTableRow" />
      )}
    </Table.Row>
  )
}

export function RadixTableRowNodeControls({
  nodes,
}: {
  nodes: RadixTableRowNode[]
}) {
  return <></>
}
