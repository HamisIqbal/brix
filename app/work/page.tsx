import type { Metadata } from 'next'
import Link from 'next/link'
import { work } from '@/content/pages/rest'
import { projects } from '@/content/projects'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Plate } from '@/components/media/Plate'
import { WorkLedger } from '@/components/sections/work/WorkLedger'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import s from '@/components/sections/work/ledger.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Brick, block, stone and concrete work, photographed on site.',
  alternates: { canonical: '/work' },
  openGraph: { title: 'Work — BRIX', description: 'Work photographed on site.', url: '/work' },
}

export default function WorkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ]}
      />

      <Reveal id="work-header">
        <Section id="work-header" labelledBy="work-heading">
          <div className="grid-content">
            <SectionHeader
              eyebrow={work.eyebrow}
              headline={work.headline}
              support={work.support}
              headingId="work-heading"
              as="h1"
              scale="display-2"
            />
          </div>
        </Section>
      </Reveal>

      <Reveal id="work-ledger">
        <Section id="work-ledger" spacing="sm" course={false}>
          <div className="grid-content">
            <WorkLedger projects={projects} />
          </div>
        </Section>
      </Reveal>

      <Reveal id="work-plates">
        <Section id="work-plates" spacing="sm" course={false}>
          <div className="grid-content">
            <div className={s.plateGrid}>
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className={s.plateLink}
                  data-cursor="view"
                >
                  <Plate
                    id={project.imageId}
                    ratio="4 / 5"
                    interactive
                    framed
                    sizes="(min-width: 1024px) 30vw, (min-width: 600px) 45vw, 100vw"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Section>
      </Reveal>
    </>
  )
}
