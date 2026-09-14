'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { getImage, type ImageId } from '@/content/images'
import { useMotion } from '@/components/motion/MotionProvider'
import s from './home.module.css'

/** The three plates that carry the first course, in order. */
const PLATES: readonly ImageId[] = ['10', '05', '09']

/** One plate holds for this long before the next is laid over it. */
const HOLD = 5200

/**
 * The hero ground: one photograph at a time, the next sliding in from the
 * right and setting over the last — a course being laid, not a crossfade.
 *
 * The first plate is server-priority and never moves, so the LCP candidate is
 * the same image whether or not the loop ever starts. The others are only
 * requested once the page has finished loading (they sit off-canvas inside a
 * clipped box, where native lazy-loading would not fetch them until they were
 * already sliding in), and the loop never advances onto a plate that has not
 * decoded — so a slow connection holds the current photograph instead of
 * sliding in an empty black frame. Reduced motion holds on the first plate.
 */
export function HeroBackdrop() {
  const [index, setIndex] = useState(0)
  const [armed, setArmed] = useState(false)
  const loaded = useRef<boolean[]>(PLATES.map((_, i) => i === 0))
  const { reducedMotion } = useMotion()

  // Request the remaining plates once the page itself has loaded, so they
  // never compete with the first plate, the fonts or the page's own scripts.
  useEffect(() => {
    if (reducedMotion) return
    const arm = () => setArmed(true)
    if (document.readyState === 'complete') {
      const t = window.setTimeout(arm, 400)
      return () => window.clearTimeout(t)
    }
    window.addEventListener('load', arm, { once: true })
    return () => window.removeEventListener('load', arm)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !armed || PLATES.length < 2) return
    const id = window.setInterval(() => {
      // A hidden tab keeps its place rather than racing through the loop.
      if (document.hidden) return
      setIndex((i) => {
        const next = (i + 1) % PLATES.length
        return loaded.current[next] ? next : i
      })
    }, HOLD)
    return () => window.clearInterval(id)
  }, [reducedMotion, armed])

  const previous = (index - 1 + PLATES.length) % PLATES.length

  return (
    <div className={s.backdrop} data-hero="plate" aria-hidden="true">
      <div className={s.backdropStack}>
        {PLATES.map((id, i) => {
          const image = getImage(id)
          if (i > 0 && !armed) return null
          return (
            <div
              key={id}
              className={clsx(
                s.backdropSlide,
                i === index && s.backdropSlideActive,
                i === previous && index !== previous && s.backdropSlidePrev,
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : 'eager'}
                fetchPriority={i === 0 ? 'high' : 'low'}
                sizes="100vw"
                quality={80}
                className={s.backdropImage}
                onLoad={() => {
                  loaded.current[i] = true
                }}
              />
            </div>
          )
        })}
      </div>

      <span className={s.backdropOverlay} />

      <div className={s.backdropIndex}>
        {PLATES.map((id, i) => (
          <span key={id} className={clsx(s.backdropTick, i === index && s.backdropTickOn)} />
        ))}
      </div>

      <span className={clsx(s.backdropCaption, 'label')}>{getImage(PLATES[index]!).title}</span>
    </div>
  )
}
