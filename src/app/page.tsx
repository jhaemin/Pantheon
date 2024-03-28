'use client'

import { GroundComponent } from '@/app/ground'
import { GlobalHeader } from '@/app/header/global-header'
import { ControlCenter } from '@/control-center/control-center'
import { Drawer } from '@/drawer/drawer'
import { useGlobalEvents } from '@/hooks/use-global-events'
import { ShortcutsDialog } from '@/shortcuts-dialog'
import { studioApp } from '@/studio-app'
import { Tree } from '@/tree/tree'
import { DropZoneGuide } from '@/ui-guides/drop-zone-guide'
import { useStore } from '@nanostores/react'
import { Theme } from '@radix-ui/themes'
import 'highlight.js/styles/github.css'
import { useEffect } from 'react'
import styles from './page.module.scss'

export default function Studio() {
  useGlobalEvents()
  const isReady = useStore(studioApp.$isReady)

  useEffect(() => {
    studioApp.initialize({
      appTitle: 'Studio App',
      libraries: [
        {
          name: 'studio',
          version: '1.0.0',
        },
        {
          name: 'radix-themes',
          version: '3.0.1',
        },
      ],
      studioVersion: '1.0.0',
    })
  }, [])

  if (!isReady) {
    return null
  }

  return (
    <Theme scaling="90%" accentColor="gray" grayColor="slate">
      <main className={styles.main}>
        <GlobalHeader />

        <div className={styles.content}>
          <Drawer
            library={{
              name: 'radix-themes',
              version: '3.0.1',
            }}
          />
          <GroundComponent />
          {/* <ControlCenter /> */}

          <div className={styles.rightPanel}>
            <ControlCenter />
            <Tree />
          </div>
        </div>

        <ShortcutsDialog />

        {/* <ContextMenu /> */}

        <DropZoneGuide />
      </main>
    </Theme>
  )
}
