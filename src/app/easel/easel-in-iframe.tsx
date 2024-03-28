'use client'

import { DESIGN_MODE_EDGE_SPACE } from '@/constants'
import { ErrorBoundary } from '@/error-boundary'
import { stringifyLibraryKey } from '@/library'
import { useStore } from '@nanostores/react'
import { map } from 'nanostores'
import { useEffect, useState } from 'react'
import { NodeComponent } from './node-component'
import { PageLoading } from './page-loading'

/**
 * Record<string, FC> or Record<string, Record<string, FC>>
 */
export const $dynamicComponents = map<Record<string, Record<string, any>>>({})

export function EaselInIframe() {
  const libraries = useStore(window.ownerApp.$libraries)
  const [isLibrariesLoaded, setIsLibrariesLoaded] = useState(false)

  useEffect(() => {
    const unsubscribe = window.shared.$designMode.subscribe((designMode) => {
      if (designMode) {
        document.body.style.padding = DESIGN_MODE_EDGE_SPACE + 'px'
      } else {
        document.body.style.removeProperty('padding')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // TODO: dynamically load libraries from outside and share between pages
  // Maybe there will be a warning about different React instances
  useEffect(() => {
    if (
      libraries.every(
        ({ name, version }) =>
          $dynamicComponents.get()[`${name}-${version}`] !== undefined,
      )
    ) {
      setIsLibrariesLoaded(true)
      return
    }

    Promise.all(
      libraries.map(async (library) => {
        const libraryKey = stringifyLibraryKey(library)

        const result = await import(`@/libraries/${libraryKey}/components`)

        $dynamicComponents.setKey(libraryKey, result.components)

        setIsLibrariesLoaded(true)
      }),
    )
  }, [libraries])

  if (!isLibrariesLoaded) {
    return <PageLoading />
  }

  return (
    <ErrorBoundary>
      <NodeComponent node={window.pageNode} />
    </ErrorBoundary>
  )
}
