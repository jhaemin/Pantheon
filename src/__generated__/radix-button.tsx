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
import { Button } from '@radix-ui/themes'

export type RadixButtonNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
  color?:
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'brown'
    | 'orange'
    | 'sky'
    | 'mint'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'gold'
    | 'bronze'
    | 'gray'
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export class RadixButtonNode extends Node {
  readonly nodeName = 'RadixButton'

  public readonly defaultProps: RadixButtonNodeProps = {}

  readonly $props = map(this.defaultProps)

  readonly $slots = atom<{}>({})

  constructor() {
    super()
  }
}

export function RadixButtonNodeComponent({ node }: { node: RadixButtonNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Button {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixButton" />
      )}
    </Button>
  )
}

export function RadixButtonNodeControls({
  nodes,
}: {
  nodes: RadixButtonNode[]
}) {
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
        ]}
      />
      <SelectControls
        controlsLabel="variant"
        nodes={nodes}
        propertyKey="variant"
        options={[
          { label: 'default', value: undefined },
          { label: 'classic', value: 'classic' },
          { label: 'solid', value: 'solid' },
          { label: 'soft', value: 'soft' },
          { label: 'surface', value: 'surface' },
          { label: 'outline', value: 'outline' },
          { label: 'ghost', value: 'ghost' },
        ]}
      />
      <SelectControls
        controlsLabel="color"
        nodes={nodes}
        propertyKey="color"
        options={[
          { label: 'default', value: undefined },
          { label: 'tomato', value: 'tomato' },
          { label: 'red', value: 'red' },
          { label: 'ruby', value: 'ruby' },
          { label: 'crimson', value: 'crimson' },
          { label: 'pink', value: 'pink' },
          { label: 'plum', value: 'plum' },
          { label: 'purple', value: 'purple' },
          { label: 'violet', value: 'violet' },
          { label: 'iris', value: 'iris' },
          { label: 'indigo', value: 'indigo' },
          { label: 'blue', value: 'blue' },
          { label: 'cyan', value: 'cyan' },
          { label: 'teal', value: 'teal' },
          { label: 'jade', value: 'jade' },
          { label: 'green', value: 'green' },
          { label: 'grass', value: 'grass' },
          { label: 'brown', value: 'brown' },
          { label: 'orange', value: 'orange' },
          { label: 'sky', value: 'sky' },
          { label: 'mint', value: 'mint' },
          { label: 'lime', value: 'lime' },
          { label: 'yellow', value: 'yellow' },
          { label: 'amber', value: 'amber' },
          { label: 'gold', value: 'gold' },
          { label: 'bronze', value: 'bronze' },
          { label: 'gray', value: 'gray' },
        ]}
      />
      <SelectControls
        controlsLabel="radius"
        nodes={nodes}
        propertyKey="radius"
        options={[
          { label: 'default', value: undefined },
          { label: 'none', value: 'none' },
          { label: 'small', value: 'small' },
          { label: 'medium', value: 'medium' },
          { label: 'large', value: 'large' },
          { label: 'full', value: 'full' },
        ]}
      />
    </>
  )
}
