'use client'

/**
 * The single GSAP import surface. Nothing else in the app imports gsap directly.
 * Motion system §4.2: core + ScrollTrigger only, plus CustomEase so the JS curves
 * are numerically identical to the CSS ones (§3.1). No SplitText, Flip or Draggable.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

let registered = false

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, CustomEase)

  // The four sanctioned curves, mirrored from styles/tokens.css.
  CustomEase.create('structural', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('mechanical', 'M0,0 C0.65,0 0.35,1 1,1')
  CustomEase.create('set', 'M0,0 C0.33,1 0.68,1 1,1')
  CustomEase.create('lift', 'M0,0 C0.4,0 0.2,1 1,1')

  // Mobile URL-bar collapse fires a resize; refreshing there causes visible
  // jumps mid-scroll. Motion system §15.4.
  ScrollTrigger.config({ ignoreMobileResize: true })

  registered = true
}

export { gsap, ScrollTrigger }
