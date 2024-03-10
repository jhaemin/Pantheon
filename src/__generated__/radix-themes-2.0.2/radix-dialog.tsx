import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card as RadixCard, Flex as RadixFlex } from '@radix-ui/themes'
import {
  SelectControls,
  SwitchControls,
  SlotToggleControls,
  TextFieldControls,
} from '@/control-center/controls-template'
import { NodeComponent } from '@/node-component'
import { Prop } from '@/node-definition'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { Dialog } from '@radix-ui/themes-2.0.2'

export type RadixDialogNodeProps = {
  open?: boolean
}

export type RadixDialogNodeSlotKey =
  | 'content'
  | 'title'
  | 'description'
  | 'contentBody'

export type RadixDialogNodeSlotContentProps = {
  size?: '1' | '2' | '3' | '4'
}

export class RadixDialogNode extends Node<RadixDialogNodeSlotKey> {
  readonly nodeName = 'RadixDialog'
  readonly componentName = 'Dialog.Root'

  public readonly defaultProps: RadixDialogNodeProps = {}

  get isDroppable() {
    return false
  }

  propsDefinition: Prop[] = [{ key: 'open', type: 'boolean' }]

  readonly $props = map(this.defaultProps)
  readonly slotProps = {
    $content: map<RadixDialogNodeSlotContentProps>({
      size: '3',
    }),
  }

  slotsInfoArray = [
    {
      required: true,
      key: 'content' as RadixDialogNodeSlotKey,
      label: 'content',
      componentName: 'Dialog.Content',
      props: [{ key: 'size', type: ['1', '2', '3', '4'], default: '3' }],
    },
    {
      required: false,
      key: 'title' as RadixDialogNodeSlotKey,
      label: 'title',
      componentName: 'Dialog.Title',
    },
    {
      required: false,
      key: 'description' as RadixDialogNodeSlotKey,
      label: 'description',
      componentName: 'Dialog.Description',
    },
    {
      required: true,
      key: 'contentBody' as RadixDialogNodeSlotKey,
      label: 'contentBody',
    },
  ]

  slotsDefinition = [
    {
      key: 'content',
      required: true,
      componentName: 'Dialog.Content',
      props: [{ key: 'size', type: ['1', '2', '3', '4'], default: '3' }],
      slots: [
        { key: 'title', componentName: 'Dialog.Title' },
        { key: 'description', componentName: 'Dialog.Description' },
        { key: 'contentBody', required: true },
      ],
    },
  ]

  public readonly contentDefaultProps: RadixDialogNodeSlotContentProps = {
    size: '3',
  }

  readonly $contentProps = map(this.contentDefaultProps)

  constructor() {
    super({
      isUnselectable: true,
    })

    this.enableSlot('content')

    this.enableSlot('contentBody')
  }
}

export function RadixDialogNodeComponent({ node }: { node: RadixDialogNode }) {
  const nodeProps = makeNodeProps(node)

  const props = useStore(node.$props)
  const slots = useStore(node.$slots)
  const contentProps = useStore(node.slotProps.$content)

  return (
    <Dialog.Root {...props} {...nodeProps}>
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
