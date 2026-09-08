'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { media } from '@/content/images'
import { site } from '@/content/site'
import { MenuOverlay, preloadChrome } from './lazy'
import { CourseCounter } from './ScrollInstruments'
import s from './chrome.module.css'

/**
 * The rail. There is no traditional navbar: a logo, a course counter and the
 * menu trigger, on a single hairline. Nothing else is fixed to the viewport
 * on desktop (§9.7).
 *
 * With the menu open the rail keeps nothing but its trigger — the overlay is
 * the whole ground, so logo, rule and counter step out of it.
 */
export function Chrome() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const close = useCallback(() => setOpen(false), [])

  // Warm the lazily-loaded chrome during the first idle period, so the menu
  // and the page cover are resident before a visitor can reach them.
  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 300)
    schedule(() => preloadChrome())
  }, [])

  // A route change always closes the menu, whatever caused the navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <header className={clsx(s.rail, open && s.railOverMenu)}>
        <Link href="/" className={s.logo} aria-label={`${site.name} — home`}>
          <Image
            src={media.brixLogo}
            alt=""
            height={56}
            priority
            sizes="(min-width: 768px) 152px, 126px"
          />
        </Link>

        <div className={s.railRight}>
          <CourseCounter />

          <button
            type="button"
            className={clsx(s.trigger, open && s.triggerOpen)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={clsx(s.triggerLabel, 'label')} aria-hidden="true">
              <span
                className={clsx(
                  s.triggerLabelText,
                  open ? s.triggerLabelOut : s.triggerLabelActive,
                )}
              >
                MENU
              </span>
              <span
                className={clsx(
                  s.triggerLabelText,
                  open ? s.triggerLabelActive : s.triggerLabelIn,
                )}
              >
                CLOSE
              </span>
            </span>
            <span className={s.mark} aria-hidden="true">
              <span className={clsx(s.bar, s.bar1)} />
              <span className={clsx(s.bar, s.bar2)} />
              <span className={clsx(s.bar, s.bar3)} />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={close} />
    </>
  )
}
