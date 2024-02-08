import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'

import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Container } from '@radix-ui/themes'

export type ContainerNodeProps = {
  size?: '1' | '2' | '3' | '4'
  display?: 'none' | 'block'
}

export class ContainerNode extends Node {
  readonly nodeName = 'Container' satisfies NodeName

  defaultProps = {
    size: '4',
  }
}

export function ContainerNodeComponent({ node }: { node: ContainerNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Container {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Container" />
      )}
    </Container>
  )
}

export function ContainerNodeControls({ nodes }: { nodes: ContainerNode[] }) {
  return <></>
}
