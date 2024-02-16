'use client'

import { GroundComponent } from '@/app/ground'
import { GlobalHeader } from '@/app/header/global-header'
import { ControlCenter } from '@/control-center/control-center'
import { DevTools } from '@/dev-tools/dev-tools'
import { Drawer } from '@/drawer/drawer'
import { useGlobalEvents } from '@/hooks/use-global-events'
import { ShortcutsDialog } from '@/shortcuts-dialog'
import { Tree } from '@/tree/tree'
import { DropZoneGuide } from '@/ui-guides/drop-zone-guide'
import { Theme } from '@radix-ui/themes'
import 'highlight.js/styles/github.css'
import dynamic from 'next/dynamic'
import styles from './page.module.scss'

const ContextMenu = dynamic(
  () => import('@/context-menu/context-menu').then((mod) => mod.ContextMenu),
  { ssr: false },
)

export default function Home() {
  useGlobalEvents()

  return (
    <Theme scaling="90%">
      <main className={styles.main}>
        <GlobalHeader />

        <div className={styles.content}>
          <Drawer />
          <Tree />
          <GroundComponent />
          <ControlCenter />
        </div>

        <ShortcutsDialog />

        <ContextMenu />

        <DevTools />

        <DropZoneGuide />
      </main>
    </Theme>
  )
}
