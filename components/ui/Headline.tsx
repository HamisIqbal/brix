import { Fragment } from 'react'
import clsx from 'clsx'
import s from './ui.module.css'

type Scale = 'display-1' | 'display-2' | 'display-3' | 'h1' | 'h2' | 'h3'

/**
 * The text aperture.
 *
 * The mask is a fixed `overflow: hidden` box and the content translates inside
 * it — the motion system's model exactly ("the mask never moves; the content
 * moves"), and the only animated property is `transform`.
 *
 * Text animates `transform` only. Plates keep clip-path: a div with a
 * background composites it cheaply, whereas animating a clip on live text is
 * both more expensive and harder to keep pixel-stable at these sizes.
 */
export function Mask({
  children,
  kind = 'line',
  hero,
  className,
}: {
  children: React.ReactNode
  kind?: 'line' | 'body'
  /** The hero runs its own authored timeline, but uses the same aperture. */
  hero?: 'line' | 'sub'
  className?: string
}) {
  return (
    <span className={clsx(s.mask, className)}>
      <span
        className={s.maskInner}
        data-reveal={hero ? undefined : kind}
        data-hero={hero}
      >
        {children}
      </span>
    </span>
  )
}

/**
 * Headlines are authored as line arrays in content — line breaks are content
 * decisions, not layout accidents (content deck §0.4). Each line is its own
 * aperture, so line reveal needs no runtime DOM splitting.
 */
export function Headline({
  lines,
  scale = 'display-3',
  as: Tag = 'h2',
  id,
  className,
}: {
  lines: readonly string[]
  scale?: Scale
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
}) {
  return (
    <Tag id={id} className={clsx(scale, s.lineWrap, className)}>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {/* A text node between the block lines, so the accessible name and
              any text extraction read "STRUCTURE IN BRICK", not the two lines
              run together. Whitespace between blocks collapses visually. */}
          {i > 0 && ' '}
          <Mask kind="line">{line}</Mask>
        </Fragment>
      ))}
    </Tag>
  )
}

/** Supporting copy: a single aperture, never split into lines or words. */
export function Support({
  children,
  className,
  scale = 'body-lg',
  as: Tag = 'p',
}: {
  children: React.ReactNode
  className?: string
  scale?: 'body-lg' | 'body' | 'h3'
  as?: 'p' | 'div'
}) {
  return (
    <Tag className={clsx(scale, className)}>
      <Mask kind="body">{children}</Mask>
    </Tag>
  )
}
