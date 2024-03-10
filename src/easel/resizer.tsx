import { PageResizeAction } from '@/action'
import {
  $isResizingIframe,
  $selectedNodes,
  triggerRerenderGuides,
} from '@/atoms'
import { Ground } from '@/ground'
import { History } from '@/history'
import { PageNode } from '@/node-class/page'
import { useEffect, useRef } from 'react'
import styles from './easel-wrapper.module.scss'

const MIN_EASEL_WIDTH = 100
const MIN_EASEL_HEIGHT = 100

const MAX_EASEL_WIDTH = 2560

function scaleStyle(scale: number) {
  return `${1 / scale}`
}

function translateStyle(scale: number) {
  return `${-10 / scale}px ${-10 / scale}px`
}

export function Resizer({ page }: { page: PageNode }) {
  const ref = useRef<HTMLDivElement>(null!)
  const oldSize = useRef(page.$dimensions.get())

  useEffect(() => {
    const unsubscribe = Ground.$scale.subscribe((scale) => {
      ref.current.style.scale = scaleStyle(scale)
      ref.current.style.translate = translateStyle(scale)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={styles.resizer}
      style={{
        scale: scaleStyle(Ground.scale),
        translate: translateStyle(Ground.scale),
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()

        $isResizingIframe.set(true)

        const startX = e.clientX
        const startY = e.clientY

        const initialEaselSize = page.$dimensions.get()

        function onMouseMove(e: MouseEvent) {
          const deltaX = e.clientX - startX
          const deltaY = e.clientY - startY

          const scale = Ground.scale

          page.$dimensions.set({
            width: Math.min(
              Math.max(
                initialEaselSize.width + deltaX / scale,
                MIN_EASEL_WIDTH,
              ),
              MAX_EASEL_WIDTH,
            ),
            height: Math.max(
              initialEaselSize.height + deltaY / scale,
              MIN_EASEL_HEIGHT,
            ),
          })

          triggerRerenderGuides()
        }

        function onMouseUp() {
          $isResizingIframe.set(false)

          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseup', onMouseUp)

          History.push({
            actions: [
              new PageResizeAction({
                page,
                oldSize: oldSize.current,
                newSize: page.$dimensions.get(),
              }),
            ],
            previousSelectedNodes: $selectedNodes.get(),
            nextSelectedNodes: $selectedNodes.get(),
          })

          oldSize.current = page.$dimensions.get()
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }}
    >
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.5 0C23.567 0 22 1.567 22 3.5V14.6667C22 18.7168 18.7168 22 14.6667 22H3.5C1.567 22 0 23.567 0 25.5V25.5C0 27.433 1.567 29 3.5 29H14.5C22.5081 29 29 22.5081 29 14.5V3.5C29 1.567 27.433 0 25.5 0V0Z"
          fill="black"
        />
      </svg>
    </div>
  )
}
