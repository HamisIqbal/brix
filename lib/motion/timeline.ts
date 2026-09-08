'use client'

import type { gsap as GsapType } from 'gsap'
import { EASE, motionTokens } from './tokens'
import { staggerFor } from './stagger'
import { MASK_CLOSED, MASK_OPEN, directionFor } from './direction'

type Gsap = typeof GsapType

/**
 * The Course — motion system §1.2. The one canonical composite, used by every
 * section header on every page. Order is always DRAW -> LAY -> SET.
 *
 *   t=0      DRAW  eyebrow rule      scaleX 0->1 from left      240ms
 *   t=+80ms  LAY   headline lines    mask + 0.35em settle       760ms  (beat apart)
 *   t=+240ms LAY   supporting copy   single mask                760ms
 *   t=+320ms SET   metadata          opacity + 4px rise         420ms
 */
export function buildCourse(gsap: Gsap, root: HTMLElement): gsap.core.Timeline {
  const t = motionTokens()
  const animated = () => root.querySelectorAll<HTMLElement>('[data-reveal], [data-plate-img]')

  const tl = gsap.timeline({
    defaults: { ease: EASE.structural },
    // Promote only for the duration of the timeline (§15.3).
    onStart: () => {
      gsap.set(animated(), { willChange: 'transform' })
    },
    onComplete: () => {
      // Hand the element back to CSS — but clear ONLY what the timeline set.
      // clearProps:'all' also strips the inline aspect-ratio that reserves a
      // plate's box, collapsing every image on the page to zero height.
      gsap.set(animated(), { clearProps: 'transform,clipPath,opacity,willChange' })
    },
  })

  const q = <T extends HTMLElement>(sel: string): T[] =>
    Array.from(root.querySelectorAll<T>(sel))

  const rules = q('[data-reveal="rule"]')
  const lines = q('[data-reveal="line"]')
  const bodies = q('[data-reveal="body"]')
  const metas = q('[data-reveal="meta"]')
  const plates = q('[data-reveal="plate"]')

  const mark = (els: HTMLElement[]) =>
    els.forEach((el) => el.setAttribute('data-revealed', ''))

  // DRAW — the line is struck first.
  if (rules.length) {
    mark(rules)
    tl.fromTo(
      rules,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: t.quick, ease: EASE.set, stagger: staggerFor(rules.length) },
      0,
    )
  }

  // LAY — the units are laid to the line, one beat apart.
  if (lines.length) {
    mark(lines)
    tl.fromTo(
      lines,
      { yPercent: 105 },
      { yPercent: 0, duration: t.reveal, stagger: t.beat },
      t.beat,
    )
  }

  if (bodies.length) {
    mark(bodies)
    tl.fromTo(
      bodies,
      { yPercent: 105 },
      { yPercent: 0, duration: t.reveal, stagger: staggerFor(bodies.length) },
      t.beat * 3,
    )
  }

  // LAY — plates open from the edge nearest the margin they bleed toward.
  plates.forEach((plate, i) => {
    plate.setAttribute('data-revealed', '')
    const dir = (plate.dataset.dir as keyof typeof MASK_CLOSED) || directionFor(plate)
    const inner = plate.querySelector<HTMLElement>('[data-plate-img]')

    tl.fromTo(
      plate,
      { clipPath: MASK_CLOSED[dir] },
      { clipPath: MASK_OPEN, duration: t.major * 0.9 },
      t.beat * 2 + i * 0.09,
    )

    // The counter-motion is the point: the mask opens one way while the image
    // settles the other (visual design system §5.5).
    if (inner) {
      tl.fromTo(
        inner,
        { scale: t.scaleEnter },
        { scale: 1, duration: t.major * 0.9 },
        t.beat * 2 + i * 0.09,
      )
    }
  })

  // SET — the joint is tooled last.
  if (metas.length) {
    mark(metas)
    tl.fromTo(
      metas,
      { opacity: 0, y: t.meta },
      { opacity: 1, y: 0, duration: t.base, ease: EASE.set, stagger: staggerFor(metas.length) },
      t.beat * 4,
    )
  }

  return tl
}

/** Reduced motion and no-motion paths: resolve everything to its final state. */
export function resolveInstantly(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.setAttribute('data-revealed', '')
    el.style.clipPath = ''
    el.style.transform = ''
    el.style.opacity = ''
    el.style.willChange = 'auto'
  })
  root.querySelectorAll<HTMLElement>('[data-plate-img]').forEach((el) => {
    el.style.transform = ''
  })
}
