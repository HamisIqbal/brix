import type { Metadata } from 'next'
import { contact } from '@/content/pages/rest'
import { business, fact } from '@/content/business'
import { form } from '@/content/form'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Support } from '@/components/ui/Headline'
import { Cross } from '@/components/ui/Marks'
import { Plate } from '@/components/media/Plate'
import { ContactForm } from '@/components/form/ContactForm'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import s from '@/components/sections/contact/contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Describe the job and we come back with a number. Estimates are free.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — BRIX',
    description: 'Describe the job and we come back with a number. Estimates are free.',
    url: '/contact',
  },
}

export default function ContactPage() {
  const email = fact(business.email)
  const serviceArea = fact(business.serviceArea)

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <Reveal id="contact-header">
        <Section id="contact-header" labelledBy="contact-heading">
          <div className="grid-content">
            <SectionHeader
              eyebrow={contact.eyebrow}
              headline={contact.headline}
              headingId="contact-heading"
              as="h1"
              scale="display-2"
            />
            <div className={s.support}>
              {contact.support.map((line) => (
                <Support key={line}>{line}</Support>
              ))}
            </div>
          </div>
        </Section>
      </Reveal>

      <Section id="contact-form" spacing="sm" course={false}>
        <div className={s.layout}>
          <div className={s.aside}>
            <Reveal id="contact-direct">
              <div className={s.direct}>
                <div className={s.directRow} data-reveal="meta">
                  <span className="label text-secondary">CALL</span>
                  <a href={`tel:${business.phone.raw}`} className={`${s.directValue} h2`}>
                    {business.phone.display}
                  </a>
                </div>
                {email && (
                  <div className={s.directRow} data-reveal="meta">
                    <span className="label text-secondary">EMAIL</span>
                    <a href={`mailto:${email}`} className={`${s.directValue} h3`}>
                      {email}
                    </a>
                  </div>
                )}
              </div>

              <div className={s.useful} data-reveal="meta">
                <span className="label text-secondary">{form.useful.heading}</span>
                <ul className={s.usefulList}>
                  {form.useful.items.map((item) => (
                    <li key={item} className={`${s.usefulItem} label`}>
                      <Cross />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={s.plate}>
                <Plate
                  id={contact.imageId}
                  ratio="4 / 5"
                  dir="left"
                  sizes="(min-width: 1024px) 30vw, (min-width: 600px) 420px, 100vw"
                  caption={false}
                />
              </div>
            </Reveal>
          </div>

          <div className={s.formColumn}>
            <ContactForm />

            <p className={`${s.conditions} label`}>
              <span>FREE ESTIMATES</span>
              <span>BRICK · BLOCK · STONE · CONCRETE</span>
              {serviceArea && <span>{serviceArea}</span>}
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
