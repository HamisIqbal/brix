'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { media } from '@/content/images'
import { useMotion } from '@/components/motion/MotionProvider'
import { Apex } from '@/components/ui/Apex'
import s from './home.module.css'

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

/**
 * A video plate: the poster is server-rendered and is the JS-free state, and
 * the video is created after first paint, never on the critical path.
 *
 * Every failure path degrades to "the video didn't arrive", never to a broken
 * plate: autoplay refused shows a labelled play control, reduced motion and
 * save-data never create the element at all.
 */
export function SiteVideo({ caption, className }: { caption: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [needsGesture, setNeedsGesture] = useState(false)
  const { reducedMotion } = useMotion()

  // Mount after first paint, and only when the device is willing.
  useEffect(() => {
    if (reducedMotion) return

    const nav = navigator as NavigatorWithHints
    if (nav.connection?.saveData) return
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return

    const schedule =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 0)

    const handle = schedule(() => setMounted(true))
    return () => {
      if (typeof window.cancelIdleCallback === 'function' && typeof handle === 'number') {
        window.cancelIdleCallback(handle)
      }
    }
  }, [reducedMotion])

  // Pause offscreen and when the tab is hidden. A nonessential loop running
  // out of view is a battery cost with no benefit.
  useEffect(() => {
    if (!mounted) return
    const el = containerRef.current
    const video = videoRef.current
    if (!el || !video) return

    let inView = true
    const sync = () => {
      if (inView && !document.hidden) void video.play().catch(() => {})
      else video.pause()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false
        sync()
      },
      { threshold: 0.05 },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', sync)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [mounted, ready])

  const onCanPlay = () => {
    setReady(true)
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => setNeedsGesture(true))
  }

  return (
    <div ref={containerRef} className={clsx(s.plate, className)}>
      <Image
        src={media.heroPoster}
        alt=""
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        quality={80}
        className={s.platePoster}
      />

      {mounted && (
        <video
          ref={videoRef}
          className={`${s.plateMedia} ${ready ? s.plateMediaReady : ''}`}
          src={media.heroVideo}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={onCanPlay}
        />
      )}

      <span className={s.plateScrim} aria-hidden="true" />

      <span className={`${s.plateCaption} label`}>{caption}</span>

      {needsGesture && (
        <button
          type="button"
          className={`${s.playButton} btn-label`}
          onClick={() => {
            void videoRef.current?.play()
            setNeedsGesture(false)
          }}
        >
          <Apex size={14} direction="right" />
          Play video
        </button>
      )}
    </div>
  )
}
