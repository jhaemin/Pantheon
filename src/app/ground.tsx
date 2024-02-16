import { commandAddPage } from '@/command'
import { keepNodeSelectionAttribute } from '@/data-attributes'
import { Ground } from '@/ground'
import { History } from '@/history'
import { useStore } from '@nanostores/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { Button, Flex, IconButton, Tooltip } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import {
  $interactionMode,
  $isAnimatingGround,
  $selectionRerenderFlag,
} from '../atoms'
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
  const interactionMode = useStore($interactionMode)

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
      else if (!e.altKey) {
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
        position: 'fixed',
        top: 'var(--space-8)',
        left: 300,
        right: 300,
        bottom: 0,
        transition: 'background-color 300ms ease',
        backgroundColor: interactionMode ? 'var(--gray-10)' : 'var(--gray-4)',
        overflow: 'hidden',
      }}
    >
      <EaselContainer />

      <SelectionGuide />
      <HoverGuide />

      <Actions />
      <UndoRedo />
      <ScaleBadge />
    </div>
  )
}

function ScaleBadge() {
  const scale = useStore(Ground.$scale)

  return (
    <Flex
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 100,
        cursor: scale !== 1 ? 'pointer' : undefined,
      }}
      gap="5"
      onClick={() => {
        Ground.setScale(1, 'center', true)

        setTimeout(() => {
          $selectionRerenderFlag.set(!$selectionRerenderFlag.get())
        }, 0)
      }}
    >
      <div {...keepNodeSelectionAttribute}>
        {scale === 1 ? (
          <Button variant="soft" color="gray">
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
        ) : (
          <Tooltip content="Press to Reset">
            <Button variant="soft" color="blue">
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
          </Tooltip>
        )}
      </div>
    </Flex>
  )
}

function Actions() {
  return (
    <Flex
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
      }}
    >
      <Flex {...keepNodeSelectionAttribute} gap="2">
        <Button onClick={commandAddPage} variant="soft" color="gray">
          <PlusIcon />
          Page
        </Button>
        <Button onClick={commandAddPage} variant="soft" color="gray">
          <PlusIcon />
          View
        </Button>
      </Flex>
    </Flex>
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
