'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { buildCourse, resolveInstantly } from '@/lib/motion/timeline'
import { startFor } from '@/lib/motion/stagger'
import { useMotion } from './MotionProvider'

type RevealProps = {
  children: ReactNode
  /** Stable id — one ScrollTrigger per section, named for the budget audit. */
  id: string
  className?: string
}

/**
 * The central motion component (architecture §4.3).
 *
 * It renders a plain wrapper and nothing else. Its server-rendered children
 * carry data-reveal attributes; this claims them and runs The Course.
 * That is what lets a heavily-animated site stay almost entirely server-rendered.
 */
export function Reveal({ children, id, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reducedMotion } = useMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || !ready) return

      // Reduced motion — or the boot failsafe already released the page
      // because hydration was slow: content is on screen, never re-hide it.
      if (reducedMotion || document.documentElement.getAttribute('data-js') !== 'true') {
        resolveInstantly(root)
        return
      }

      const triggerId = `reveal:${id}`
      // Guard against a duplicate left behind by a fast route re-entry.
      ScrollTrigger.getById(triggerId)?.kill()

      const tl = buildCourse(gsap, root)
      tl.pause()

      const start = startFor(root)
      const st = ScrollTrigger.create({
        id: triggerId,
        trigger: root,
        start,
        once: true,
        onEnter: () => tl.play(),
      })

      // A section already past the trigger line when the page loads never
      // receives onEnter — ScrollTrigger treats it as having entered before
      // the trigger existed. Without this, the first section of every route
      // below the hero would sit clipped forever.
      if (st.progress > 0 || root.getBoundingClientRect().top < window.innerHeight) {
        tl.play()
      }
    },
    { scope: ref, dependencies: [ready, reducedMotion, id] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
