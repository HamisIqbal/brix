import type { Metadata } from 'next'
import { Reveal } from '@/components/motion/Reveal'
import { CourseHero } from '@/components/sections/home/CourseHero'
import { CourseArgument } from '@/components/sections/home/CourseArgument'
import { CourseCapabilities } from '@/components/sections/home/CourseCapabilities'
import { CourseSelected } from '@/components/sections/home/CourseSelected'
import { CourseMethod } from '@/components/sections/home/CourseMethod'
import { CourseMaterial } from '@/components/sections/home/CourseMaterial'
import { CourseEstimate } from '@/components/sections/home/CourseEstimate'
import { SpecStrip } from '@/components/sections/home/SpecStrip'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: `${site.name} — ${site.taglineShort}`,
  description: site.description,
  alternates: { canonical: '/' },
}

/**
 * The page file is a manifest, not a component: it orders courses and does
 * nothing else. Every section below is a Server Component; only the thin
 * <Reveal> wrappers ship JavaScript.
 */
export default function HomePage() {
  return (
    <>
      <CourseHero />
      <Reveal id="home-argument">
        <CourseArgument />
      </Reveal>
      <Reveal id="home-capabilities">
        <CourseCapabilities />
      </Reveal>
      <Reveal id="home-selected">
        <CourseSelected />
      </Reveal>
      <Reveal id="home-method">
        <CourseMethod />
      </Reveal>
      <SpecStrip />
      <Reveal id="home-material">
        <CourseMaterial />
      </Reveal>
      <Reveal id="home-estimate">
        <CourseEstimate />
      </Reveal>
    </>
  )
}
