import { home } from '@/content/pages/home'
import type { ImageId } from '@/content/images'
import { Section } from '@/components/layout/Section'
import { Plate } from '@/components/media/Plate'
import { SectionHeader } from '@/components/ui/SectionHeader'
import s from './home.module.css'

/**
 * COURSE 06 — Material. The diptych is the only place two images animate at
 * once, permitted because they are one composition: the plates open from
 * opposite outer edges toward the joint between them.
 */
export function CourseMaterial() {
  const { material } = home
  const [left, right] = material.pair as readonly [ImageId, ImageId]

  return (
    <Section id="course-06" labelledBy="material-heading">
      <div className="grid-content">
        <SectionHeader
          eyebrow={material.eyebrow}
          headline={material.headline}
          support={material.body}
          headingId="material-heading"
          scale="display-3"
        />
      </div>

      <div className={s.diptych}>
        <Plate
          id={left}
          ratio="4 / 5"
          dir="left"
          interactive
          sizes="(min-width: 768px) 45vw, 100vw"
        />
        <Plate
          id={right}
          ratio="4 / 5"
          dir="right"
          interactive
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>
    </Section>
  )
}
