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
import { type ReactNode } from 'react'
import { Grid } from '@radix-ui/themes'

export type RadixGridNodeProps = {
  display?: 'none' | 'inline-grid' | 'grid'
  columns?: string
  rows?: string
  flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between'
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  gapX?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  gapY?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  m?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  mx?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  my?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  mt?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  mr?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  mb?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  ml?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
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

export class RadixGridNode extends Node {
  readonly nodeName = 'RadixGrid'
  readonly componentName = 'Grid'

  public readonly defaultProps: RadixGridNodeProps = {}

  readonly $props = map(this.defaultProps)

  slotsInfo = {}

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

export function RadixGridNodeComponent({ node }: { node: RadixGridNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Grid {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixGrid" />
      )}
    </Grid>
  )
}

export function RadixGridNodeControls({ nodes }: { nodes: RadixGridNode[] }) {
  return (
    <>
      <SelectControls
        controlsLabel="display"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="display"
        defaultValue="grid"
        options={[
          { label: 'default', value: undefined },
          { label: 'none', value: 'none' },
          { label: 'inline-grid', value: 'inline-grid' },
          { label: 'grid', value: 'grid' },
        ]}
      />
      <TextFieldControls
        controlsLabel="columns"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="columns"
        defaultValue={undefined}
      />
      <TextFieldControls
        controlsLabel="rows"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="rows"
        defaultValue={undefined}
      />
      <SelectControls
        controlsLabel="flow"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="flow"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: 'row', value: 'row' },
          { label: 'column', value: 'column' },
          { label: 'dense', value: 'dense' },
          { label: 'row-dense', value: 'row-dense' },
          { label: 'column-dense', value: 'column-dense' },
        ]}
      />
      <SelectControls
        controlsLabel="align"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="align"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="justify"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: 'start', value: 'start' },
          { label: 'center', value: 'center' },
          { label: 'end', value: 'end' },
          { label: 'between', value: 'between' },
        ]}
      />
      <SelectControls
        controlsLabel="gap"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="gap"
        defaultValue={undefined}
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
        controlsLabel="gapX"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="gapX"
        defaultValue={undefined}
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
        controlsLabel="gapY"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="gapY"
        defaultValue={undefined}
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
        controlsLabel="m"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="m"
        defaultValue={undefined}
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
        controlsLabel="mx"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="mx"
        defaultValue={undefined}
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
        controlsLabel="my"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="my"
        defaultValue={undefined}
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
        controlsLabel="mt"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="mt"
        defaultValue={undefined}
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
        controlsLabel="mr"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="mr"
        defaultValue={undefined}
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
        controlsLabel="mb"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="mb"
        defaultValue={undefined}
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
        controlsLabel="ml"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="ml"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="p"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="px"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="py"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="pt"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="pr"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="pb"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="pl"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="position"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="inset"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="top"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="right"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="bottom"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="left"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="shrink"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
        ]}
      />
      <SelectControls
        controlsLabel="grow"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="grow"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: '0', value: '0' },
          { label: '1', value: '1' },
        ]}
      />
    </>
  )
}
