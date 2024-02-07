export type NodeDefinition = {
  nodeName: string
  importDefinition: {
    named: string
    from: string
  }
  leaf?: boolean
  arbitraryChildren?: boolean
  propsDefinition?: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | string[]
      required: boolean
      default?: any
    }
  >
  slotsDefinition?: Record<
    string,
    {
      slotNodeName: string
      required: boolean
    }
  >
}
