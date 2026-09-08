'use client'

import { PageTransition, CursorFollower } from './lazy'

/**
 * The two purely-additive chrome pieces, both lazily loaded: if either fails
 * to arrive, nothing breaks — navigation still works, the cursor is still the
 * native cursor.
 */
export function SiteChromeExtras() {
  return (
    <>
      <CursorFollower />
      <PageTransition />
    </>
  )
}
