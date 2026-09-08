'use client'

import { useEffect } from 'react'

type Handler = (x: number, y: number) => void

/**
 * One document-level pointermove listener, rAF-throttled, shared by every
 * magnetic button, the cursor follower and the project preview.
 * Ten magnetic buttons must not mean ten listeners (architecture §4.7).
 */
const subscribers = new Set<Handler>()
let attached = false
let frame = 0
let lastX = 0
let lastY = 0

function flush() {
  frame = 0
  for (const fn of subscribers) fn(lastX, lastY)
}

function onMove(e: PointerEvent) {
  lastX = e.clientX
  lastY = e.clientY
  if (!frame) frame = requestAnimationFrame(flush)
}

function attach() {
  if (attached) return
  window.addEventListener('pointermove', onMove, { passive: true })
  attached = true
}

function detach() {
  if (!attached) return
  window.removeEventListener('pointermove', onMove)
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  attached = false
}

export function usePointerDelegate(handler: Handler, enabled = true): void {
  useEffect(() => {
    if (!enabled) return
    subscribers.add(handler)
    attach()
    return () => {
      subscribers.delete(handler)
      if (subscribers.size === 0) detach()
    }
  }, [handler, enabled])
}
