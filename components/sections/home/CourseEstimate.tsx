import { home } from '@/content/pages/home'
import { business, fact } from '@/content/business'
import { form } from '@/content/form'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Support } from '@/components/ui/Headline'
import { Cross } from '@/components/ui/Marks'
import { ContactForm } from '@/components/form/ContactForm'
import s from './home.module.css'

/**
 * COURSE 07 — The Estimate. The form is the footing: the last course before
 * the foundation. Motion here only confirms input and reports state.
 */
export function CourseEstimate() {
  const { estimate } = home
  const email = fact(business.email)
  const serviceArea = fact(business.serviceArea)

  return (
    <Section id="course-07" labelledBy="estimate-heading">
      <div className={s.estimateInner}>
        <div className={s.estimateAside}>
          <SectionHeader
            eyebrow={estimate.eyebrow}
            headline={estimate.headline}
            headingId="estimate-heading"
            scale="display-3"
          />

          <div className={s.estimateBody}>
            {estimate.body.map((line) => (
              <Support key={line}>{line}</Support>
            ))}
          </div>

          <div className={s.estimateDirect} data-reveal="meta">
            <div>
              <span className="label text-secondary">CALL</span>
              <p className="h3">
                <a href={`tel:${business.phone.raw}`}>{business.phone.display}</a>
              </p>
            </div>
            {email && (
              <div>
                <span className="label text-secondary">EMAIL</span>
                <p className="body">
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>
            )}
          </div>

          <div className="label" data-reveal="meta">
            <span className="text-secondary">
              FREE ESTIMATES &nbsp;·&nbsp; BRICK · BLOCK · STONE · CONCRETE
              {serviceArea ? ` · ${serviceArea}` : ''}
            </span>
          </div>
        </div>

        <div>
          <ContactForm />

          <div className={`${s.estimateBody} ${''}`} style={{ marginTop: 'var(--space-10)' }}>
            <div className="label" data-reveal="meta">
              <span className="text-secondary">{form.useful.heading}</span>
              <ul style={{ marginTop: 'var(--space-3)', display: 'grid', gap: 'var(--space-2)' }}>
                {form.useful.items.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Cross />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
