import { home } from '@/content/pages/home'
import { projects } from '@/content/projects'
import { getImage } from '@/content/images'
import { cta } from '@/content/cta'
import { Section } from '@/components/layout/Section'
import { Plate } from '@/components/media/Plate'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { WorkLedger } from '@/components/sections/work/WorkLedger'
import s from './home.module.css'

/** COURSE 04 — Selected. A featured full-bleed plate, then three ledger rows. */
export function CourseSelected() {
  const { selected } = home
  const featured = getImage(selected.featuredImageId)
  const ledgerIndices: readonly string[] = selected.ledgerSlugs
  const rows = projects.filter((p) => ledgerIndices.includes(p.index))

  return (
    <Section id="course-04" labelledBy="selected-heading">
      <div className="grid-content">
        <SectionHeader
          eyebrow={selected.eyebrow}
          headline={selected.headline}
          support={selected.support}
          headingId="selected-heading"
          scale="display-3"
        />
      </div>

      <div className={s.featured}>
        <Plate
          id={selected.featuredImageId}
          sizes="100vw"
          dir="bottom"
          caption={false}
          maskClassName={s.featuredMask}
        />
        <div className={`${s.featuredOverlay} label`}>
          <span className="text-primary">{featured.title}</span>
          <span className="text-secondary">{featured.spec}</span>
        </div>
      </div>

      <div className="grid-content" style={{ marginTop: 'var(--space-16)' }}>
        <WorkLedger projects={rows} />
        <div style={{ marginTop: 'var(--space-10)' }} data-reveal="meta">
          <Button href="/work" tier="secondary">
            {cta.work}
          </Button>
        </div>
      </div>
    </Section>
  )
}
