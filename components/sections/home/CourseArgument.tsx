import { home } from '@/content/pages/home'
import { cta } from '@/content/cta'
import { Section } from '@/components/layout/Section'
import { Parallax } from '@/components/motion/Parallax'
import { Plate } from '@/components/media/Plate'
import { Eyebrow } from '@/components/ui/Marks'
import { Headline, Support } from '@/components/ui/Headline'
import { Button } from '@/components/ui/Button'
import s from './home.module.css'

/** COURSE 02 — The Argument. Three words at display scale carry the section. */
export function CourseArgument() {
  const { argument } = home

  return (
    <Section id="course-02" labelledBy="argument-heading" className={s.argument}>
      <div className={s.argumentInner}>
        <Parallax id="argument-plate" amount={0.06}>
          <Plate
            id={argument.imageId}
            ratio="3 / 4"
            dir="left"
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 70vw, 100vw"
          />
        </Parallax>

        <div className={s.argumentCopy}>
          <Eyebrow index={argument.eyebrow.index} label={argument.eyebrow.label} />
          <Headline
            lines={argument.headline}
            scale="display-3"
            as="h2"
            id="argument-heading"
          />
          <div className={s.argumentBody}>
            {argument.body.map((line) => (
              <Support key={line}>{line}</Support>
            ))}
          </div>
          <div className={s.argumentActions} data-reveal="meta">
            <Button href="/services" tier="ghost">
              {cta.services}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
