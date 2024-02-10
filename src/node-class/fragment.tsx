import { useStore } from '@nanostores/react'
import { Callout } from '@radix-ui/themes'
import { EmptyPlaceholder } from '../empty-placeholder'
import { renderChildren } from '../node-component'
import { Node } from './node'

export class FragmentNode extends Node {
  readonly nodeName = 'Fragment'

  public generateCode(): string {
    if (this.children.length === 1) {
      return this.children[0].generateCode()
    }

    return `<>${this.children.map((child) => child.generateCode()).join('')}</>`
  }
}

export function FragmentNodeComponent({ node }: { node: FragmentNode }) {
  const children = useStore(node.$children)

  return children.length === 0 ? (
    <EmptyPlaceholder name="Fragment" />
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
