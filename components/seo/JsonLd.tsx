import { site } from '@/content/site'
import { business, fact } from '@/content/business'
import { services } from '@/content/services'

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue }

function Script({ data }: { data: Record<string, JsonValue> }) {
  return (
    <script
      type="application/ld+json"
      // Values come from local content modules only — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const BUSINESS_ID = `${site.url}/#business`

/**
 * HomeAndConstructionBusiness — the specific type, not a bare LocalBusiness.
 * Every field is placeholder-guarded: an unsupplied fact is omitted from the
 * graph entirely. An invented address in structured data is worse than none.
 */
export function LocalBusinessJsonLd() {
  const serviceArea = fact(business.serviceArea)
  const address = fact(business.address)
  const hours = fact(business.hours)
  const instagram = fact(business.instagram)

  const data: Record<string, JsonValue> = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: business.phone.raw,
    email: business.email,
    priceRange: 'Free estimates',
    knowsAbout: services.map((s) => s.name),
  }

  if (serviceArea) data.areaServed = serviceArea
  if (address) data.address = address
  if (hours) data.openingHours = hours
  if (instagram) data.sameAs = [instagram]

  return <Script data={data} />
}

export function ServicesJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@graph': services.map((s) => ({
          '@type': 'Service',
          name: s.name,
          description: s.detail,
          serviceType: `${s.name} masonry`,
          provider: { '@id': BUSINESS_ID },
        })),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: readonly { name: string; path: string }[]
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${site.url}${item.path}`,
        })),
      }}
    />
  )
}
