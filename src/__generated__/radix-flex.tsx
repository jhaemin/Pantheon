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

export type RadixFlexNodeProps = {
  display?: 'none' | 'inline-flex' | 'flex'
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
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

export class RadixFlexNode extends Node {
  readonly nodeName = 'RadixFlex'

  public readonly defaultProps: RadixFlexNodeProps = {}

  readonly $props = map(this.defaultProps)

  readonly $slots = atom<{}>({})

  constructor() {
    super()
  }
}

export function RadixFlexNodeComponent({ node }: { node: RadixFlexNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Flex {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixFlex" />
      )}
    </Flex>
  )
}

export function RadixFlexNodeControls({ nodes }: { nodes: RadixFlexNode[] }) {
  return (
    <>
      <SelectControls
        controlsLabel="display"
        nodes={nodes}
        propertyKey="display"
        options={[
          { label: 'default', value: undefined },
          { label: 'none', value: 'none' },
          { label: 'inline-flex', value: 'inline-flex' },
          { label: 'flex', value: 'flex' },
        ]}
      />
      <SelectControls
        controlsLabel="direction"
        nodes={nodes}
        propertyKey="direction"
        options={[
          { label: 'default', value: undefined },
          { label: 'row', value: 'row' },
          { label: 'row-reverse', value: 'row-reverse' },
          { label: 'column', value: 'column' },
          { label: 'column-reverse', value: 'column-reverse' },
        ]}
      />
      <SelectControls
        controlsLabel="align"
        nodes={nodes}
        propertyKey="align"
        options={[
          { label: 'default', value: undefined },
          { label: 'start', value: 'start' },
          { label: 'center', value: 'center' },
          { label: 'end', value: 'end' },
          { label: 'stretch', value: 'stretch' },
          { label: 'baseline', value: 'baseline' },
        ]}
      />
      <SelectControls
        controlsLabel="justify"
        nodes={nodes}
        propertyKey="justify"
        options={[
          { label: 'default', value: undefined },
          { label: 'start', value: 'start' },
          { label: 'center', value: 'center' },
          { label: 'end', value: 'end' },
          { label: 'between', value: 'between' },
        ]}
      />
      <SelectControls
        controlsLabel="wrap"
        nodes={nodes}
        propertyKey="wrap"
        options={[
          { label: 'default', value: undefined },
          { label: 'wrap', value: 'wrap' },
          { label: 'nowrap', value: 'nowrap' },
          { label: 'wrap-reverse', value: 'wrap-reverse' },
        ]}
      />
      <SelectControls
        controlsLabel="gap"
        nodes={nodes}
        propertyKey="gap"
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
