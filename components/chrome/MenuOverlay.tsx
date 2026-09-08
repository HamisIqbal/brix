'use client'

import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import clsx from 'clsx'
import { site } from '@/content/site'
import { business, fact } from '@/content/business'
import { useMotion } from '@/components/motion/MotionProvider'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useIsDesktop } from '@/hooks/useMediaPreference'
import s from './chrome.module.css'

/**
 * LAY. Framer Motion owns presence; the interior courses are CSS transforms
 * driven by variants on the same tree — one owner per element (architecture §4.1).
 *
 * Desktop: five courses sweeping from alternating sides — the bond pattern
 * rendered in time. Mobile: three courses, all from the left (§6.7).
 */
export function MenuOverlay(props: { open: boolean; onClose: () => void }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MenuOverlayInner {...props} />
    </LazyMotion>
  )
}

function MenuOverlayInner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { lenis, reducedMotion } = useMotion()
  const isDesktop = useIsDesktop()

  useScrollLock(open, lenis)
  const handleEscape = useCallback(() => onClose(), [onClose])
  useFocusTrap(ref, open, handleEscape)

  const courseCount = isDesktop ? 5 : 3
  const courseDur = isDesktop ? 0.42 : 0.32
  const courseStagger = isDesktop ? 0.06 : 0.04

  const email = fact(business.email)
  const instagram = fact(business.instagram)

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          id="site-menu"
          className={s.overlay}
          style={{ ['--course-count' as string]: courseCount }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial="closed"
          animate="open"
          exit="closed"
          variants={{ open: {}, closed: {} }}
        >
          {Array.from({ length: courseCount }).map((_, i) => (
            <m.div
              key={i}
              className={s.course}
              variants={{
                closed: {
                  x: reducedMotion ? 0 : isDesktop && i % 2 === 1 ? '100%' : '-100%',
                  opacity: reducedMotion ? 0 : 1,
                },
                open: { x: '0%', opacity: 1 },
              }}
              transition={{
                duration: reducedMotion ? 0.16 : courseDur,
                delay: reducedMotion ? 0 : i * courseStagger,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          ))}

          <m.div
            className={s.overlayInner}
            variants={{
              closed: { opacity: reducedMotion ? 0 : 1 },
              open: { opacity: 1 },
            }}
          >
            <nav aria-label="Primary">
              <ul className={s.navList}>
                {site.nav.map((item, i) => {
                  const current = pathname === item.href
                  return (
                    <li key={item.href}>
                      <m.span
                        style={{ display: 'block' }}
                        variants={{
                          closed: {
                            clipPath: 'inset(0% 0% 100% 0%)',
                            y: '0.35em',
                            transition: {
                              duration: reducedMotion ? 0.12 : 0.18,
                              delay: reducedMotion ? 0 : (site.nav.length - 1 - i) * 0.03,
                              ease: [0.65, 0, 0.35, 1],
                            },
                          },
                          open: {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            y: 0,
                            transition: {
                              duration: reducedMotion ? 0.2 : 0.42,
                              delay: reducedMotion ? 0 : 0.42 + i * 0.06,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          aria-current={current ? 'page' : undefined}
                          className={clsx(s.navItem, current && s.navItemActive)}
                        >
                          <span className={clsx(s.navIndex, 'label')}>{item.index}</span>
                          <span className={clsx(s.navLabel, 'display-2')}>{item.label}</span>
                          <span className={s.navRule} aria-hidden="true" />
                        </Link>
                      </m.span>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <m.div
              className={clsx(s.overlayFoot, 'label')}
              variants={{
                closed: { opacity: 0, transition: { duration: 0.12 } },
                open: {
                  opacity: 1,
                  transition: { duration: reducedMotion ? 0.2 : 0.42, delay: reducedMotion ? 0 : 0.76 },
                },
              }}
            >
              <a href={`tel:${business.phone.raw}`}>CALL {business.phone.display}</a>
              {email && <a href={`mailto:${email}`}>{email.toUpperCase()}</a>}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  + INSTAGRAM
                </a>
              )}
            </m.div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
