'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { useMotion } from '@/components/motion/MotionProvider'
import s from './home.module.css'

/**
 * CARRY. The mason's string line, drawn top-down and scrubbed to scroll —
 * one scrubbed ScrollTrigger for the whole section, ease `none` so it tracks
 * the hand exactly. Under reduced motion it renders at full height.
 */
export function StringLine() {
  const ref = useRef<HTMLSpanElement>(null)
  const { ready, reducedMotion } = useMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !ready) return

      if (reducedMotion) {
        gsap.set(el, { scaleY: 1 })
        return
      }

      ScrollTrigger.getById('method:string')?.kill()

      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            id: 'method:string',
            trigger: el.parentElement,
            start: 'top 78%',
            end: 'bottom 65%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [ready, reducedMotion] },
  )

  return <span ref={ref} className={s.stringLine} aria-hidden="true" />
}
