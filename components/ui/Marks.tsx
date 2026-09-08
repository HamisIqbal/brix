import clsx from 'clsx'
import s from './ui.module.css'

/** D3 — the rule. Drawn scaleX(0->1) from the left when inside a Reveal. */
export function Rule({
  tone = 'hair',
  reveal = false,
  className,
}: {
  tone?: 'hair' | 'struct' | 'red'
  reveal?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      data-reveal={reveal ? 'rule' : undefined}
      className={clsx(
        s.rule,
        tone === 'red' && s.ruleRed,
        tone === 'struct' && s.ruleStruct,
        className,
      )}
    />
  )
}

/** D5 — the cross. Registration mark. Max 4 per viewport. */
export function Cross({ className }: { className?: string }) {
  return <span aria-hidden="true" className={clsx(s.cross, className)} />
}

/** Mono label, optionally prefixed with an index or a red cross. */
export function Label({
  children,
  index,
  cross = false,
  className,
}: {
  children: React.ReactNode
  index?: string
  cross?: boolean
  className?: string
}) {
  return (
    <span className={clsx('label', className)}>
      {cross && <Cross className="inline-block align-middle mr-2" />}
      {index && <span className="text-red">{index}&nbsp;/&nbsp;</span>}
      {children}
    </span>
  )
}

/** The eyebrow: a red rule that draws, over a mono label. */
export function Eyebrow({
  index,
  label,
  className,
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <div className={clsx(s.eyebrow, className)}>
      <span aria-hidden="true" data-reveal="rule" className={s.eyebrowRule} />
      <span className={clsx(s.eyebrowLabel, 'label')} data-reveal="meta">
        <Cross />
        <span>
          {index} / {label}
        </span>
      </span>
    </div>
  )
}
