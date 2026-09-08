'use client'

import { forwardRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { getImage, type ImageId } from '@/content/images'
import s from './ledger.module.css'

type PreviewProps = {
  imageId: ImageId | null
  spec: string | null
}

/**
 * The cursor-following plate. A pointer-only enhancement, lazily loaded, so
 * Framer Motion never reaches the initial bundle. It never fires on keyboard
 * focus: the row's focus ring and its destination carry the same information.
 */
export const ProjectPreview = forwardRef<HTMLDivElement, PreviewProps>(
  function ProjectPreview({ imageId, spec }, ref) {
    const image = imageId ? getImage(imageId) : null

    return (
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence>
          {image && (
            <m.div
              ref={ref}
              className={s.preview}
              aria-hidden="true"
              initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{
                clipPath: 'inset(0% 0% 0% 0%)',
                transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                clipPath: 'inset(0% 0% 100% 0%)',
                transition: { duration: 0.19, ease: [0.65, 0, 0.35, 1] },
              }}
            >
              <div className={s.previewInner}>
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="240px"
                  quality={65}
                  className={s.previewImg}
                />
              </div>
              {spec && <div className={`${s.previewSpec} label`}>{spec}</div>}
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    )
  },
)
