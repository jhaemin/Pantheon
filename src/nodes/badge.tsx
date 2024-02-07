import { Node } from '@/node-class/node'
import { renderChildren } from '@/node-component'
import { NodeName } from '@/node-name'
import { TextNode } from '@/nodes/text'
import { useStore } from '@nanostores/react'
import { Badge } from '@radix-ui/themes'
import { map } from 'nanostores'
import { ComponentProps } from 'react'
import { EmptyPlaceholder } from '../empty-placeholder'

export type BadgeProps = ComponentProps<typeof Badge>

export class BadgeNode extends Node {
  readonly nodeName = 'Badge' satisfies NodeName

  $props = map<BadgeProps>({})

  constructor() {
    super()
    this.append(new TextNode('Badge'))
  }
}

export function BadgeNodeComponent({ node }: { node: BadgeNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Badge {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Badge" />
      )}
    </Badge>
  )
}
