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
import { Dialog } from '@radix-ui/themes'

export type RadixDialogNodeProps = {
  open?: boolean
}

export type RadixDialogSlotContentProps = {
  size?: '1' | '2' | '3' | '4'
}

export class RadixDialogNode extends Node {
  readonly nodeName = 'RadixDialog'

  public readonly defaultProps: RadixDialogNodeProps = {}

  get isDroppable() {
    return false
  }

  readonly $props = map(this.defaultProps)

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
    super()

    this.setSlot(
      'content',
      new FragmentNode({
        isRemovable: false,
        isDraggable: false,
      }),
    )

    this.setSlot(
      'contentBody',
      new FragmentNode({
        isRemovable: false,
        isDraggable: false,
      }),
    )
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

      <SwitchControls controlsLabel="open" nodes={nodes} propertyKey="open" />
    </>
  )
}
