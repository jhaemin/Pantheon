import { Node } from '@/node-class/node'
import { map } from 'nanostores'

export class ViewNode extends Node {
  readonly nodeName = 'View'

  $additionalProps = map<{
    label: string
  }>({
    label: 'View',
  })
}
