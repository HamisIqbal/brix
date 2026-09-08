import { Fragment } from 'react'
import { home } from '@/content/pages/home'
import { business } from '@/content/business'
import { cta } from '@/content/cta'
import { Section } from '@/components/layout/Section'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Button } from '@/components/ui/Button'
import { Apex } from '@/components/ui/Apex'
import { Mask } from '@/components/ui/Headline'
import { HeroTimeline } from './HeroTimeline'
import { HeroBackdrop } from './HeroBackdrop'
import s from './home.module.css'

/**
 * COURSE 01 — "The First Course".
 * Server Component. The entrance is a client wrapper; the markup ships as HTML,
 * so the LCP element (the headline) is real text present from the first byte.
 * The photographs behind it are the ground, laid one over the next.
 */
export function CourseHero() {
  const { hero } = home

  return (
    <Section id="course-01" labelledBy="hero-heading" spacing="flush" className={s.hero}>
      <HeroTimeline>
        <HeroBackdrop />

        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <h1 id="hero-heading" className={`${s.heroHeadline} display-1`}>
              {hero.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && ' '}
                  <Mask hero="line">{line}</Mask>
                </Fragment>
              ))}
            </h1>

            <p className={`${s.heroSub} body-lg`}>
              <Mask hero="sub">{hero.sub}</Mask>
            </p>

            <div className={s.heroActions} data-hero="strip">
              <MagneticButton>
                <Button href="/contact" tier="primary">
                  {cta.estimate}
                </Button>
              </MagneticButton>
              <Button href="/work" tier="secondary">
                {cta.work}
              </Button>
              <span className={`${s.heroNote} label`}>{cta.note}</span>
            </div>

            <div className={`${s.heroStrip} label`} data-hero="strip">
              {hero.strip.map((item) => (
                <span key={item}>{item}</span>
              ))}
              <a href={`tel:${business.phone.raw}`}>{business.phone.display}</a>
            </div>
          </div>
        </div>

        <div className={`${s.cue} ${s.cueActive} label`} data-hero="cue" aria-hidden="true">
          <span className={s.cueStack}>
            <span className={s.cueBar} />
            <span className={s.cueBar} />
            <span className={s.cueBar} />
          </span>
          <Apex size={12} direction="down" />
          <span>{hero.cue}</span>
        </div>
      </HeroTimeline>
    </Section>
  )
}
