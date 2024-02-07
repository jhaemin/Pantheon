import { PageNode } from './node-class/page'
import { ViewNode } from './node-class/view'
import { NodeName } from './node-name'
import { BadgeNode } from './nodes/badge'
import { ButtonNode } from './nodes/button'
import { ContainerNode } from './nodes/container'
import { FlexNode } from './nodes/flex'
import { FragmentNode } from './nodes/fragment'
import { SwitchNode } from './nodes/switch'
import { TextNode } from './nodes/text'

export const nodeNameNodeMap = {
  Badge: BadgeNode,
  Button: ButtonNode,
  Container: ContainerNode,
  Flex: FlexNode,
  Fragment: FragmentNode,
  Page: PageNode,
  Switch: SwitchNode,
  Text: TextNode,
  View: ViewNode,
} satisfies Record<NodeName, any>

export type InferNodeByName<N extends NodeName> =
  N extends keyof typeof nodeNameNodeMap
    ? InstanceType<(typeof nodeNameNodeMap)[N]>
    : never
