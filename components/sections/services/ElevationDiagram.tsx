'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { services } from '@/content/services'
import { useMotion } from '@/components/motion/MotionProvider'
import { Cross } from '@/components/ui/Marks'
import { COURSES, VIEWBOX, jointLines, courseFor } from './elevation'
import s from './services.module.css'

/**
 * CARRY. The wall draws itself as you descend the page: one scrubbed
 * ScrollTrigger for the whole section (stroke-dashoffset on SVG geometry,
 * the one sanctioned exception to transform/opacity/clip-path), plus one
 * toggle trigger per service for the active state.
 *
 * Under reduced motion the wall renders fully drawn and the active state
 * still tracks scroll — the drawing is information, not decoration.
 */
export function ElevationDiagram({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState(3) // brick leads
  const { ready, reducedMotion, lenis } = useMotion()

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg || !ready) return

      const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>('[data-stroke]'))

      if (reducedMotion) {
        strokes.forEach((el) => {
          el.style.strokeDasharray = ''
          el.style.strokeDashoffset = ''
        })
      } else {
        ScrollTrigger.getById('services:elevation')?.kill()

        strokes.forEach((el) => {
          const len = el.getTotalLength()
          el.style.strokeDasharray = `${len}`
          el.style.strokeDashoffset = `${len}`
        })

        gsap.to(strokes, {
          strokeDashoffset: 0,
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            id: 'services:elevation',
            trigger: document.getElementById('services-elevation'),
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
      }

      // Active course tracking — one toggle trigger per service entry.
      services.forEach((service) => {
        const el = document.getElementById(`service-${service.index}`)
        if (!el) return
        ScrollTrigger.create({
          id: `services:active-${service.index}`,
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (self.isActive) setActive(service.course)
          },
        })
      })
    },
    { scope: ref, dependencies: [ready, reducedMotion] },
  )

  // Reflect the active course onto the entries so both columns read as one
  // control, without those entries becoming Client Components.
  useEffect(() => {
    services.forEach((service) => {
      document
        .getElementById(`service-${service.index}`)
        ?.classList.toggle(s.entryActive as string, service.course === active)
    })
  }, [active])

  const jump = useCallback(
    (index: string) => {
      const el = document.getElementById(`service-${index}`)
      if (!el) return
      if (lenis) lenis.scrollTo(el, { offset: -120, duration: 0.9 })
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [lenis],
  )

  const activeGeom = courseFor(active)
  const activeService = services.find((x) => x.course === active)

  return (
    <div>
      <p className={clsx(s.diagramLabel, 'label')}>
        <Cross />
        {label}
      </p>

      <svg
        ref={ref}
        className={s.diagram}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        role="img"
        aria-label="Wall section drawing: footing, block, brick, stone, outdoor structures and cap, laid bottom to top."
      >
        {COURSES.map((g) => {
          const service = services.find((x) => x.course === g.course)
          if (!service) return null
          const isActive = g.course === active

          return (
            <g
              key={g.course}
              className={clsx(s.courseGroup, isActive && s.courseActive)}
              role="button"
              tabIndex={0}
              aria-label={`${service.name} — ${service.statement}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => jump(service.index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  jump(service.index)
                }
              }}
            >
              <rect
                data-stroke
                className={s.courseShape}
                x={g.x}
                y={g.y}
                width={g.w}
                height={g.h}
              />
              {jointLines(g).map((jx) => (
                <line
                  key={jx}
                  data-stroke
                  className={s.courseJoint}
                  x1={jx}
                  y1={g.y}
                  x2={jx}
                  y2={g.y + g.h}
                />
              ))}
              <text className={s.courseIndex} x={g.x - 18} y={g.y + g.h / 2 + 2}>
                {service.index}
              </text>
            </g>
          )
        })}

        {/* The dimension line extends from the active course to the entries. */}
        <line
          className={s.dimension}
          x1={activeGeom.x + activeGeom.w}
          y1={activeGeom.y + activeGeom.h / 2}
          x2={VIEWBOX.w}
          y2={activeGeom.y + activeGeom.h / 2}
        />
      </svg>

      <p className="visually-hidden" aria-live="polite">
        {activeService ? `${activeService.name} course` : ''}
      </p>
    </div>
  )
}
