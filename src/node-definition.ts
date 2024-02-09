export type NodeDefinition = {
  nodeName: string
  lib: {
    mod: string
    from: string
  }
  /**
   * Used for JSX tag name.
   * If not provided, `lib.mod` will be used.
   *
   * @example lib.mod = 'Dialog', componentName = 'Dialog.Root'
   */
  componentName?: string
  leaf?: boolean
  portal?: boolean
  arbitraryChildren?: boolean
  props?: Array<{
    key: string
    type: 'string' | 'number' | 'boolean' | string[]
    required?: boolean
    default?: any
  }>
  // additionalData?:
  slots?: Array<{
    key: string
    componentName: string
    required?: boolean
    slots?: NodeDefinition['slots']
  }>
}
