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

export type RadixTableHeaderNodeProps = {}

export class RadixTableHeaderNode extends Node {
  readonly nodeName = 'RadixTableHeader'
  readonly componentName = 'Table.Header'

  public readonly defaultProps: RadixTableHeaderNodeProps = {}

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

export function RadixTableHeaderNodeComponent({
  node,
}: {
  node: RadixTableHeaderNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.Header {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixTableHeader" />
      )}
    </Table.Header>
  )
}

export function RadixTableHeaderNodeControls({
  nodes,
}: {
  nodes: RadixTableHeaderNode[]
}) {
  return <></>
}
