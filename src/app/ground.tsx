import { keepNodeSelectionAttribute } from '@/data-attributes'
import { EditorState } from '@/editor-state'
import { Ground } from '@/ground'
import { History } from '@/history'
import { useStore } from '@nanostores/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CubeIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import { Button, Flex, IconButton, Tooltip } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { $interactiveMode, $isAnimatingGround } from '../atoms'
import { EaselContainer } from '../easel/easel-container'

const SelectionGuide = dynamic(
  () => import('@/ui-guides/selection-guide').then((mod) => mod.SelectionGuide),
  { ssr: false },
)

const HoverGuide = dynamic(
  () => import('@/ui-guides/hover-guide').then((mod) => mod.HoverGuide),
  { ssr: false },
)

export const GROUND_ID = 'studio-ground'

const SCALE_FACTOR = 0.004

export function GroundComponent() {
  const ref = useRef<HTMLDivElement>(null!)
  const interactiveMode = useStore($interactiveMode)

  useEffect(() => {
    const groundElm = document.getElementById(GROUND_ID)!

    // Attach wheel event from useEffect since it's not possible to preventDefault on React wheel event
    function onWheel(e: WheelEvent) {
      e.preventDefault()

      if ($isAnimatingGround.get()) return

      // Zoom in/out
      if (e.metaKey || e.ctrlKey) {
        Ground.setScale(Ground.scale + e.deltaY * -SCALE_FACTOR, {
          x: e.clientX,
          y: e.clientY,
        })
      }
      // Scroll
      else {
        const { deltaX, deltaY } = e

        const { x: translateX, y: translateY } = Ground.translate

        Ground.setTranslate(translateX - deltaX, translateY - deltaY)
      }
    }

    groundElm.addEventListener('wheel', onWheel)

    return () => {
      groundElm.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div
      id={GROUND_ID}
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 280,
        bottom: 0,
        transition: 'background-color 300ms ease',
        backgroundColor: interactiveMode ? 'var(--gray-10)' : 'var(--gray-4)',
        overflow: 'hidden',
      }}
    >
      <EaselContainer />

      <SelectionGuide />
      <HoverGuide />

      <ScaleBadge />
      <OpenDrawerButton />
    </div>
  )
}

function ScaleBadge() {
  const scale = useStore(Ground.$scale)

  return (
    <Flex
      style={{
        position: 'absolute',
        top: 'var(--space-3)',
        left: 'var(--space-3)',
        zIndex: 100,
        cursor: scale !== 1 ? 'pointer' : undefined,
      }}
      gap="5"
    >
      <div {...keepNodeSelectionAttribute}>
        <Button
          variant="soft"
          color="gray"
          size="2"
          style={{
            backgroundColor: 'var(--gray-3)',
          }}
          onClick={() => {
            Ground.setScale(1, 'center', true)
          }}
        >
          <MagnifyingGlassIcon />
          <span
            style={{
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {/* 1.2345678 -> 1.23 */}
            {scale.toFixed(2)}
          </span>
        </Button>
      </div>
    </Flex>
  )
}

function OpenDrawerButton() {
  return (
    <Tooltip content="Open drawer">
      <IconButton
        {...keepNodeSelectionAttribute}
        style={{
          position: 'absolute',
          top: 'var(--space-3)',
          right: 'var(--space-3)',
        }}
        onClick={() => {
          EditorState.$drawerOpen.set(true)
        }}
      >
        <CubeIcon />
      </IconButton>
    </Tooltip>
  )
}

function UndoRedo() {
  const historyPointer = useStore(History.$historyPointer)
  const historyStack = useStore(History.$historyStack)

  const canUndo = historyPointer >= 0
  const canRedo = historyPointer < historyStack.length - 1

  return (
    <Flex
      {...keepNodeSelectionAttribute}
      gap="2"
      style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
    >
      <IconButton
        radius="full"
        disabled={!canUndo}
        onClick={() => {
          History.undo()
        }}
      >
        <ArrowLeftIcon />
      </IconButton>

      <IconButton
        radius="full"
        disabled={!canRedo}
        onClick={() => {
          History.redo()
        }}
      >
        <ArrowRightIcon />
      </IconButton>
    </Flex>
  )
}
