import { home } from '@/content/pages/home'
import { Section } from '@/components/layout/Section'
import { Parallax } from '@/components/motion/Parallax'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Mask, Support } from '@/components/ui/Headline'
import { SiteVideo } from './SiteVideo'
import { StringLine } from './StringLine'
import s from './home.module.css'

/**
 * COURSE 05 — Method. Four stages, in the only order masonry allows,
 * threaded by a red string line that draws as you descend the section, held
 * against the site video — the work running, not a photograph of it.
 */
export function CourseMethod() {
  const { method } = home

  return (
    <Section id="course-05" labelledBy="method-heading">
      <div className={s.methodInner}>
        <div>
          <SectionHeader
            eyebrow={method.eyebrow}
            headline={method.headline}
            support={method.support}
            headingId="method-heading"
            scale="display-3"
          />

          <div className={s.steps} style={{ marginTop: 'var(--space-12)' }}>
            <StringLine />
            {method.steps.map((step) => (
              <div key={step.index} className={s.step}>
                <div className={s.stepHead}>
                  <span className={`${s.stepIndex} label`}>{step.index}</span>
                  <h3 className="h3">
                    <Mask kind="line">{step.title}</Mask>
                  </h3>
                </div>
                <Support className={s.stepBody} scale="body">
                  {step.body}
                </Support>
              </div>
            ))}
          </div>
        </div>

        <Parallax id="method-plate" amount={0.05}>
          <SiteVideo caption="ON SITE" className={s.methodVideo} />
        </Parallax>
      </div>
    </Section>
  )
}
