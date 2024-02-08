export type NodeDefinition = {
  nodeName: string
  importDefinition: {
    named: string
    from: string
  }
  leaf?: boolean
  arbitraryChildren?: boolean
  propsDefinition?: Array<{
    key: string
    type: 'string' | 'number' | 'boolean' | string[]
    required?: boolean
    default?: any
  }>
  slotsDefinition?: Array<{
    key: string
    slotNodeName: string
    required?: boolean
  }>
}
