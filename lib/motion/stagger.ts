'use client'

import { motionTokens } from './tokens'

/**
 * Motion system §3.4 — the clamp is a formula, never hand-tuned.
 *   base    = 60ms if count <= 6 else 40ms
 *   stagger = min(base, 480ms / (count - 1))
 * Direction always follows reading order; `from: "random"` is banned sitewide.
 */
export function staggerFor(count: number): number {
  if (count <= 1) return 0
  const t = motionTokens()
  const base = count <= 6 ? t.staggerSm : t.staggerLg
  return Math.min(base, t.staggerMax / (count - 1))
}

export const TRIGGER_START = 'top 82%'
export const TRIGGER_START_TALL = 'top 92%'

/** Elements taller than 90vh must not sit half-revealed. */
export function startFor(el: Element): string {
  return el.getBoundingClientRect().height > window.innerHeight * 0.9
    ? TRIGGER_START_TALL
    : TRIGGER_START
}
