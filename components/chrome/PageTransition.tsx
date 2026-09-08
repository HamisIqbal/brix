'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LazyMotion, domAnimation, m, useAnimationControls } from 'framer-motion'
import { ScrollTrigger } from '@/lib/motion/gsap'
import { useMotion } from '@/components/motion/MotionProvider'
import s from './chrome.module.css'

const COURSES = 3
const EASE_MECHANICAL = [0.65, 0, 0.35, 1] as const
const COVER_MS = 420
const MIN_HOLD_MS = 260
const FAILSAFE_MS = 1200

function isPlainLeftClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
}

/**
 * The cover: three offset courses wiping up from the bottom, then up and off
 * the top. Framer Motion owns presence and sequencing (architecture §4.1).
 *
 * The cover direction is constant — a wall is always laid upward — so it never
 * varies by nav order. Browser back/forward is never intercepted, and a hard
 * failsafe guarantees the page is never left covered.
 */
export function PageTransition() {
  return (
    <LazyMotion features={domAnimation} strict>
      <PageTransitionInner />
    </LazyMotion>
  )
}

function PageTransitionInner() {
  const controls = useAnimationControls()
  const router = useRouter()
  const pathname = usePathname()
  const { lenis, reducedMotion } = useMotion()

  const covered = useRef(false)
  const navigating = useRef(false)
  const failsafe = useRef<number | undefined>(undefined)
  const firstRender = useRef(true)

  const uncover = useCallback(async () => {
    window.clearTimeout(failsafe.current)
    if (!covered.current) return
    covered.current = false
    await controls.start('above')
    // Snap back below the fold so the next navigation rises from the bottom
    // again. A wall is always laid upward.
    await controls.start('below')
    navigating.current = false
  }, [controls])

  // Intercept internal navigations so the cover can wipe in before the route
  // commits. Modifier clicks, new tabs, downloads, hashes and externals pass
  // straight through to the browser.
  useEffect(() => {
    if (reducedMotion) return

    const onClick = (e: MouseEvent) => {
      if (!isPlainLeftClick(e) || e.defaultPrevented || navigating.current) return

      const anchor = (e.target as Element | null)?.closest?.('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const url = new URL(href, window.location.origin)
      if (url.pathname === window.location.pathname) return

      e.preventDefault()
      navigating.current = true

      failsafe.current = window.setTimeout(() => {
        void uncover()
        router.push(url.pathname + url.search)
      }, FAILSAFE_MS)

      void (async () => {
        covered.current = true
        await controls.start('on')
        router.push(url.pathname + url.search)
      })()
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      window.clearTimeout(failsafe.current)
    }
  }, [controls, router, uncover, reducedMotion])

  // The route has committed. Reset scroll behind the cover, let the new tree
  // paint, refresh trigger positions, then take the cover off.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    const timer = window.setTimeout(() => {
      void uncover()
    }, covered.current ? MIN_HOLD_MS : 0)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [pathname, lenis, uncover])

  if (reducedMotion) return null

  return (
    <div className={s.cover} aria-hidden="true">
      {Array.from({ length: COURSES }).map((_, i) => (
        <m.div
          key={i}
          className={s.coverCourse}
          custom={i}
          initial="below"
          animate={controls}
          /* Each course is a third of the viewport, so translating by its own
             height would leave rows 1 and 2 sitting on top of rows 2 and 3 —
             a black cover over the lower two thirds of every page. The wipe is
             a scaleY from the bottom edge instead: it collapses to nothing at
             rest, grows upward to cover, then collapses upward off the top. */
          variants={{
            below: { scaleY: 0, originY: 1, transition: { duration: 0 } },
            on: (index: number) => ({
              scaleY: 1,
              originY: 1,
              transition: {
                duration: COVER_MS / 1000,
                delay: index * 0.06,
                ease: EASE_MECHANICAL,
              },
            }),
            above: (index: number) => ({
              scaleY: 0,
              originY: 0,
              transition: {
                duration: COVER_MS / 1000,
                delay: index * 0.06,
                ease: EASE_MECHANICAL,
              },
            }),
          }}
        />
      ))}
    </div>
  )
}
