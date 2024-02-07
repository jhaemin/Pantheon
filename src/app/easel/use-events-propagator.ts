// import { shared } from '@/shared'
// import { useEffect } from 'react'

// export function useEventsPropagator() {
//   useEffect(() => {
//     const parentFrame = window.parentFrame

//     if (!parentFrame) {
//       return
//     }

//     const onKeyDown = (e: KeyboardEvent) => {
//       e.preventDefault()

//       parentFrame.dispatchEvent(new KeyboardEvent('keydown', e))
//     }

//     const onMouseDown = (e: MouseEvent) => {
//       e.preventDefault()

//       const frameRect = parentFrame.getBoundingClientRect()

//       const event = new MouseEvent('mousedown', e)
//       Object.defineProperty(event, 'target', {
//         value: e.target,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientX', {
//         value: e.clientX * shared.$scale.get() + frameRect.left,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientY', {
//         value: e.clientY * shared.$scale.get() + frameRect.top,
//         enumerable: true,
//       })

//       parentFrame.dispatchEvent(event)
//     }

//     const onMouseMove = (e: MouseEvent) => {
//       e.preventDefault()

//       const frameRect = parentFrame.getBoundingClientRect()

//       const event = new MouseEvent('mousemove', e)
//       Object.defineProperty(event, 'target', {
//         value: e.target,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientX', {
//         value: e.clientX * shared.$scale.get() + frameRect.left,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientY', {
//         value: e.clientY * shared.$scale.get() + frameRect.top,
//         enumerable: true,
//       })

//       parentFrame.dispatchEvent(event)
//     }

//     const onMouseUp = (e: MouseEvent) => {
//       e.preventDefault()

//       const frameRect = parentFrame.getBoundingClientRect()

//       const event = new MouseEvent('mouseup', e)
//       Object.defineProperty(event, 'target', {
//         value: e.target,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientX', {
//         value: e.clientX * shared.$scale.get() + frameRect.left,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientY', {
//         value: e.clientY * shared.$scale.get() + frameRect.top,
//         enumerable: true,
//       })

//       parentFrame.dispatchEvent(event)
//     }

//     const onMouseOver = (e: MouseEvent) => {
//       e.preventDefault()

//       const frameRect = parentFrame.getBoundingClientRect()

//       const event = new MouseEvent('mouseover', e)
//       Object.defineProperty(event, 'target', {
//         value: e.target,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientX', {
//         value: e.clientX * shared.$scale.get() + frameRect.left,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientY', {
//         value: e.clientY * shared.$scale.get() + frameRect.top,
//         enumerable: true,
//       })

//       parentFrame.dispatchEvent(event)
//     }

//     const contextMenu = (e: MouseEvent) => {
//       e.preventDefault()

//       const frameRect = parentFrame.getBoundingClientRect()

//       const event = new MouseEvent('contextmenu', e)

//       Object.defineProperty(event, 'target', {
//         value: e.target,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientX', {
//         value: e.clientX * shared.$scale.get() + frameRect.left,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientY', {
//         value: e.clientY * shared.$scale.get() + frameRect.top,
//         enumerable: true,
//       })

//       parentFrame.dispatchEvent(event)
//     }

//     const onWheel = (e: WheelEvent) => {
//       if (!e.altKey) {
//         e.preventDefault()
//       }

//       const frameRect = parentFrame.getBoundingClientRect()

//       const event = new WheelEvent('wheel', e)
//       Object.defineProperty(event, 'target', {
//         value: e.target,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientX', {
//         value: e.clientX * shared.$scale.get() + frameRect.left,
//         enumerable: true,
//       })
//       Object.defineProperty(event, 'clientY', {
//         value: e.clientY * shared.$scale.get() + frameRect.top,
//         enumerable: true,
//       })

//       parentFrame.dispatchEvent(event)
//     }

//     window.addEventListener('keydown', onKeyDown)

//     window.addEventListener('mousedown', onMouseDown)
//     window.addEventListener('mouseup', onMouseUp)
//     window.addEventListener('mousemove', onMouseMove)
//     window.addEventListener('mouseover', onMouseOver)

//     window.addEventListener('contextmenu', contextMenu)

//     window.addEventListener('wheel', onWheel, { passive: false })

//     return () => {
//       window.removeEventListener('keydown', onKeyDown)

//       window.removeEventListener('mouseup', onMouseUp)
//       window.removeEventListener('mousedown', onMouseDown)
//       window.removeEventListener('mousemove', onMouseMove)
//       window.removeEventListener('mouseover', onMouseOver)

//       window.removeEventListener('contextmenu', contextMenu)

//       window.removeEventListener('wheel', onWheel)
//     }
//   }, [])
// }
