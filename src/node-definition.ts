export class CustomClass {
  constructor(public type: string) {}
}

export function Custom(type: string) {
  return new CustomClass(type)
}

export type Slot = {
  key: string
  required?: boolean
  componentName?: string
  props?: NodeDefinition['props']
  slots?: Slot[]
}

export type Prop = {
  key: string
  label?: string
  type: 'string' | 'number' | 'boolean' | 'ReactNode' | string[] | CustomClass
  required?: boolean
  default?: any | CustomClass
}

/**
 * TODO: ReactNode as a prop is not supported yet.
 */
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
  invisible?: boolean
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
