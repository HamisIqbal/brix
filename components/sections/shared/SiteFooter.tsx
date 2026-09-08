import Link from 'next/link'
import { site } from '@/content/site'
import { business, fact } from '@/content/business'
import { cta } from '@/content/cta'
import { footer } from '@/content/pages/rest'
import { Reveal } from '@/components/motion/Reveal'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Button } from '@/components/ui/Button'
import { Headline } from '@/components/ui/Headline'
import { FooterMonument } from './FooterMonument'
import s from './footer.module.css'

/**
 * Server Component. Only the monument's timeline is client-side.
 * No imagery, no four-column grid, no social icon row (§9.8).
 */
export function SiteFooter() {
  const email = fact(business.email)
  const instagram = fact(business.instagram)
  const year = new Date().getFullYear()

  return (
    <footer className={`${s.footer} page-grid`}>
      <Reveal id="footer" className="grid-content">
        <div className={s.upper}>
          <div className={s.cta}>
            <Headline lines={footer.headline} scale="display-3" as="h2" id="footer-heading" />
            <MagneticButton>
              <Button href="/contact" tier="primary">
                {cta.estimate}
              </Button>
            </MagneticButton>
            <span className="label text-secondary" data-reveal="meta">
              {cta.note}
            </span>
          </div>

          <div className={s.contact}>
            <div className={s.contactRow} data-reveal="meta">
              <span className={`${s.contactLabel} label`}>CALL</span>
              <a href={`tel:${business.phone.raw}`} className={`${s.contactValue} h2`}>
                {business.phone.display}
              </a>
            </div>

            {email && (
              <div className={s.contactRow} data-reveal="meta">
                <span className={`${s.contactLabel} label`}>EMAIL</span>
                <a href={`mailto:${email}`} className={`${s.contactValue} h3`}>
                  {email}
                </a>
              </div>
            )}

            <nav aria-label="Footer" className={`${s.footerNav} label`} data-reveal="meta">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  + INSTAGRAM
                </a>
              )}
            </nav>
          </div>
        </div>
      </Reveal>

      <div className="grid-full">
        <FooterMonument />
      </div>

      <div className="grid-content">
        <div className={`${s.legal} label`} data-legal>
          <span>{footer.legal}</span>
          <span>© {year}</span>
          <span>{footer.legalRight}</span>
        </div>
      </div>
    </footer>
  )
}
