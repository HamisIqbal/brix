import type { Metadata } from 'next'
import { about } from '@/content/pages/rest'
import { cta } from '@/content/cta'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Headline, Support } from '@/components/ui/Headline'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Plate } from '@/components/media/Plate'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import s from '@/components/sections/about/about.module.css'

export const metadata: Metadata = {
  title: 'About',
  description: 'Masonry is a trade. It is learned by laying, and it shows in the joint.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — BRIX',
    description: 'Masonry is a trade. It is learned by laying, and it shows in the joint.',
    url: '/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      <Reveal id="about-header">
        <Section id="about-header" labelledBy="about-heading">
          <div className="grid-content">
            <SectionHeader
              eyebrow={about.eyebrow}
              headline={about.headline}
              support={about.support}
              headingId="about-heading"
              as="h1"
              scale="display-2"
            />
          </div>
        </Section>
      </Reveal>

      <Reveal id="about-statement">
        <Section id="about-statement" labelledBy="statement-heading">
          <div className={s.statement}>
            <Headline
              lines={about.statement.headline}
              scale="display-3"
              as="h2"
              id="statement-heading"
            />
            <div className={s.prose}>
              {about.statement.body.map((line) => (
                <Support key={line}>{line}</Support>
              ))}
            </div>
          </div>
        </Section>
      </Reveal>

      <Section id="about-honesty" labelledBy="honesty-heading" spacing="flush" course>
        <Reveal id="about-honesty-plate" className={s.honestyPlate}>
          <Plate
            id={about.honesty.imageId}
            ratio="16 / 10"
            dir="bottom"
            sizes="100vw"
            caption
          />
        </Reveal>
        <Reveal id="about-honesty-copy" className={s.honestyCopy}>
          <div>
            <Headline
              lines={about.honesty.headline}
              scale="h1"
              as="h2"
              id="honesty-heading"
            />
            <div className={s.prose}>
              {about.honesty.body.map((line) => (
                <Support key={line}>{line}</Support>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Reveal id="about-standard">
        <Section id="about-standard" labelledBy="standard-heading">
          <div className={s.standard}>
            <Headline
              lines={about.standard.headline}
              scale="display-3"
              as="h2"
              id="standard-heading"
            />
            <ol className={s.standardList}>
              {about.standard.items.map((item) => (
                <li key={item.index} className={s.standardItem} data-reveal="meta">
                  <span className="label text-red">{item.index}</span>
                  <span className="h3">{item.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      </Reveal>

      <Reveal id="about-close">
        <Section id="about-close" spacing="sm" course={false}>
          <div className={s.close}>
            <Headline lines={about.close.headline} scale="display-2" as="h2" />
            <Support className="text-secondary">{about.close.support}</Support>
            <div className={s.closeActions}>
              <MagneticButton>
                <Button href="/contact" tier="primary">
                  {cta.estimate}
                </Button>
              </MagneticButton>
              <Button href="/work" tier="secondary">
                {cta.work}
              </Button>
            </div>
          </div>
        </Section>
      </Reveal>
    </>
  )
}
