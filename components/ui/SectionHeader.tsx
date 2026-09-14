import clsx from 'clsx'
import { Eyebrow } from './Marks'
import { Headline, Support } from './Headline'
import s from './ui.module.css'

/**
 * The fixed three-part section header used identically on every page
 * (visual design system §9.4): eyebrow, header at columns 1-6,
 * support at columns 8-12.
 */
export function SectionHeader({
  eyebrow,
  headline,
  support,
  headingId,
  as = 'h2',
  scale = 'h1',
  className,
}: {
  eyebrow: { index: string; label: string }
  headline: readonly string[]
  support?: string
  headingId?: string
  as?: 'h1' | 'h2'
  scale?: 'display-2' | 'display-3' | 'h1'
  className?: string
}) {
  return (
    <div className={clsx(s.sectionHeaderWrap, className)}>
      <div className={s.sectionHeader}>
        <div className={s.sectionHeaderMain}>
          <Eyebrow index={eyebrow.index} label={eyebrow.label} />
          <Headline lines={headline} scale={scale} as={as} id={headingId} />
        </div>
        {support && (
          <div className={s.sectionHeaderSupport}>
            <Support>{support}</Support>
          </div>
        )}
      </div>
    </div>
  )
}
