'use client'

import dynamic from 'next/dynamic'

/**
 * Every Framer Motion consumer is loaded lazily, so the feature bundle stays
 * off the critical path. Each is preloaded during the first idle period after
 * mount (see useIdlePreload), so by the time a visitor can click, it is there.
 */
export const MenuOverlay = dynamic(
  () => import('./MenuOverlay').then((m) => m.MenuOverlay),
  { ssr: false },
)

export const PageTransition = dynamic(
  () => import('./PageTransition').then((m) => m.PageTransition),
  { ssr: false },
)

export const CursorFollower = dynamic(
  () => import('./CursorFollower').then((m) => m.CursorFollower),
  { ssr: false },
)

export function preloadChrome(): void {
  void import('./MenuOverlay')
  void import('./PageTransition')
}
