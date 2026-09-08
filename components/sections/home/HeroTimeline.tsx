'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/motion/gsap'
import { EASE, motionTokens } from '@/lib/motion/tokens'
import { useMotion } from '@/components/motion/MotionProvider'

const SESSION_KEY = 'brix:hero-played'

/**
 * The one fully choreographed sequence on the site (motion system §7.1).
 * Time-based, fires on mount, and only once per session — a client-side
 * return to Home renders the hero complete rather than replaying it.
 *
 * Wraps server-rendered children and claims them by data-hero attribute, so
 * the hero markup itself ships no JavaScript.
 */
export function HeroTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reducedMotion } = useMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || !ready) return

      const pick = <T extends HTMLElement>(name: string): T[] =>
        Array.from(root.querySelectorAll<T>(`[data-hero="${name}"]`))

      const all = Array.from(root.querySelectorAll<HTMLElement>('[data-hero]'))
      const settle = () => {
        // Only what the timeline set — never inline layout the markup relies on.
        gsap.set(all, { clearProps: 'transform,clipPath,opacity,willChange' })
        root.setAttribute('data-hero-done', '')
      }

      const alreadyPlayed =
        typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1'

      if (reducedMotion || alreadyPlayed) {
        settle()
        return
      }

      const t = motionTokens()
      const tl = gsap.timeline({
        defaults: { ease: EASE.structural },
        onComplete: () => {
          settle()
          try {
            sessionStorage.setItem(SESSION_KEY, '1')
          } catch {
            /* private mode — the hero simply replays next load */
          }
        },
      })

      const rules = pick('rule')
      const lines = pick('line')
      const plate = pick('plate')
      const sub = pick('sub')
      const strip = pick('strip')
      const cue = pick('cue')

      if (rules.length) {
        tl.fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, 0)
      }

      // Two lines, one beat apart — the bond offset in time.
      if (lines.length) {
        tl.fromTo(
          lines,
          { yPercent: 105 },
          { yPercent: 0, duration: t.reveal, stagger: t.beat },
          0.12,
        )
      }

      // The plate is set into the wall, so it rises from the course below.
      if (plate.length) {
        tl.fromTo(
          plate,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: t.major },
          0.34,
        )
      }

      if (sub.length) {
        tl.fromTo(sub, { yPercent: 105 }, { yPercent: 0, duration: t.base }, 0.7)
      }

      if (strip.length) {
        tl.fromTo(
          strip,
          { opacity: 0, y: t.meta },
          { opacity: 1, y: 0, duration: t.base, ease: EASE.set, stagger: 0.04 },
          0.78,
        )
      }

      if (cue.length) {
        tl.fromTo(cue, { opacity: 0 }, { opacity: 1, duration: t.base }, 1.0)
      }
    },
    { scope: ref, dependencies: [ready, reducedMotion] },
  )

  return (
    <div ref={ref} data-hero-scope style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
