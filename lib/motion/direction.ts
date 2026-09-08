'use client'

/**
 * Reveal direction is derived from position, never authored — visual design
 * system §6.4. One helper, applied everywhere, is what makes the whole site
 * read as authored by one hand.
 */

export type MaskDirection = 'top' | 'bottom' | 'left' | 'right'

export const MASK_CLOSED: Record<MaskDirection, string> = {
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

export const MASK_OPEN = 'inset(0% 0% 0% 0%)'

/** The mask element pads its own box out (see styles/motion.css) so these
 *  stay non-negative — negative clip insets are mis-painted by Chromium. */
export const TEXT_MASK_CLOSED = 'inset(0% 0% 100% 0%)'
export const TEXT_MASK_OPEN = 'inset(0% 0% 0% 0%)'

/**
 * Left half of the viewport opens from the left, right half from the right,
 * a full-width element rises from the bottom.
 */
export function directionFor(el: Element): MaskDirection {
  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth

  if (rect.width > vw * 0.82) return 'bottom'

  const centre = rect.left + rect.width / 2
  return centre < vw / 2 ? 'left' : 'right'
}
