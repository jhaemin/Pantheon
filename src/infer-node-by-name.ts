import { type NodeName } from './node-name'
import { nodeNameNodeMap } from './node-name-node-map'

export type InferNodeByName<N extends NodeName> =
  N extends keyof typeof nodeNameNodeMap
    ? InstanceType<(typeof nodeNameNodeMap)[N]>
    : never
