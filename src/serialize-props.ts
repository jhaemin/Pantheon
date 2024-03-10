/**
 * TODO: get required information and remove props that are falsy and not required
 */
export function serializeProps(props: Record<string, any>) {
  return Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
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
