import { notFound as copy } from '@/content/pages/rest'
import { Section } from '@/components/layout/Section'
import { Headline } from '@/components/ui/Headline'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Section id="not-found" labelledBy="not-found-heading" spacing="lg" course={false}>
      <div
        className="grid-content"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', alignItems: 'flex-start' }}
      >
        <Headline lines={copy.headline} scale="display-2" as="h1" id="not-found-heading" />
        <p className="body-lg text-secondary">{copy.body}</p>
        <Button href="/" tier="secondary">
          {copy.cta}
        </Button>
      </div>
    </Section>
  )
}
