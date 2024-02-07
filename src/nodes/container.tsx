import { DESIGN_MODE_EDGE_SPACE } from '@/constants'
import { Node } from '@/node-class/node'
import { renderChildren } from '@/node-component'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Container } from '@radix-ui/themes'
import { map } from 'nanostores'
import { ComponentProps } from 'react'

export type ContainerProps = ComponentProps<typeof Container>

export class ContainerNode extends Node {
  readonly nodeName = 'Container' satisfies NodeName

  $props = map<ContainerProps>({})
}

export function ContainerNodeComponent({ node }: { node: ContainerNode }) {
  const designMode = useStore(window.shared.$designMode)

  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Container
      {...props}
      style={{
        ...props.style,
        padding: designMode ? DESIGN_MODE_EDGE_SPACE : undefined,
        backgroundColor: designMode ? 'rgba(0, 0, 0, 0.05)' : undefined,
      }}
    >
      {children.length === 0 ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            minHeight: 60,
            minWidth: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          Container
        </div>
      ) : (
        renderChildren(children)
      )}
    </Container>
  )
}
