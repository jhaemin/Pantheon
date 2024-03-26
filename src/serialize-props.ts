import { Prop } from './node-definition'

/**
 * TODO: get required information and remove props that are falsy and not required
 */
export function serializeProps(
  props: Record<string, any>,
  propsDefinition: Prop[],
) {
  return Object.entries(props)
    .map(([key, value]) => {
      const def = propsDefinition.find((def) => def.key === key)

      // If the prop is optional and the value is same as default, remove it.
      if (def && def.required !== true && def.default === value) {
        return ''
      }

      if (typeof value === 'string') {
        if (value === '' && def?.required !== true) {
          return ''
        }

        return `${key}="${value}"`
      }

      if (typeof value === 'boolean') {
        return `${key}={${value}}`
      }

      if (typeof value === 'number') {
        return `${key}={${value}}`
      }

      if (typeof value === 'object') {
        return `${key}={${JSON.stringify(value)}}`
      }

      return ''
    })
    .join(' ')
}
