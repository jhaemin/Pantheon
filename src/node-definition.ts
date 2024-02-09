export type Slot = {
  key: string
  required?: boolean
  componentName?: string
  props?: NodeDefinition['props']
  slots?: Slot[]
}

export type Prop = {
  key: string
  type: 'string' | 'number' | 'boolean' | string[]
  required?: boolean
  default?: any
}

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
  fragment?: boolean
  leaf?: boolean
  portal?: boolean
  arbitraryChildren?: boolean
  props?: Prop[]
  // additionalData?:
  slots?: Array<{
    key: string
    required?: boolean
    componentName?: string
    props?: Prop[]
    slots?: Slot[]
  }>
}
