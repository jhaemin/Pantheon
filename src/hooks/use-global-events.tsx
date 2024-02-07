import {
  $designMode,
  $interactionMode,
  $isContextMenuOpen,
  $selectedNodes,
  $selectionRerenderFlag,
  $showDevTools,
  $textNodeEditing,
} from '@/atoms'
import { commandAddPage, commandDeleteNodes } from '@/command'
import { dataAttributes } from '@/constants'
import { Ground } from '@/ground'
import { History } from '@/history'
import { $shortcutsDialogOpen } from '@/shortcuts-dialog'
import { studioApp } from '@/studio-app'
import { useEffect } from 'react'

export function useGlobalEvents() {
  useEffect(() => {
    /**
     * TODO: configuration-based keybindings like VSCode
     */
    function onKeyDown(e: KeyboardEvent) {
      const activeElementTagName = document.activeElement?.tagName

      // Leave text input experience
      if (
        activeElementTagName === 'INPUT' ||
        activeElementTagName === 'TEXTAREA'
      ) {
        return
      }

      if (e.key === 'Escape') {
        if ($isContextMenuOpen.get()) {
          $isContextMenuOpen.set(false)
        } else {
          $selectedNodes.set([])
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        const selectedNodes = $selectedNodes.get()

        if (selectedNodes.length > 0) {
          commandDeleteNodes(selectedNodes)
        }
      } else if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if ($selectedNodes.get().length === 0) {
          $selectedNodes.set(studioApp.pages)
        }
      } else if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        $shortcutsDialogOpen.set(!$shortcutsDialogOpen.get())
      } else if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        $designMode.set(!$designMode.get())
      } else if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        $interactionMode.set(!$interactionMode.get())
      } else if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        $textNodeEditing.set(!$textNodeEditing.get())
      } else if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        $showDevTools.set(!$showDevTools.get())
      } else if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        window.location.reload()
      } else if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        commandAddPage()
      } else if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()

        if (e.shiftKey) {
          History.redo()
        } else {
          History.undo()
        }
      } else if (e.key === '=' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        Ground.zoomIn(0.2)
      } else if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        Ground.zoomOut(0.2)
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (document.activeElement?.tagName === 'IFRAME') {
        console.log('blur')
        ;(document.activeElement as HTMLElement).blur()
      }

      if (
        e.target instanceof Element &&
        !e.target.closest(`[${dataAttributes.keepNodeSelection}]`)
      ) {
        $selectedNodes.set([])
      }
    }

    function onContextMenu(e: MouseEvent) {
      e.preventDefault()
    }

    function onResize() {
      $selectionRerenderFlag.set(!$selectionRerenderFlag.get())
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}
