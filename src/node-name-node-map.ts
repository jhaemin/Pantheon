import { generatedNodeNameNodeMap } from './__generated__/generated-node-name-node-map'
import { FragmentNode } from './node-class/node'
import { PageNode } from './node-class/page'
import { TextNode } from './node-class/text'
import { ViewNode } from './node-class/view'
import { type NodeName } from './node-name'

export const nodeNameNodeMap = {
  ...generatedNodeNameNodeMap,
  Fragment: FragmentNode,
  Page: PageNode,
  Text: TextNode,
  View: ViewNode,
} satisfies Record<NodeName, any>
