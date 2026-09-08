'use client'

import { useEffect, useState } from 'react'
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
 * the same image whether or not the loop ever starts. Reduced motion holds on
 * that first plate and nothing cycles.
 */
export function HeroBackdrop() {
  const [index, setIndex] = useState(0)
  const { reducedMotion } = useMotion()

  useEffect(() => {
    if (reducedMotion || PLATES.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PLATES.length)
    }, HOLD)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  const previous = (index - 1 + PLATES.length) % PLATES.length

  return (
    <div className={s.backdrop} data-hero="plate" aria-hidden="true">
      <div className={s.backdropStack}>
        {PLATES.map((id, i) => {
          const image = getImage(id)
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
                loading={i === 0 ? undefined : 'lazy'}
                sizes="100vw"
                quality={80}
                className={s.backdropImage}
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
