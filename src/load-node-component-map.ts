/**
 * Load components library dynamically.
 * TODO: try catch
 */
export async function loadNodeComponentMap(library: string) {
  const { nodeComponentMap } = await import(`@/__generated__/${library}`)

  return nodeComponentMap
}
