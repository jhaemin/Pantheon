import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'

import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Dialog } from '@radix-ui/themes'
import { SelectControls } from '@/control-center/controls-template'

export type RadixDialogNodeProps = {
  size?: '1' | '2' | '3' | '4'
}

export class RadixDialogNode extends Node {
  readonly nodeName = 'RadixDialog' satisfies NodeName

  defaultProps: RadixDialogNodeProps = {
    size: '3',
  }
}

export function RadixDialogNodeComponent({ node }: { node: RadixDialogNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Dialog.Root {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="RadixDialog" />
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
        ]}
      />
    </>
  )
}
