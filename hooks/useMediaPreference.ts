'use client'

import { useSyncExternalStore } from 'react'

/**
 * SSR-safe media query subscription. The server snapshot is always `false`, so
 * the first client render matches the server HTML and the value corrects itself
 * after hydration — never a mismatch (architecture §4.9).
 */
function createStore(query: string) {
  let mql: MediaQueryList | null = null

  const get = () => {
    if (typeof window === 'undefined') return false
    mql ??= window.matchMedia(query)
    return mql.matches
  }

  const subscribe = (cb: () => void) => {
    if (typeof window === 'undefined') return () => {}
    mql ??= window.matchMedia(query)
    mql.addEventListener('change', cb)
    return () => mql?.removeEventListener('change', cb)
  }

  return { get, subscribe }
}

const reducedStore = createStore('(prefers-reduced-motion: reduce)')
const fineStore = createStore('(hover: hover) and (pointer: fine)')
const desktopStore = createStore('(min-width: 1024px)')

export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedStore.subscribe, reducedStore.get, () => false)
}

export function usePointerFine(): boolean {
  return useSyncExternalStore(fineStore.subscribe, fineStore.get, () => false)
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(desktopStore.subscribe, desktopStore.get, () => false)
}
