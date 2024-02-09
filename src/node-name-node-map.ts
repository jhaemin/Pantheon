import { generatedNodeNameNodeMap } from './__generated__/generated-node-name-node-map'
import { RadixDialogContentNode, RadixDialogNode } from './node-class/dialog'
import { FragmentNode } from './node-class/fragment'
import { PageNode } from './node-class/page'
import { TextNode } from './node-class/text'
import { ViewNode } from './node-class/view'
import { NodeName } from './node-name'

export const nodeNameNodeMap = {
  ...generatedNodeNameNodeMap,
  Fragment: FragmentNode,
  Page: PageNode,
  Text: TextNode,
  View: ViewNode,
  RadixDialog: RadixDialogNode,
  RadixDialogContent: RadixDialogContentNode,
} satisfies Record<NodeName, any>

export type InferNodeByName<N extends NodeName> =
  N extends keyof typeof nodeNameNodeMap
    ? InstanceType<(typeof nodeNameNodeMap)[N]>
    : never
