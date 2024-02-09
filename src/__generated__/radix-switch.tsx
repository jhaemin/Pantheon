import { Node } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { Switch } from '@radix-ui/themes'
import { SelectControls } from '@/control-center/controls-template'

export type RadixSwitchNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'surface' | 'soft'
  highContrast?: boolean
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export class RadixSwitchNode extends Node {
  readonly nodeName = 'RadixSwitch'

  public readonly defaultProps: RadixSwitchNodeProps = {
    size: '2',
    variant: 'surface',
  }

  get isDroppable() {
    return false
  }
}

export function RadixSwitchNodeComponent({ node }: { node: RadixSwitchNode }) {
  const props = useStore(node.$props)

  return <Switch {...props} />
}

export function RadixSwitchNodeControls({
  nodes,
}: {
  nodes: RadixSwitchNode[]
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
          { label: 'surface', value: 'surface' },
          { label: 'soft', value: 'soft' },
        ]}
      />
      <SelectControls
        controlsLabel="highContrast"
        nodes={nodes}
        propertyKey="highContrast"
        options={[{ label: 'default', value: undefined }]}
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