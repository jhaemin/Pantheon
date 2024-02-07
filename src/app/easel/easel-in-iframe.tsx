import { DESIGN_MODE_EDGE_SPACE } from '@/constants'
import { NodeComponent } from '@/node-component'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

export function EaselInIframe() {
  const designMode = useStore(window.shared.$designMode)

  useEffect(() => {
    if (designMode) {
      document.body.style.padding = DESIGN_MODE_EDGE_SPACE + 'px'
    } else {
      document.body.style.removeProperty('padding')
    }
  }, [designMode])

  if (!window.pageNode) {
    return <div>Page did not injected</div>
  }

  return <NodeComponent node={window.pageNode} />
}
