import { useStore } from '@nanostores/react'
import { Callout } from '@radix-ui/themes'
import { EmptyPlaceholder } from '../empty-placeholder'
import { renderChildren } from '../node-component'
import { FragmentNode } from './node'

export function FragmentNodeComponent({ node }: { node: FragmentNode }) {
  const children = useStore(node.$children)
  const slotLabel = node.slotLabel
  const emptyPlaceholderName = slotLabel ? `Slot: ${slotLabel}` : 'Fragment'

  return children.length === 0 ? (
    <EmptyPlaceholder name={emptyPlaceholderName} />
  ) : (
    renderChildren(children)
  )
}

export function FragmentNodeControls() {
  return (
    <Callout.Root color="gray" size="1">
      <Callout.Text>
        Fragments are a way to group multiple children into a single parent
        without affecting the layout.
      </Callout.Text>
    </Callout.Root>
  )
}
