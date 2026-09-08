'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, registerGsap } from '@/lib/motion/gsap'
import { usePointerDelegate } from '@/hooks/usePointerDelegate'
import { useMotion } from '@/components/motion/MotionProvider'
import s from './chrome.module.css'

type QuickTo = ReturnType<typeof gsap.quickTo>

/**
 * SET. The native cursor is never hidden; a 10px red-outlined square trails it
 * and expands over interactive plates. Purely additive — if it fails to
 * initialise nothing breaks. Disabled on touch and under reduced motion.
 *
 * Note the square: border-radius is 0 everywhere (§4.1), which corrects the
 * "disc" wording in the original interactive spec.
 */
export function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null)
  const xTo = useRef<QuickTo | null>(null)
  const yTo = useRef<QuickTo | null>(null)
  const [visible, setVisible] = useState(false)
  const { finePointer, reducedMotion, ready } = useMotion()
  const enabled = ready && finePointer && !reducedMotion

  useEffect(() => {
    if (!enabled || !ref.current) return
    registerGsap()
    const el = ref.current
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3' })
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3' })
    return () => {
      gsap.killTweensOf(el)
      xTo.current = null
      yTo.current = null
    }
  }, [enabled])

  const onPointer = useCallback((x: number, y: number) => {
    if (!xTo.current || !yTo.current) return
    xTo.current(x)
    yTo.current(y)
    setVisible(true)
  }, [])

  usePointerDelegate(onPointer, enabled)

  // Expand over anything that declares itself a preview target.
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const over = (e: Event) => {
      const target = (e.target as Element).closest('[data-cursor="view"]')
      gsap.to(el, {
        scale: target ? 9.6 : 1,
        duration: 0.24,
        ease: 'set',
        overwrite: 'auto',
      })
    }

    document.addEventListener('pointerover', over, { passive: true })
    return () => document.removeEventListener('pointerover', over)
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      className={`${s.cursor} ${visible ? s.cursorVisible : ''}`}
      aria-hidden="true"
    />
  )
}
