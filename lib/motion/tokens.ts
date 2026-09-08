'use client'

/**
 * Motion tokens read from CSS custom properties, so the stylesheet and GSAP
 * cannot drift apart (architecture §6). Read once, cached, re-read on breakpoint
 * change via refreshMotionTokens().
 */

export type MotionTokens = {
  instant: number
  quick: number
  base: number
  reveal: number
  major: number
  staggerSm: number
  staggerLg: number
  staggerMax: number
  beat: number
  parallaxMax: number
  magnetMax: number
  settle: string
  meta: number
  scaleEnter: number
}

const FALLBACK: MotionTokens = {
  instant: 0.12,
  quick: 0.24,
  base: 0.42,
  reveal: 0.76,
  major: 1,
  staggerSm: 0.06,
  staggerLg: 0.04,
  staggerMax: 0.48,
  beat: 0.08,
  parallaxMax: 0.08,
  magnetMax: 6,
  settle: '0.35em',
  meta: 4,
  scaleEnter: 1.06,
}

let cache: MotionTokens | null = null

function ms(raw: string, fallback: number): number {
  const v = raw.trim()
  if (!v) return fallback
  if (v.endsWith('ms')) return parseFloat(v) / 1000
  if (v.endsWith('s')) return parseFloat(v)
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : fallback
}

function px(raw: string, fallback: number): number {
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

export function refreshMotionTokens(): MotionTokens {
  if (typeof window === 'undefined') return FALLBACK
  const s = getComputedStyle(document.documentElement)
  const get = (name: string) => s.getPropertyValue(name)

  cache = {
    instant: ms(get('--dur-instant'), FALLBACK.instant),
    quick: ms(get('--dur-quick'), FALLBACK.quick),
    base: ms(get('--dur-base'), FALLBACK.base),
    reveal: ms(get('--dur-reveal'), FALLBACK.reveal),
    major: ms(get('--dur-major'), FALLBACK.major),
    staggerSm: ms(get('--stagger-sm'), FALLBACK.staggerSm),
    staggerLg: ms(get('--stagger-lg'), FALLBACK.staggerLg),
    staggerMax: ms(get('--stagger-max'), FALLBACK.staggerMax),
    beat: ms(get('--beat'), FALLBACK.beat),
    parallaxMax: px(get('--parallax-max'), FALLBACK.parallaxMax),
    magnetMax: px(get('--magnet-max'), FALLBACK.magnetMax),
    settle: get('--move-settle').trim() || FALLBACK.settle,
    meta: px(get('--move-meta'), FALLBACK.meta),
    scaleEnter: px(get('--scale-enter'), FALLBACK.scaleEnter),
  }
  return cache
}

export function motionTokens(): MotionTokens {
  return cache ?? refreshMotionTokens()
}

/** Exit law: exit = entrance x 0.6, floor 120ms (motion system §3.2). */
export function exitDuration(entrance: number): number {
  return Math.max(0.12, entrance * 0.6)
}

export const EASE = {
  structural: 'structural',
  mechanical: 'mechanical',
  set: 'set',
  lift: 'lift',
  none: 'none',
} as const
