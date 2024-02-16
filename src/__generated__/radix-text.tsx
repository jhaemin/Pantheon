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
import { Text } from '@radix-ui/themes'

export type RadixTextNodeProps = {
  as?: 'p' | 'label' | 'div' | 'span'
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  weight?: 'light' | 'regular' | 'medium' | 'bold'
  align?: 'left' | 'center' | 'right'
  trim?: 'normal' | 'start' | 'end' | 'both'
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
}

export class RadixTextNode extends Node {
  readonly nodeName = 'RadixText'
  readonly componentName = 'Text'

  public readonly defaultProps: RadixTextNodeProps = {}

  readonly $props = map(this.defaultProps)

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

export function RadixTextNodeComponent({ node }: { node: RadixTextNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Text {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixText" />
      )}
    </Text>
  )
}

export function RadixTextNodeControls({ nodes }: { nodes: RadixTextNode[] }) {
  return (
    <>
      <SelectControls
        controlsLabel="as"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="as"
        defaultValue="span"
        options={[
          { label: 'default', value: undefined },
          { label: 'p', value: 'p' },
          { label: 'label', value: 'label' },
          { label: 'div', value: 'div' },
          { label: 'span', value: 'span' },
        ]}
      />
      <SelectControls
        controlsLabel="size"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="size"
        defaultValue={undefined}
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
        controlsLabel="weight"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="weight"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: 'light', value: 'light' },
          { label: 'regular', value: 'regular' },
          { label: 'medium', value: 'medium' },
          { label: 'bold', value: 'bold' },
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
          { label: 'left', value: 'left' },
          { label: 'center', value: 'center' },
          { label: 'right', value: 'right' },
        ]}
      />
      <SelectControls
        controlsLabel="trim"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="trim"
        defaultValue={undefined}
        options={[
          { label: 'default', value: undefined },
          { label: 'normal', value: 'normal' },
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
          { label: 'both', value: 'both' },
        ]}
      />
      <SelectControls
        controlsLabel="color"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="color"
        defaultValue={undefined}
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
        propsAtomKey="$props"
        propertyKey="highContrast"
        defaultValue={undefined}
      />
    </>
  )
}
