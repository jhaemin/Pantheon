import { RadixButtonNode } from '@/__generated__/radix-button'
import { NodeComponent } from '@/node-component'
import { useStore } from '@nanostores/react'
import { Button, Dialog } from '@radix-ui/themes'
import { map } from 'nanostores'
import { FragmentNode } from './fragment'
import { Node } from './node'

export class RadixDialogNode extends Node {
  readonly nodeName = 'RadixDialog'

  readonly $slots = map({
    trigger: null,
    content: null,
  })

  constructor() {
    super()

    this.setSlot('trigger', new RadixDialogTriggerNode())
    this.setSlot('content', new RadixDialogContentNode())
  }
}

export class RadixDialogTriggerNode extends FragmentNode {
  readonly nodeName = 'Fragment'
}

export class RadixDialogContentNode extends Node {
  readonly nodeName = 'RadixDialogContent'

  readonly $slots = map({
    title: null,
    description: null,
    contentBody: null,
  })

  constructor() {
    super()

    this.setSlot('title', new RadixDialogTitleNode())
    this.setSlot('description', new RadixDialogDescriptionNode())
    this.setSlot('contentBody', new RadixButtonNode())
  }
}

export class RadixDialogTitleNode extends FragmentNode {
  readonly nodeName = 'Fragment'
}

export class RadixDialogDescriptionNode extends FragmentNode {
  readonly nodeName = 'Fragment'
}

export function RadixDialogNodeComponent({ node }: { node: RadixDialogNode }) {
  const props = useStore(node.$props)
  const slots = useStore(node.$slots)

  return (
    <Dialog.Root {...props}>
      {slots.trigger && (
        <Dialog.Trigger>
          {/* <FragmentNodeComponent node={slots.trigger} /> */}
          <Button>Open Modal</Button>
        </Dialog.Trigger>
      )}

      {slots.content && (
        <Dialog.Content>
          <RadixDialogContentNodeComponent node={slots.content} />
        </Dialog.Content>
      )}
    </Dialog.Root>
  )
}

export function RadixDialogContentNodeComponent({
  node,
}: {
  node: RadixDialogContentNode
}) {
  const props = useStore(node.$props)
  const slots = useStore(node.$slots)

  return (
    <>
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
    </>
  )
}
