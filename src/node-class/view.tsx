import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'

export class ViewNode extends Node {
  readonly nodeName = 'View' satisfies NodeName
}
