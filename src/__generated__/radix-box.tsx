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
import { Box } from '@radix-ui/themes'

export type RadixBoxNodeProps = {
  display?: 'none' | 'inline' | 'inline-block' | 'block'
  p?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  px?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  py?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  pt?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  pr?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  pb?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  pl?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  inset?: 'auto' | '0' | '50%' | '100%'
  top?: 'auto' | '0' | '50%' | '100%'
  right?: 'auto' | '0' | '50%' | '100%'
  bottom?: 'auto' | '0' | '50%' | '100%'
  left?: 'auto' | '0' | '50%' | '100%'
  shrink?: '0' | '1'
  grow?: '0' | '1'
}

export class RadixBoxNode extends Node {
  readonly nodeName = 'RadixBox'

  public readonly defaultProps: RadixBoxNodeProps = {}

  readonly $props = map(this.defaultProps)

  readonly $slots = atom<{}>({})

  constructor() {
    super({
      isUnselectable: false,
    })
  }
}

export function RadixBoxNodeComponent({ node }: { node: RadixBoxNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Box {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixBox" />
      )}
    </Box>
  )
}

export function RadixBoxNodeControls({ nodes }: { nodes: RadixBoxNode[] }) {
  return (
    <>
      <SelectControls
        controlsLabel="display"
        nodes={nodes}
        propertyKey="display"
        options={[
          { label: 'default', value: undefined },
          { label: 'none', value: 'none' },
          { label: 'inline', value: 'inline' },
          { label: 'inline-block', value: 'inline-block' },
          { label: 'block', value: 'block' },
        ]}
      />
      <SelectControls
        controlsLabel="p"
        nodes={nodes}
        propertyKey="p"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="px"
        nodes={nodes}
        propertyKey="px"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="py"
        nodes={nodes}
        propertyKey="py"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="pt"
        nodes={nodes}
        propertyKey="pt"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="pr"
        nodes={nodes}
        propertyKey="pr"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="pb"
        nodes={nodes}
        propertyKey="pb"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="pl"
        nodes={nodes}
        propertyKey="pl"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="position"
        nodes={nodes}
        propertyKey="position"
        options={[
          { label: 'default', value: undefined },
          { label: 'static', value: 'static' },
          { label: 'relative', value: 'relative' },
          { label: 'absolute', value: 'absolute' },
          { label: 'fixed', value: 'fixed' },
          { label: 'sticky', value: 'sticky' },
        ]}
      />
      <SelectControls
        controlsLabel="inset"
        nodes={nodes}
        propertyKey="inset"
        options={[
          { label: 'default', value: undefined },
          { label: 'auto', value: 'auto' },
          { label: '0', value: '0' },
          { label: '50%', value: '50%' },
          { label: '100%', value: '100%' },
        ]}
      />
      <SelectControls
        controlsLabel="top"
        nodes={nodes}
        propertyKey="top"
        options={[
          { label: 'default', value: undefined },
          { label: 'auto', value: 'auto' },
          { label: '0', value: '0' },
          { label: '50%', value: '50%' },
          { label: '100%', value: '100%' },
        ]}
      />
      <SelectControls
        controlsLabel="right"
        nodes={nodes}
        propertyKey="right"
        options={[
          { label: 'default', value: undefined },
          { label: 'auto', value: 'auto' },
          { label: '0', value: '0' },
          { label: '50%', value: '50%' },
          { label: '100%', value: '100%' },
        ]}
      />
      <SelectControls
        controlsLabel="bottom"
        nodes={nodes}
        propertyKey="bottom"
        options={[
          { label: 'default', value: undefined },
          { label: 'auto', value: 'auto' },
          { label: '0', value: '0' },
          { label: '50%', value: '50%' },
          { label: '100%', value: '100%' },
        ]}
      />
      <SelectControls
        controlsLabel="left"
        nodes={nodes}
        propertyKey="left"
        options={[
          { label: 'default', value: undefined },
          { label: 'auto', value: 'auto' },
          { label: '0', value: '0' },
          { label: '50%', value: '50%' },
          { label: '100%', value: '100%' },
        ]}
      />
      <SelectControls
        controlsLabel="shrink"
        nodes={nodes}
        propertyKey="shrink"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
        ]}
      />
      <SelectControls
        controlsLabel="grow"
        nodes={nodes}
        propertyKey="grow"
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
        ]}
      />
    </>
  )
}
