import Link from 'next/link'
import clsx from 'clsx'
import { Apex } from './Apex'
import s from './ui.module.css'

type Tier = 'primary' | 'secondary' | 'ghost'

type CommonProps = {
  children: React.ReactNode
  tier?: Tier
  className?: string
  fullWidth?: boolean
  /** Ghost tier gets no chevron unless asked. */
  icon?: boolean
}

type LinkProps = CommonProps & { href: string; type?: never; onClick?: never; disabled?: never }
type ButtonProps = CommonProps & {
  href?: never
  type?: 'button' | 'submit'
  disabled?: boolean
}

/**
 * Server-rendered shell. Every state is CSS — hover moves a line, never the
 * element (§7.1). Wrapped in <MagneticButton> by the caller when it is primary.
 */
export function Button(props: LinkProps | ButtonProps) {
  const { children, tier = 'primary', className, fullWidth, icon = true } = props

  const cls = clsx(
    s.btn,
    'btn-label',
    tier === 'primary' && s.primary,
    tier === 'secondary' && s.secondary,
    tier === 'ghost' && s.ghost,
    fullWidth && s.fullWidth,
    className,
  )

  const inner = (
    <>
      {tier === 'ghost' ? (
        <span className={s.ghostRules} aria-hidden="true">
          <span className={s.ghostRest} />
          <span className={s.ghostHover} />
        </span>
      ) : (
        <span className={s.fill} aria-hidden="true" />
      )}
      <span className={s.label} data-magnet-label>
        {children}
      </span>
      {icon && <Apex size={12} direction="right" className={s.icon} />}
    </>
  )

  if ('href' in props && props.href) {
    const external = props.href.startsWith('tel:') || props.href.startsWith('mailto:')
    if (external) {
      return (
        <a href={props.href} className={cls}>
          {inner}
        </a>
      )
    }
    return (
      <Link href={props.href} className={cls}>
        {inner}
      </Link>
    )
  }

  const { type = 'button', disabled } = props as ButtonProps
  return (
    <button type={type} disabled={disabled} className={cls}>
      {inner}
    </button>
  )
}
