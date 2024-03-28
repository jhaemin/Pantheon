import { Node, NodeName, type SerializedNode } from './node'
import { PageNode } from './page'

const nodeClassMap: Record<NodeName, typeof Node> = {
  Page: PageNode,
  Text: Node,
}

export namespace NodeUtil {
  export function deserialize(serialized: SerializedNode, clone = false): Node {
    const NodeClass = nodeClassMap[serialized.nodeName] ?? Node

    return new NodeClass({
      id: clone ? undefined : serialized.id,
      library: serialized.library,
      nodeName: serialized.nodeName,
      props: serialized.props,
      style: serialized.style,
      children: serialized.children?.map((child) => deserialize(child, clone)),
    })
  }
}
