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
import { Dialog } from '@radix-ui/themes'

export type RadixDialogNodeProps = {
  open?: boolean
}

export type RadixDialogSlotContentProps = {
  size?: '1' | '2' | '3' | '4'
}

export class RadixDialogNode extends Node {
  readonly nodeName = 'RadixDialog'
  readonly componentName = 'Dialog.Root'

  public readonly defaultProps: RadixDialogNodeProps = {}

  get isDroppable() {
    return false
  }

  readonly $props = map(this.defaultProps)

  slotsInfo = {
    content: {
      required: true,
      key: 'content',
      label: 'content',
    },

    title: {
      required: false,
      key: 'title',
      label: 'title',
    },

    description: {
      required: false,
      key: 'description',
      label: 'description',
    },

    contentBody: {
      required: true,
      key: 'contentBody',
      label: 'contentBody',
    },
  }

  slotsInfoArray = [
    {
      required: true,
      key: 'content',
      label: 'content',
    },

    {
      required: false,
      key: 'title',
      label: 'title',
    },

    {
      required: false,
      key: 'description',
      label: 'description',
    },

    {
      required: true,
      key: 'contentBody',
      label: 'contentBody',
    },
  ]

  readonly $slots = atom<{
    content: FragmentNode
    title: FragmentNode | null
    description: FragmentNode | null
    contentBody: FragmentNode
  }>({
    content: new FragmentNode(),
    title: null,
    description: null,
    contentBody: new FragmentNode(),
  })

  public readonly contentDefaultProps: RadixDialogSlotContentProps = {}

  readonly $contentProps = map(this.contentDefaultProps)

  constructor() {
    super({
      isUnselectable: true,
    })

    // Enable required slot inside constructor instead of property initializer
    // because enableSlot() sets parent of the slot
    this.enableSlot('content')

    this.enableSlot('contentBody')
  }
}

export function RadixDialogNodeComponent({ node }: { node: RadixDialogNode }) {
  const props = useStore(node.$props)
  const slots = useStore(node.$slots)
  const contentProps = useStore(node.$contentProps)

  return (
    <Dialog.Root {...props}>
      {slots.content && (
        <Dialog.Content {...contentProps}>
          {slots.title && (
            <Dialog.Title>
              <NodeComponent node={slots.title} />
            </Dialog.Title>
          )}
          {slots.description && (
            <Dialog.Description>
              <NodeComponent node={slots.description} />
            </Dialog.Description>
          )}
          {slots.contentBody && <NodeComponent node={slots.contentBody} />}
        </Dialog.Content>
      )}
    </Dialog.Root>
  )
}

export function RadixDialogNodeControls({
  nodes,
}: {
  nodes: RadixDialogNode[]
}) {
  return (
    <>
      <Card size="1">
        <Flex direction="column" gap="3">
          <SlotToggleControls slotKey="title" nodes={nodes} />
          <SlotToggleControls slotKey="description" nodes={nodes} />
        </Flex>
      </Card>

      <SwitchControls
        controlsLabel="open"
        nodes={nodes}
        propsAtomKey="$props"
        propertyKey="open"
        defaultValue={undefined}
      />

      <SelectControls
        controlsLabel="size"
        nodes={nodes}
        propsAtomKey="$contentProps"
        propertyKey="size"
        defaultValue="3"
        options={[
          { label: 'default', value: undefined },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ]}
      />
    </>
  )
}
