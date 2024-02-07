import { Node } from '@/node-class/node'
import { renderChildren } from '@/node-component'
import { NodeName } from '@/node-name'
import { TextNode } from '@/nodes/text'
import { useStore } from '@nanostores/react'
import { Switch } from '@radix-ui/themes'
import { map } from 'nanostores'
import { ComponentProps } from 'react'

export type SwitchProps = ComponentProps<typeof Switch>

export class SwitchNode extends Node {
  readonly nodeName = 'Switch' satisfies NodeName

  $props = map<SwitchProps>({})

  constructor() {
    super()
    this.append(new TextNode('Switch'))
  }
}

export function SwitchNodeComponent({ node }: { node: SwitchNode }) {
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return <Switch {...props}>{renderChildren(children)}</Switch>
}
