'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '70svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'var(--space-8)',
        paddingInline: 'var(--margin)',
        alignItems: 'flex-start',
      }}
    >
      <h1 className="display-2">SOMETHING
        <br />
        GAVE WAY
      </h1>
      <p className="body-lg text-secondary">
        The page did not load. Try again, or call 901-295-6537.
      </p>
      <button type="button" className="btn-label" onClick={reset} style={{ color: 'var(--brix-red)' }}>
        TRY AGAIN
      </button>
    </div>
  )
}
