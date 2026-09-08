import Link from 'next/link'
import { home } from '@/content/pages/home'
import { capabilities } from '@/content/services'
import { Section } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Marks'
import { Headline } from '@/components/ui/Headline'
import s from './home.module.css'

/**
 * COURSE 03 — What We Lay.
 * One band, six cells, mortar between them. It is literally a course of bricks,
 * which is why it cannot be mistaken for three feature cards.
 */
export function CourseCapabilities() {
  const { capabilities: copy } = home

  return (
    <Section id="course-03" labelledBy="capabilities-heading" spacing="sm">
      <div className="grid-content">
        <Eyebrow index={copy.eyebrow.index} label={copy.eyebrow.label} />
        <Headline
          lines={[copy.headline]}
          scale="h1"
          as="h2"
          id="capabilities-heading"
          className="mt-6 mb-10"
        />
      </div>

      <ul className={`${s.band} grid-full`} data-reveal="meta">
        {capabilities.map((item) => (
          <li key={item.name}>
            <Link href="/services" className={s.cell}>
              <span className={`${s.cellIndex} label`}>{item.index}</span>
              <span className={`${s.cellName} h2`}>{item.name}</span>
              <span className={`${s.cellSpec} label`}>{item.specLine}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
