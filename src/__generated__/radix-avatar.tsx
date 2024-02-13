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
import { Avatar } from '@radix-ui/themes'

export type RadixAvatarNodeProps = {
  src?: string
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  variant?: 'solid' | 'soft'
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
  highContrast?: boolean
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
  fallback: NonNullable<ReactNode>
}

export class RadixAvatarNode extends Node {
  readonly nodeName = 'RadixAvatar'

  public readonly defaultProps: RadixAvatarNodeProps = {
    fallback: 'A',
  }

  readonly $props = map(this.defaultProps)

  readonly $slots = atom<{}>({})

  constructor() {
    super({
      isUnselectable: false,
    })
  }

  get isDroppable() {
    return false
  }
}

export function RadixAvatarNodeComponent({ node }: { node: RadixAvatarNode }) {
  const props = useStore(node.$props)

  return <Avatar {...props} />
}

export function RadixAvatarNodeControls({
  nodes,
}: {
  nodes: RadixAvatarNode[]
}) {
  return (
    <>
      <TextFieldControls controlsLabel="src" nodes={nodes} propertyKey="src" />
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
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
        ]}
      />
      <SelectControls
        controlsLabel="variant"
        nodes={nodes}
        propertyKey="variant"
        options={[
          { label: 'default', value: undefined },
          { label: 'solid', value: 'solid' },
          { label: 'soft', value: 'soft' },
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
      <SwitchControls
        controlsLabel="highContrast"
        nodes={nodes}
        propertyKey="highContrast"
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
