import type { Metadata, Viewport } from 'next'
import { Archivo, Geist, Geist_Mono } from 'next/font/google'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { Chrome } from '@/components/chrome/Chrome'
import { SiteChromeExtras } from '@/components/chrome/SiteChromeExtras'
import { MobileActionBar } from '@/components/chrome/MobileActionBar'
import { SiteFooter } from '@/components/sections/shared/SiteFooter'
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd'
import { site } from '@/content/site'
import '@/styles/globals.css'

// Archivo is set condensed (wdth 62) everywhere it appears, and no system
// fallback can be metric-matched to a condensed face: with `swap` the hero
// headline painted wide in the fallback and then visibly jumped narrower.
// `block` holds the (preloaded, small) display face for its short block
// period instead, so the headline is only ever drawn once, in its real face.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'block',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.taglineShort}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.taglineShort}`,
    description: site.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

/**
 * Runs before first paint, blocking, in <head>. Three jobs:
 *  1. data-js — the CSS reveal states (styles/motion.css) apply from the very
 *     first frame, so nothing paints visible and is then hidden at hydration.
 *  2. data-hero-played — the hero entrance plays once per session.
 *  3. Failsafe — if the app has not taken over the motion states within 4s
 *     (script blocked, very slow device), release them so no content is ever
 *     left hidden. MotionProvider sets data-motion when it takes over.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.setAttribute('data-js','true');try{var k='brix:hero-played';if(sessionStorage.getItem(k)==='1'){d.setAttribute('data-hero-played','')}else{sessionStorage.setItem(k,'1');setTimeout(function(){d.setAttribute('data-hero-played','')},2500)}}catch(e){}setTimeout(function(){if(!d.hasAttribute('data-motion')){d.removeAttribute('data-js')}},4000)})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      // The boot script below stamps data-* attributes on <html> before
      // React hydrates; they are not React's to reconcile.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <MotionProvider>
          <Chrome />
          <SiteChromeExtras />

          <main id="main">{children}</main>

          <SiteFooter />
          <MobileActionBar />
        </MotionProvider>

        <LocalBusinessJsonLd />
      </body>
    </html>
  )
}
