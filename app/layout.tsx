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

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
    >
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
