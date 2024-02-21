import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card, Flex } from '@radix-ui/themes'
import {
  SelectControls,
  SwitchControls,
  SlotToggleControls,
  TextFieldControls,
} from '@/control-center/controls-template'
import { NodeComponent } from '@/node-component'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { Table } from '@radix-ui/themes'

export type RadixTableRootNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'surface' | 'ghost'
}

export class RadixTableRootNode extends Node {
  readonly nodeName = 'RadixTableRoot'
  readonly componentName = 'Table.Root'

  public readonly defaultProps: RadixTableRootNodeProps = {}

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

export function RadixTableRootNodeComponent({
  node,
}: {
  node: RadixTableRootNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Table.Root {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixTableRoot" />
      )}
    </Table.Root>
  )
}

export function RadixTableRootNodeControls({
  nodes,
}: {
  nodes: RadixTableRootNode[]
}) {
  return (
    <>
      <SelectControls
        controlsLabel="size"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="size"
        defaultValue="2"
        options={[
          { label: 'default', value: undefined },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ]}
      />
      <SelectControls
        controlsLabel="variant"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="variant"
        defaultValue="ghost"
        options={[
          { label: 'default', value: undefined },
          { label: 'surface', value: 'surface' },
          { label: 'ghost', value: 'ghost' },
        ]}
      />
    </>
  )
}
