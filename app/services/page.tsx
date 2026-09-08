import type { Metadata } from 'next'
import clsx from 'clsx'
import { servicesPage } from '@/content/pages/rest'
import { services } from '@/content/services'
import { cta } from '@/content/cta'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Headline, Mask, Support } from '@/components/ui/Headline'
import { Button } from '@/components/ui/Button'
import { Cross } from '@/components/ui/Marks'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Plate } from '@/components/media/Plate'
import { ElevationDiagram } from '@/components/sections/services/ElevationDiagram'
import { CourseFragment } from '@/components/sections/services/CourseFragment'
import { ServicesJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import s from '@/components/sections/services/services.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Brick first. Block, stone and concrete where the job calls for them. Free estimates.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — BRIX',
    description: 'Brick first. Block, stone and concrete where the job calls for them.',
    url: '/services',
  },
}

export default function ServicesPage() {
  return (
    <>
      <ServicesJsonLd />
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      <Reveal id="services-header">
        <Section id="services-header" labelledBy="services-heading">
          <div className="grid-content">
            <SectionHeader
              eyebrow={servicesPage.eyebrow}
              headline={servicesPage.headline}
              support={servicesPage.support}
              headingId="services-heading"
              as="h1"
              scale="display-2"
            />
          </div>
        </Section>
      </Reveal>

      <Section id="services-elevation" spacing="sm" course={false}>
        <div className={s.layout}>
          <div className={s.diagramColumn}>
            <ElevationDiagram label={servicesPage.elevationLabel} />
          </div>

          <div className={s.entries}>
            {services.map((service) => (
              <Reveal key={service.index} id={`service-${service.index}`}>
                <article
                  id={`service-${service.index}`}
                  className={clsx(s.entry, service.primary && s.entryPrimary)}
                  aria-labelledby={`service-heading-${service.index}`}
                >
                  <CourseFragment course={service.course} />

                  <div className={s.entryHead}>
                    <span className={clsx(s.entryIndex, 'label')}>{service.index}</span>
                    <h2
                      id={`service-heading-${service.index}`}
                      className={clsx(s.entryName, 'display-3')}
                    >
                      <Mask kind="line">{service.name}</Mask>
                    </h2>
                  </div>

                  <p className={clsx(s.entryStatement, 'h3')}>
                    <Mask kind="line">{service.statement}</Mask>
                  </p>

                  <Support className={s.entryDetail}>{service.detail}</Support>

                  {service.primary && (
                    <p className={clsx(s.primaryTag, 'label')} data-reveal="meta">
                      <Cross />
                      LEADS THE WORK
                    </p>
                  )}

                  <div className={s.entryPlate}>
                    <Plate
                      id={service.imageId}
                      ratio="4 / 3"
                      sizes="(min-width: 1024px) 380px, 100vw"
                      caption={false}
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Reveal id="services-close">
        <Section id="services-close" spacing="sm" course={false}>
          <div className={s.close}>
            <Headline lines={servicesPage.close.headline} scale="display-3" as="h2" />
            <Support className="text-secondary">{servicesPage.close.support}</Support>
            <MagneticButton>
              <Button href="/contact" tier="primary">
                {cta.estimate}
              </Button>
            </MagneticButton>
          </div>
        </Section>
      </Reveal>
    </>
  )
}
