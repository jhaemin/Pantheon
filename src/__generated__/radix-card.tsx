import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node } from '@/node-class/node'
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
import { FragmentNode } from '@/node-class/fragment'
import type { ReactNode } from 'react'

export type RadixCardNodeProps = {
  size?: '1' | '2' | '3' | '4' | '5'
  variant?: 'surface' | 'classic' | 'ghost'
}

export class RadixCardNode extends Node {
  readonly nodeName = 'RadixCard'

  public readonly defaultProps: RadixCardNodeProps = {}

  readonly $props = map(this.defaultProps)

  readonly $slots = atom<{}>({})

  constructor() {
    super({
      isUnselectable: false,
    })
  }
}

export function RadixCardNodeComponent({ node }: { node: RadixCardNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Card {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixCard" />
      )}
    </Card>
  )
}

export function RadixCardNodeControls({ nodes }: { nodes: RadixCardNode[] }) {
  return (
    <>
      <SelectControls
        controlsLabel="size"
        nodes={nodes}
        propertyKey="size"
        options={[
          { label: 'default', value: undefined },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
        ]}
      />
      <SelectControls
        controlsLabel="variant"
        nodes={nodes}
        propertyKey="variant"
        options={[
          { label: 'default', value: undefined },
          { label: 'surface', value: 'surface' },
          { label: 'classic', value: 'classic' },
          { label: 'ghost', value: 'ghost' },
        ]}
      />
    </>
  )
}
