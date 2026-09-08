import clsx from 'clsx'

type SectionProps = {
  children: React.ReactNode
  id: string
  /** Sections tagged as courses feed the rail's course counter. */
  course?: boolean
  labelledBy?: string
  spacing?: 'default' | 'sm' | 'lg' | 'flush'
  className?: string
}

/**
 * Every page section: one <section>, one id, one accessible name.
 * Spacing comes from the token scale — full-bleed image sections get zero
 * vertical padding because that is what stacking courses do (§3.6).
 */
export function Section({
  children,
  id,
  course = true,
  labelledBy,
  spacing = 'default',
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      data-course={course ? '' : undefined}
      aria-labelledby={labelledBy}
      className={clsx(
        'section',
        spacing === 'sm' && 'section--sm',
        spacing === 'lg' && 'section--lg',
        spacing === 'flush' && 'section--flush',
        'page-grid',
        className,
      )}
    >
      {children}
    </section>
  )
}
