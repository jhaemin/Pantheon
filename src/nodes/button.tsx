import { Node } from '@/node-class/node'
import { renderChildren } from '@/node-component'
import { NodeName } from '@/node-name'
import { TextNode } from '@/nodes/text'
import { useStore } from '@nanostores/react'
import { Button } from '@radix-ui/themes'
import { map } from 'nanostores'
import { ComponentProps } from 'react'
import { EmptyPlaceholder } from '../empty-placeholder'

export type ButtonProps = ComponentProps<typeof Button>

export class ButtonNode extends Node {
  readonly nodeName = 'Button' satisfies NodeName

  defaultProps: ButtonProps = {}

  $props = map<ButtonProps>({})

  constructor() {
    super()
    this.append(new TextNode('Button'))
  }
}

export function ButtonNodeComponent({ node }: { node: ButtonNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Button {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Button" />
      )}
    </Button>
  )
}

export function ButtonNodeControls({ nodes }: { nodes: ButtonNode[] }) {
  return <></>
}
