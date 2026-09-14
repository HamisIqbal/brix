import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, getProject, getAdjacentProject } from '@/content/projects'
import { getImage } from '@/content/images'
import { cta } from '@/content/cta'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { Plate } from '@/components/media/Plate'
import { Headline, Support } from '@/components/ui/Headline'
import { Label } from '@/components/ui/Marks'
import { Button } from '@/components/ui/Button'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import s from '@/components/sections/work/ledger.module.css'

type Params = { params: Promise<{ slug: string }> }

// Static export: only the listed projects exist; anything else is the 404 page.
export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project not found' }

  const title = project.title
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase())

  return {
    title,
    description: project.body,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${title} — BRIX`, description: project.body, url: `/work/${project.slug}` },
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const next = getAdjacentProject(slug)
  const image = getImage(project.imageId)

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: project.title, path: `/work/${project.slug}` },
        ]}
      />

      <Reveal id={`project-${project.slug}`}>
        <Section id="project-header" labelledBy="project-heading">
          <div className="grid-content">
            <div className={s.projectHead}>
              <div>
                <Label className="text-red">{project.index}</Label>
                <Headline
                  lines={project.title.split(', ')}
                  scale="display-3"
                  as="h1"
                  id="project-heading"
                  className="mt-6"
                />
              </div>

              <div className={s.projectMeta} data-reveal="meta">
                <div>
                  <span className="label">CATEGORY</span>
                  <p className="h3 text-primary">
                    {project.category}
                    {project.categorySecondary ? ` / ${project.categorySecondary}` : ''}
                  </p>
                </div>
                <div>
                  <span className="label">SPEC</span>
                  <p className="label text-primary">{project.spec}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-12)', maxWidth: 'var(--measure-lead)' }}>
              <Support className={s.projectBody}>{project.body}</Support>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal id={`project-plate-${project.slug}`}>
        <Section id="project-plate" spacing="sm" course={false}>
          <div className="grid-content">
            <Plate
              id={project.imageId}
              ratio={image.orientation === 'portrait' ? '3 / 4' : '3 / 2'}
              dir="bottom"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </Section>
      </Reveal>

      <Reveal id={`project-next-${project.slug}`}>
        <Section id="project-next" spacing="sm" course={false}>
          <div className="grid-content">
            <div className={s.projectFoot}>
              <Button href={`/work/${next.slug}`} tier="ghost">
                {cta.next}
              </Button>
              <Button href="/contact" tier="secondary">
                {cta.estimate}
              </Button>
              <span className="label text-secondary">{next.title}</span>
            </div>
          </div>
        </Section>
      </Reveal>
    </>
  )
}
