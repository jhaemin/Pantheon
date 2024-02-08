import { generatedNodeNameNodeMap } from './__generated__/generated-node-name-node-map'
import { PageNode } from './node-class/page'
import { ViewNode } from './node-class/view'
import { NodeName } from './node-name'
import { FragmentNode } from './nodes/fragment'
import { TextNode } from './nodes/text'

export const nodeNameNodeMap = {
  ...generatedNodeNameNodeMap,
  Fragment: FragmentNode,
  Page: PageNode,
  Text: TextNode,
  View: ViewNode,
} satisfies Record<NodeName, any>

export type InferNodeByName<N extends NodeName> =
  N extends keyof typeof nodeNameNodeMap
    ? InstanceType<(typeof nodeNameNodeMap)[N]>
    : never
