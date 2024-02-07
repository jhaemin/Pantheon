/**
 * Zoom in/out with mouse wheel.
 *
 * Implementation reference:
 * https://stackoverflow.com/questions/44154041/zoom-to-cursor-without-canvas-in-javascript
 */

import { atom, computed } from 'nanostores'
import { GROUND_ID } from './app/ground'
import { $isAnimatingGround } from './atoms'
import { EASEL_CONTAINER_ID } from './easel/easel-container'
import { PageNode } from './node-class/page'
import { findEaselIframe } from './node-lib'

const MAX_SCALE = 3
const MIN_SCALE = 0.1

// const $scale = atom(1)
// const $translate = atom({ x: 0, y: 0 })

export class Ground {
  private static _$scale = atom(1)
  private static _$translate = atom({ x: 0, y: 0 })

  private static groundElm: HTMLElement | null = null

  static $scale = computed(Ground._$scale, (scale) => scale)
  static $translate = computed(Ground._$translate, (translate) => translate)

  static get element() {
    if (!this.groundElm) {
      this.groundElm = document.getElementById(GROUND_ID)!
    }
    return this.groundElm
  }

  static get scale() {
    return Ground.$scale.get()
  }

  static get translate() {
    return Ground.$translate.get()
  }

  static setScale(
    newScale: number,
    axis:
      | {
          x: number
          y: number
        }
      | 'center' = 'center',
    animation = false,
  ) {
    const currentScale = Ground.$scale.get()
    const nextScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE)

    const ratio = 1 - nextScale / currentScale

    const groundRect = Ground.element.getBoundingClientRect()

    const { x: previousX, y: previousY } = Ground.$translate.get()
    const offsetX =
      axis === 'center' ? groundRect.width / 2 : axis.x - groundRect.left
    const offsetY =
      axis === 'center' ? groundRect.height / 2 : axis.y - groundRect.top

    const nextX = previousX + (offsetX - previousX) * ratio
    const nextY = previousY + (offsetY - previousY) * ratio

    Ground._$translate.set({ x: nextX, y: nextY })
    Ground._$scale.set(nextScale)

    if (animation) {
      $isAnimatingGround.set(true)
      const easelContainer = document.getElementById(EASEL_CONTAINER_ID)!
      const time = 250
      easelContainer.style.transition = `scale ${time}ms cubic-bezier(0.54, 0.03, 0.09, 0.97), translate ${time}ms cubic-bezier(0.54, 0.03, 0.09, 0.97)`
      setTimeout(() => {
        easelContainer.style.removeProperty('transition')
        $isAnimatingGround.set(false)
      }, time)
    }
  }

  static zoomIn(amount: number) {
    Ground.setScale(Ground.$scale.get() + amount, 'center')
  }

  static zoomOut(amount: number) {
    Ground.setScale(Ground.$scale.get() - amount, 'center')
  }

  static setTranslate(x: number, y: number, animation = false) {
    Ground._$translate.set({ x, y })

    if (animation) {
      $isAnimatingGround.set(true)
      const easelContainer = document.getElementById(EASEL_CONTAINER_ID)!
      const time = 250
      easelContainer.style.transition = `translate ${time}ms cubic-bezier(0.54, 0.03, 0.09, 0.97)`
      setTimeout(() => {
        easelContainer.style.removeProperty('transition')
        $isAnimatingGround.set(false)
      }, time)
    }
  }

  static focus(page: PageNode, animation = false) {
    const pageElm = findEaselIframe(page)

    if (!pageElm) return

    const groundRect = Ground.element.getBoundingClientRect()
    const { x: currentX, y: currentY } = this.translate

    const pageRect = pageElm.getBoundingClientRect()

    const nextX = groundRect.left + (groundRect.width - pageRect.width) / 2
    const nextY = groundRect.top + (groundRect.height - pageRect.height) / 2

    const shiftX = nextX - pageRect.left
    const shiftY = nextY - pageRect.top

    Ground.setTranslate(currentX + shiftX, currentY + shiftY, animation)
  }
}
