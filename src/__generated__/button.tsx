import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'

import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Button } from '@radix-ui/themes'

export type ButtonNodeProps = {
  asChild?: boolean
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
  color?:
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'brown'
    | 'orange'
    | 'sky'
    | 'mint'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'gold'
    | 'bronze'
    | 'gray'
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export class ButtonNode extends Node {
  readonly nodeName = 'Button' satisfies NodeName

  defaultProps = {
    size: '2',
    variant: 'solid',
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
