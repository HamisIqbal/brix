'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { business } from '@/content/business'
import s from './chrome.module.css'

/**
 * The one permitted departure from "nothing else is fixed to the viewport"
 * (§9.7) — phone-first customers converting on a contractor site justify it.
 *
 * It LAYs up once, after the visitor commits to scrolling, and never animates
 * again. Nothing on this site reacts to scroll direction (motion system §16.4).
 */
export function MobileActionBar() {
  const [shown, setShown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shown) return
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) setShown(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [shown])

  return (
    <div
      ref={ref}
      className={clsx(s.mobileBar, 'btn-label')}
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms var(--ease-structural)',
      }}
    >
      <a href={`tel:${business.phone.raw}`} className={s.mobileBarItem}>
        CALL
      </a>
      <Link href="/contact" className={s.mobileBarItem}>
        FREE ESTIMATE
      </Link>
    </div>
  )
}
