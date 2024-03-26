export type Library = {
  name: string
  version: string
}

export const stringifyLibraryKey = (library: Library) =>
  `${library.name}-${library.version}`
