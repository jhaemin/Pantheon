import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'

import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Flex } from '@radix-ui/themes'

export type FlexNodeProps = {
  asChild?: boolean
  display?: 'none' | 'inline-flex' | 'flex'
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
}

export class FlexNode extends Node {
  readonly nodeName = 'Flex' satisfies NodeName

  defaultProps = {
    display: 'flex',
    justify: 'start',
  }
}

export function FlexNodeComponent({ node }: { node: FlexNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Flex {...props}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Flex" />
      )}
    </Flex>
  )
}

export function FlexNodeControls({ nodes }: { nodes: FlexNode[] }) {
  return <></>
}
