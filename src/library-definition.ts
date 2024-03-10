import { NodeDefinition } from './node-definition'

export type LibraryDefinition = {
  from: string
  nodeDefinitions: NodeDefinition[]
}
