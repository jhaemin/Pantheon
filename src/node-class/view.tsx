import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { map } from 'nanostores'

export class ViewNode extends Node {
  readonly nodeName = 'View' satisfies NodeName

  $additionalProps = map<{
    label: string
  }>({
    label: 'View',
  })
}
