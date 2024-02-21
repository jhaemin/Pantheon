import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card, Flex } from '@radix-ui/themes'

import { NodeComponent } from '@/node-component'
import { type ReactNode } from 'react'
import { Table } from '@radix-ui/themes'

export type RadixTableBodyNodeProps = {}

export class RadixTableBodyNode extends Node {
  readonly nodeName = 'RadixTableBody'
  readonly componentName = 'Table.Body'

  public readonly defaultProps: RadixTableBodyNodeProps = {}

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

export function RadixTableBodyNodeComponent({
  node,
}: {
  node: RadixTableBodyNode
}) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.Body {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixTableBody" />
      )}
    </Table.Body>
  )
}

export function RadixTableBodyNodeControls({
  nodes,
}: {
  nodes: RadixTableBodyNode[]
}) {
  return <></>
}
