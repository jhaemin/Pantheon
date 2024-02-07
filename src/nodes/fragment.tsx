import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { EmptyPlaceholder } from '../empty-placeholder'
import { renderChildren } from '../node-component'

export class FragmentNode extends Node {
  readonly nodeName = 'Fragment' satisfies NodeName

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
