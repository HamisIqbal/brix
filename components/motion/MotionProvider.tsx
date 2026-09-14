'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/motion/gsap'
import { refreshMotionTokens } from '@/lib/motion/tokens'
import { useReducedMotion, usePointerFine } from '@/hooks/useMediaPreference'

type MotionContextValue = {
  lenis: Lenis | null
  reducedMotion: boolean
  finePointer: boolean
  /** True once GSAP is registered and the clock is running. */
  ready: boolean
}

const MotionContext = createContext<MotionContextValue>({
  lenis: null,
  reducedMotion: false,
  finePointer: false,
  ready: false,
})

export function useMotion(): MotionContextValue {
  return useContext(MotionContext)
}

/**
 * The single owner of the site's animation clock (architecture §4.4).
 * Renders {children} unchanged, so everything inside stays server-rendered.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const finePointer = usePointerFine()
  const [ready, setReady] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)
  const [lenisState, setLenisState] = useState<Lenis | null>(null)

  // data-js is stamped before first paint by the boot script in app/layout.tsx.
  // data-motion tells that script's failsafe the reveal states are owned now.
  useEffect(() => {
    registerGsap()
    refreshMotionTokens()
    document.documentElement.setAttribute('data-motion', '')
    setReady(true)
  }, [])

  // Lenis: desktop-ish pointers, motion allowed. Never on touch (native
  // momentum is better), never under reduced motion (smooth scroll IS motion).
  useEffect(() => {
    if (!ready) return
    if (reducedMotion || !finePointer) {
      lenisRef.current?.destroy()
      lenisRef.current = null
      setLenisState(null)
      return
    }

    const lenis = new Lenis({
      lerp: 0.09,
      duration: 1.1,
      wheelMultiplier: 1,
      syncTouch: false,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    lenisRef.current = lenis
    setLenisState(lenis)

    return () => {
      gsap.ticker.remove(raf)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      lenisRef.current = null
      setLenisState(null)
    }
  }, [ready, reducedMotion, finePointer])

  // Archivo's metrics differ from the fallback: every trigger position moves
  // when the webfont lands (motion system §15.4).
  useEffect(() => {
    if (!ready) return
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })
    return () => {
      cancelled = true
    }
  }, [ready])

  // Width-only resize. Height-only changes (mobile URL bar) must not refresh.
  useEffect(() => {
    if (!ready) return
    let lastWidth = window.innerWidth
    let timer: number | undefined

    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        refreshMotionTokens()
        ScrollTrigger.refresh()
      }, 200)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [ready])

  const value = useMemo<MotionContextValue>(
    () => ({ lenis: lenisState, reducedMotion, finePointer, ready }),
    [lenisState, reducedMotion, finePointer, ready],
  )

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  )
}
