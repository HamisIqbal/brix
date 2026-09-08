'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Project } from '@/content/projects'
import { gsap, registerGsap } from '@/lib/motion/gsap'
import { usePointerDelegate } from '@/hooks/usePointerDelegate'
import { useMotion } from '@/components/motion/MotionProvider'
import { Apex } from '@/components/ui/Apex'
import s from './ledger.module.css'

const ProjectPreview = dynamic(
  () => import('./ProjectPreview').then((m) => m.ProjectPreview),
  { ssr: false },
)

type QuickTo = ReturnType<typeof gsap.quickTo>

/**
 * Hover state is entirely CSS — a fill that sweeps from the left, a title that
 * shifts 12px, siblings dimmed to ink-600. The only JavaScript here is the
 * cursor-following preview, and it is lazily loaded and pointer-fine only.
 */
export function WorkLedger({ projects }: { projects: readonly Project[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const xTo = useRef<QuickTo | null>(null)
  const yTo = useRef<QuickTo | null>(null)
  const { finePointer, reducedMotion, ready } = useMotion()
  const enabled = ready && finePointer && !reducedMotion

  useEffect(() => {
    if (!enabled || !activeSlug) return
    const el = previewRef.current
    if (!el) return

    registerGsap()
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })

    return () => {
      gsap.killTweensOf(el)
      xTo.current = null
      yTo.current = null
    }
  }, [enabled, activeSlug])

  const onPointer = useCallback((x: number, y: number) => {
    xTo.current?.(x + 24)
    yTo.current?.(y - 150)
  }, [])

  usePointerDelegate(onPointer, enabled && activeSlug !== null)

  const active = activeSlug ? projects.find((p) => p.slug === activeSlug) : undefined

  return (
    <>
      <ul className={s.ledger} onMouseLeave={() => setActiveSlug(null)}>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              className={s.row}
              data-cursor="view"
              onMouseEnter={() => enabled && setActiveSlug(project.slug)}
            >
              <span className={s.rowFill} aria-hidden="true" />
              <span className={s.rowRule} aria-hidden="true" />
              <span className={`${s.rowIndex} index-numeral`}>{project.index}</span>
              <span className={`${s.rowTitle} h2`}>{project.title}</span>
              <span className={`${s.rowCategory} label`}>
                {project.category}
                {project.categorySecondary ? ` / ${project.categorySecondary}` : ''}
              </span>
              <Apex size={14} direction="right" className={s.rowApex} />
            </Link>
          </li>
        ))}
      </ul>

      {enabled && (
        <ProjectPreview
          ref={previewRef}
          imageId={active?.imageId ?? null}
          spec={active?.spec ?? null}
        />
      )}
    </>
  )
}
