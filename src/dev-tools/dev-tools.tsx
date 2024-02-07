import {
  $allRenderedNodes,
  $devToolsRerenderFlag,
  $showDevTools,
} from '@/atoms'
import { Node } from '@/node-class/node'
import { studioApp } from '@/studio-app'
import { useStore } from '@nanostores/react'
import styles from './dev-tools.module.scss'

export function DevTools() {
  const pages = useStore(studioApp.$pages)
  useStore($devToolsRerenderFlag)

  const allRenderedNodes = useStore($allRenderedNodes)

  const show = useStore($showDevTools)

  function toHumanReadable(node: Node, onlyChildIds: boolean): any {
    return {
      id: node.id,
      nodeName: node.nodeName,
      ownerPage: node.ownerPage?.id,
      parent: node.parent?.id,
      previousSibling: node.previousSibling?.id,
      nextSibling: node.nextSibling?.id,
      children: onlyChildIds
        ? node.children.map((child) => child.id)
        : node.children.map((child) => toHumanReadable(child, onlyChildIds)),
    }
  }

  return (
    <div className={styles.devTools}>
      <textarea
        className={styles.page}
        readOnly
        value={JSON.stringify(
          pages.map((page) => toHumanReadable(page, false)),
          null,
          2,
        )}
        style={{
          display: show ? 'block' : 'none',
        }}
      />
      <textarea
        className={styles.nodeAtoms}
        readOnly
        value={JSON.stringify(
          Object.keys(allRenderedNodes).map((nodeId) => ({
            ...toHumanReadable(allRenderedNodes[nodeId], true),
          })),
          null,
          2,
        )}
        style={{
          display: show ? 'block' : 'none',
        }}
      />
      <button
        className={styles.toggle}
        onClick={() => {
          $showDevTools.set(!show)
        }}
      >
        Toggle Dev Tools (cmd + v)
      </button>
    </div>
  )
}
