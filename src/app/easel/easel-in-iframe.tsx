'use client'

import { DESIGN_MODE_EDGE_SPACE } from '@/constants'
import { loadNodeComponentMap } from '@/load-node-component-map'
import { NodeComponent } from '@/node-component'
import { nativeNodeComponentMap, nodeComponentMap } from '@/node-map'
import { NodeName } from '@/node-name'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import { PageLoading } from './page-loading'

export function EaselInIframe() {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false)

  const library = useStore(window.pageNode.ownerApp?.$library)

  /**
   * When library is changed, load node component dynamically.
   */
  useEffect(() => {
    setIsLibraryLoaded(false)

    // Load node component dynamically
    loadNodeComponentMap(library).then((dynamicNodeComponentMap) => {
      // Clear the nodeComponentMap
      Object.keys(nodeComponentMap).forEach((nodeName) => {
        delete nodeComponentMap[nodeName as NodeName]
      })

      // Re-assign the nodeComponentMap
      Object.assign(nodeComponentMap, nativeNodeComponentMap)
      Object.assign(nodeComponentMap, dynamicNodeComponentMap)

      // Re-render doesn't work without setTimeout.
      // Component itself is remounted but elements inside the component are not updated.
      setTimeout(() => {
        setIsLibraryLoaded(true)
      }, 0)
    })
  }, [library])

  // TODO: Deprecate design mode ?
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

  if (!isLibraryLoaded) {
    return <PageLoading />
  }

  return <NodeComponent node={window.pageNode} />
}
