'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { EASE, motionTokens } from '@/lib/motion/tokens'
import { useMotion } from '@/components/motion/MotionProvider'
import { Apex } from '@/components/ui/Apex'
import s from './footer.module.css'

const LETTERS = ['B', 'R', 'I', 'X'] as const

/**
 * The four verbs at full scale, one time: DRAW the line, LAY the units,
 * SET the mark (motion system §14.3).
 *
 * The wordmark does not fade, scale or travel. It rises from behind the
 * foundation rule — which is drawn first and is literally the mask boundary —
 * and comes to rest on it.
 */
export function FooterMonument() {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reducedMotion } = useMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || !ready) return

      const rule = root.querySelector<HTMLElement>('[data-foundation]')
      const letters = Array.from(root.querySelectorAll<HTMLElement>('[data-letter]'))
      const apex = root.querySelector<HTMLElement>('[data-apex]')
      const legal = root.querySelector<HTMLElement>('[data-legal]')

      if (reducedMotion) {
        gsap.set(rule, { scaleX: 1 })
        gsap.set(letters, { clipPath: 'none', y: 0 })
        gsap.set([apex, legal], { opacity: 1 })
        return
      }

      const t = motionTokens()
      ScrollTrigger.getById('footer:monument')?.kill()

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.structural } })

      tl.fromTo(
        rule,
        { scaleX: 0 },
        { scaleX: 1, duration: t.major, ease: EASE.structural },
        0.24,
      )

      tl.fromTo(
        letters,
        { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 12 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          yPercent: 0,
          duration: t.major,
          stagger: t.beat,
          onComplete: () => letters.forEach((l) => (l.style.willChange = 'auto')),
        },
        0.56,
      )

      if (apex) {
        tl.fromTo(apex, { opacity: 0, scaleY: 0.4 }, { opacity: 1, scaleY: 1, duration: 0.7 }, 1.2)
      }
      if (legal) {
        tl.fromTo(legal, { opacity: 0, y: t.meta }, { opacity: 1, y: 0, duration: t.base }, 1.6)
      }

      ScrollTrigger.create({
        id: 'footer:monument',
        trigger: root,
        start: 'top 90%',
        once: true,
        onEnter: () => tl.play(),
      })
    },
    { scope: ref, dependencies: [ready, reducedMotion] },
  )

  return (
    <div ref={ref} className={s.monument}>
      <div className={s.apex} data-apex style={{ opacity: reducedMotion ? 1 : 0 }}>
        <Apex size={48} direction="up" strokeWidth={2} />
      </div>

      <span className={s.foundation} data-foundation aria-hidden="true" />

      <div className={`${s.wordmark} display-1`} aria-hidden="true">
        {LETTERS.map((letter) => (
          <span key={letter} className={s.letter} data-letter>
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}
