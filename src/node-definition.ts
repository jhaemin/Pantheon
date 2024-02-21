export class CustomClass {
  constructor(public type: string) {}
}

export function Custom(type: string) {
  return new CustomClass(type)
}

export type Slot = {
  key: string
  label?: string
  required?: boolean
  componentName?: string
  props?: NodeDefinition['props']
  slots?: Slot[]
}

export type Prop = {
  key: string
  label?: string
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'ReactNode'
    | (
        | string
        | {
            value: string
            label: string
          }
      )[]
    | CustomClass
  required?: boolean
  default?: any | CustomClass
}

/**
 * TODO: ReactNode as a prop is not supported yet.
 */
export type NodeDefinition = {
  /**
   * Unique identifier for the node.
   */
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
  /**
   * Display name for the node.
   */
  displayName?: string
  fragment?: boolean
  unselectable?: boolean
  allowNested?: boolean
  /**
   * If true, it is not droppable which means it can't have children.
   */
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
