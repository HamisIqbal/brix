'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { home } from '@/content/pages/home'
import { useMotion } from '@/components/motion/MotionProvider'
import s from './home.module.css'

/**
 * CARRY. The one scrolling-text element on the site, and it is not a marquee:
 * x is bound to scroll position, so it drifts left as you scroll down and right
 * as you scroll up, and it is motionless when the page is.
 *
 * An infinite auto-marquee runs when nobody is watching. A scroll-bound strip
 * is a readout of the visitor's own motion — the same register as the progress
 * rule and the course counter (motion system §8.6).
 */
export function SpecStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reducedMotion } = useMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !ready || reducedMotion) return

      ScrollTrigger.getById('home:spec-strip')?.kill()

      gsap.fromTo(
        el,
        { xPercent: 0 },
        {
          xPercent: -32,
          ease: 'none',
          scrollTrigger: {
            id: 'home:spec-strip',
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [ready, reducedMotion] },
  )

  const items = [...home.specStrip, ...home.specStrip]

  return (
    <div className={s.specStrip} aria-hidden="true">
      <div ref={ref} className={`${s.specTrack} label`}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}
