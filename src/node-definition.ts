export class CustomClass {
  constructor(public type: string) {}
}

export function Custom(type: string) {
  return new CustomClass(type)
}

export type Slot<Key extends string = string> = {
  key: Key
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
   * `import { mod } from 'lib'`
   */
  mod: string
  /**
   * Unique identifier for the node.
   *
   * Reserved node names are not allowed.
   */
  nodeName: string
  /**
   * Display name for the node.
   */
  displayName?: string
  /**
   * Used for JSX tag name.
   * If not provided, `lib.mod` will be used.
   *
   * @example lib.mod = 'Dialog', componentName = 'Dialog.Root'
   */
  componentName?: string
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
