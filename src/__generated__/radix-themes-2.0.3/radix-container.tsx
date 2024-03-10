import { renderChildren } from '@/node-component'
import { EmptyPlaceholder } from '@/empty-placeholder'
import { Node, FragmentNode } from '@/node-class/node'
import { useStore } from '@nanostores/react'
import { atom, map } from 'nanostores'
import { Card as RadixCard, Flex as RadixFlex } from '@radix-ui/themes'
import {
  SelectControls,
  SwitchControls,
  SlotToggleControls,
  TextFieldControls,
} from '@/control-center/controls-template'
import { NodeComponent } from '@/node-component'
import { Prop } from '@/node-definition'
import { makeNodeProps } from '@/data-attributes'
import { type ReactNode } from 'react'
import { Container } from '@radix-ui/themes-2.0.3'

export type RadixContainerNodeProps = {
  size?: '1' | '2' | '3' | '4'
  display?: 'none' | 'block'
}

export class RadixContainerNode extends Node {
  readonly nodeName = 'RadixContainer'
  readonly componentName = 'Container'

  public readonly defaultProps: RadixContainerNodeProps = {}

  propsDefinition: Prop[] = [
    { key: 'size', type: ['1', '2', '3', '4'], default: '4' },
    { key: 'display', type: ['none', 'block'] },
  ]

  readonly $props = map(this.defaultProps)
  readonly slotProps = {}

  slotsInfoArray = []

  constructor() {
    super({
      isUnselectable: false,
    })
  }
}

export function RadixContainerNodeComponent({
  node,
}: {
  node: RadixContainerNode
}) {
  const nodeProps = makeNodeProps(node)
  const children = useStore(node.$children)
  const props = useStore(node.$props)

  return (
    <Container {...props} {...nodeProps}>
      {children.length > 0 ? (
        renderChildren(children)
      ) : (
        <EmptyPlaceholder name="Container" />
      )}
    </Container>
  )
}
