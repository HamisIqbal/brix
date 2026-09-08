import Image from 'next/image'
import clsx from 'clsx'
import { getImage, type ImageId } from '@/content/images'
import { Cross } from '@/components/ui/Marks'
import s from './plate.module.css'

type MaskDir = 'top' | 'bottom' | 'left' | 'right'

type PlateProps = {
  id: ImageId
  /** Aspect ratio of the crop box. Portrait sources get tall panels (§5.2). */
  ratio?: string
  /** Responsive sizes — one per treatment, never a generic string. */
  sizes: string
  priority?: boolean
  caption?: boolean
  framed?: boolean
  interactive?: boolean
  dir?: MaskDir
  reveal?: boolean
  className?: string
  maskClassName?: string
}

/**
 * Every image on the site is a Plate. Server Component: the reveal is CSS,
 * released by an ancestor <Reveal>, so no image ships JavaScript.
 *
 * The originals are untouched — statically imported so next/image derives
 * intrinsic dimensions (CLS 0) and emits AVIF/WebP.
 */
export function Plate({
  id,
  ratio,
  sizes,
  priority = false,
  caption = true,
  framed = false,
  interactive = false,
  dir,
  reveal = true,
  className,
  maskClassName,
}: PlateProps) {
  const image = getImage(id)
  const fallbackRatio = image.orientation === 'portrait' ? '3 / 4' : '3 / 2'

  return (
    <figure className={clsx(s.figure, className)}>
      <div
        className={clsx(s.mask, framed && s.framed, interactive && s.interactive, maskClassName)}
        style={{ aspectRatio: ratio ?? fallbackRatio }}
        data-reveal={reveal ? 'plate' : undefined}
        data-dir={dir}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          quality={78}
          placeholder="empty"
          className={s.img}
          data-plate-img=""
        />
        <span className={s.grain} aria-hidden="true" />
        {interactive && <Cross className={s.cross} />}
      </div>

      {caption && (
        <figcaption className={clsx(s.caption, 'label')} data-reveal="meta">
          <span className={s.captionTitle}>{image.title}</span>
          <span>{image.spec}</span>
        </figcaption>
      )}
    </figure>
  )
}
