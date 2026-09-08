'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/motion/gsap'
import { motionTokens } from '@/lib/motion/tokens'
import { useMotion } from './MotionProvider'

type ParallaxProps = {
  children: ReactNode
  id: string
  /** Fraction of element height, capped at --parallax-max (8%). */
  amount?: number
  className?: string
}

/**
 * CARRY — the only scroll-bound verb (motion system §9.3). Scrubbed, linear,
 * reversible. Never time-based, never combined with a reveal on the same element.
 * Disabled below 1024px and under reduced motion by the token override.
 */
export function Parallax({ children, id, amount = 0.06, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reducedMotion } = useMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !ready || reducedMotion) return

      const max = motionTokens().parallaxMax
      if (max <= 0) return

      const travel = Math.min(amount, max) * 100

      gsap.fromTo(
        el,
        { yPercent: -travel / 2 },
        {
          yPercent: travel / 2,
          ease: 'none',
          scrollTrigger: {
            id: `parallax:${id}`,
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [ready, reducedMotion, amount, id] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
