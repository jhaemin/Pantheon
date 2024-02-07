import { Node } from '@/node-class/node'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { Switch } from '@radix-ui/themes'

export type SwitchNodeProps = {
  size?: '1' | '2' | '3'
  variant?: 'classic' | 'surface' | 'soft'
  highContrast?: boolean
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
}

class SwitchNode extends Node {
  readonly nodeName = 'Switch' satisfies NodeName

  defaultProps = {
    size: '2',
    variant: 'surface',
  }
}

export function SwitchNodeComponent({ node }: { node: SwitchNode }) {
  const props = useStore(node.$props)

  return <Switch {...props} />
}
