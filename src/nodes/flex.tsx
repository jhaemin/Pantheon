import { DESIGN_MODE_EDGE_SPACE } from '@/constants'
import {
  ControlsRadioGroupForm,
  ControlsSelectForm,
} from '@/control-center/controls-form'
import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Flex } from '@radix-ui/themes'
import { map } from 'nanostores'
import { ComponentProps } from 'react'
import { renderChildren } from '../node-component'

export type FlexProps = ComponentProps<typeof Flex>

export class FlexNode extends Node {
  readonly nodeName = 'Flex' satisfies NodeName

  defaultProps: FlexProps = {}

  $props = map<FlexProps>({
    align: 'center',
    justify: 'center',
    direction: 'row',
  })

  constructor() {
    super()
  }
}

export function FlexNodeComponent({ node }: { node: FlexNode }) {
  const designMode = useStore(window.shared.$designMode)

  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Flex
      {...props}
      style={{
        ...props.style,
        padding: designMode ? DESIGN_MODE_EDGE_SPACE : undefined,
        backgroundColor: designMode ? 'rgba(0, 0, 0, 0.05)' : undefined,
      }}
    >
      {children.length === 0 ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            minHeight: 60,
            minWidth: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          Flex
        </div>
      ) : (
        renderChildren(children)
      )}
    </Flex>
  )
}

export function FlexNodeControls({ nodes }: { nodes: FlexNode[] }) {
  return (
    <>
      <ControlsRadioGroupForm
        controlsLabel="Direction"
        nodes={nodes}
        propertyKey="direction"
        options={[
          { label: '↓', value: 'column' },
          { label: '→', value: 'row' },
        ]}
      />
      <ControlsRadioGroupForm
        controlsLabel="Align"
        nodes={nodes}
        propertyKey="align"
        options={[
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
        ]}
      />
      <ControlsSelectForm
        controlsLabel="Justify"
        nodes={nodes}
        propertyKey="justify"
        options={[
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Space between', value: 'between' },
        ]}
      />
    </>
  )
}
