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
import { Switch } from '@radix-ui/themes'

export type RadixSwitchNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'surface' | 'soft'
  highContrast?: boolean
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export class RadixSwitchNode extends Node {
  readonly nodeName = 'RadixSwitch'
  readonly componentName = 'Switch'

  public readonly defaultProps: RadixSwitchNodeProps = {}

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
        defaultValue="surface"
        options={[
          { label: 'default', value: undefined },
          { label: 'classic', value: 'classic' },
          { label: 'surface', value: 'surface' },
          { label: 'soft', value: 'soft' },
        ]}
      />
      <SwitchControls
        controlsLabel="highContrast"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="highContrast"
        defaultValue={undefined}
      />
      <SelectControls
        controlsLabel="radius"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="radius"
        defaultValue={undefined}
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
