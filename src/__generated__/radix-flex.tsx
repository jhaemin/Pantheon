import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'

import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Flex } from '@radix-ui/themes'
import { SelectControls } from '@/control-center/controls-template'

export type RadixFlexNodeProps = {
  asChild?: boolean
  display?: 'none' | 'inline-flex' | 'flex'
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
}

export class RadixFlexNode extends Node {
  readonly nodeName = 'RadixFlex' satisfies NodeName

  defaultProps: RadixFlexNodeProps = {
    display: 'flex',
    justify: 'start',
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
        controlsLabel="asChild"
        nodes={nodes}
        propertyKey="asChild"
        options={[{ label: 'default', value: undefined }]}
      />
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
    </>
  )
}
