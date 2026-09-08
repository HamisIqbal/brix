'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'

/**
 * Lenis-aware, iOS-safe body lock. `overflow: hidden` alone loses scroll
 * position on iOS, so the position is stored and restored explicitly.
 */
export function useScrollLock(locked: boolean, lenis: Lenis | null): void {
  useEffect(() => {
    if (!locked) return

    const scrollY = window.scrollY
    const { body } = document
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    lenis?.stop()
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
      lenis?.start()
    }
  }, [locked, lenis])
}
