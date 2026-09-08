/**
 * D4 — the apex. The logo chevron as pure geometry: two strokes meeting at a
 * point. 18deg at large scale; 30deg at icon scale, the one sanctioned optical
 * correction in the system (§4.3).
 */
type ApexProps = {
  size?: number
  direction?: 'up' | 'down' | 'right'
  strokeWidth?: number
  className?: string
}

const ROTATION = { up: 0, right: 90, down: 180 } as const

export function Apex({ size = 12, direction = 'right', strokeWidth = 2, className }: ApexProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ transform: `rotate(${ROTATION[direction]}deg)` }}
    >
      <path
        d="M4 16 L12 8 L20 16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  )
}
