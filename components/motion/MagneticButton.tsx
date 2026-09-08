'use client'

import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { gsap, registerGsap } from '@/lib/motion/gsap'
import { motionTokens } from '@/lib/motion/tokens'
import { usePointerDelegate } from '@/hooks/usePointerDelegate'
import { useMotion } from './MotionProvider'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** Radius of influence in px, measured from the element's box. */
  radius?: number
}

type QuickTo = ReturnType<typeof gsap.quickTo>

/**
 * SET — the element leans, it does not leap. Max 6px (--magnet-max).
 * Pointer-fine only; disabled on touch and under reduced motion, where the
 * button is simply a button and nothing is lost (motion system §10.2).
 */
export function MagneticButton({ children, className, radius = 80 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const xTo = useRef<QuickTo | null>(null)
  const yTo = useRef<QuickTo | null>(null)
  const labelXTo = useRef<QuickTo | null>(null)
  const { reducedMotion, finePointer, ready } = useMotion()
  const enabled = ready && finePointer && !reducedMotion

  useEffect(() => {
    if (!enabled || !ref.current) return
    registerGsap()
    const el = ref.current
    const label = el.querySelector<HTMLElement>('[data-magnet-label]')

    xTo.current = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
    if (label) labelXTo.current = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'power3' })

    return () => {
      gsap.killTweensOf(el)
      if (label) gsap.killTweensOf(label)
      gsap.set(el, { x: 0, y: 0 })
      if (label) gsap.set(label, { x: 0 })
      xTo.current = null
      yTo.current = null
      labelXTo.current = null
    }
  }, [enabled])

  const onPointer = useCallback(
    (px: number, py: number) => {
      const el = ref.current
      if (!el || !xTo.current || !yTo.current) return

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = px - cx
      const dy = py - cy

      const withinX = Math.abs(dx) < rect.width / 2 + radius
      const withinY = Math.abs(dy) < rect.height / 2 + radius
      const max = motionTokens().magnetMax

      if (withinX && withinY && max > 0) {
        const nx = gsap.utils.clamp(-1, 1, dx / (rect.width / 2 + radius))
        const ny = gsap.utils.clamp(-1, 1, dy / (rect.height / 2 + radius))
        xTo.current(nx * max)
        yTo.current(ny * max)
        // The label moves a third as far, which is what reads as depth.
        labelXTo.current?.(nx * max * 0.33)
      } else {
        xTo.current(0)
        yTo.current(0)
        labelXTo.current?.(0)
      }
    },
    [radius],
  )

  usePointerDelegate(onPointer, enabled)

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block', willChange: enabled ? 'transform' : undefined }}>
      {children}
    </div>
  )
}
