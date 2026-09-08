'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import { ScrollTrigger } from '@/lib/motion/gsap'
import { useMotion } from '@/components/motion/MotionProvider'
import s from './chrome.module.css'

/**
 * SET. One instrument in the rail: a course counter reading "03 / 08".
 *
 * It is kept under reduced motion — an instrument reporting position is not
 * decoration (motion system §17.1) — and aria-hidden, because announcing it
 * would be hostile to screen readers.
 */
export function CourseCounter() {
  const [state, setState] = useState({ current: 1, total: 0 })
  const { ready } = useMotion()
  const pathname = usePathname()

  useGSAP(
    () => {
      if (!ready) return
      const courses = Array.from(document.querySelectorAll<HTMLElement>('[data-course]'))
      if (courses.length === 0) {
        setState({ current: 1, total: 0 })
        return
      }

      setState({ current: 1, total: courses.length })

      courses.forEach((el, i) => {
        ScrollTrigger.create({
          id: `counter:${pathname}:${i}`,
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setState((prev) => ({ ...prev, current: i + 1 }))
          },
        })
      })
    },
    { dependencies: [ready, pathname] },
  )

  if (state.total === 0) return null

  return (
    <span className={clsx(s.counter, 'label', 'tabular')} aria-hidden="true">
      <span className={s.counterNum}>{String(state.current).padStart(2, '0')}</span>
      <span>/</span>
      <span>{String(state.total).padStart(2, '0')}</span>
    </span>
  )
}
