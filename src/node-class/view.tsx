import { map } from 'nanostores'
import { Node } from './node'

export class ViewNode extends Node {
  readonly nodeName = 'View'

  $additionalProps = map<{
    label: string
  }>({
    label: 'View',
  })
}
