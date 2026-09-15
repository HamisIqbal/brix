export const site = {
  name: 'BRIX Masonry & Concrete',
  shortName: 'BRIX',
  tagline: 'Professional Masonry & Concrete · Brick · Block · Custom Work · Free Estimates',
  taglineShort: 'Brick · Block · Concrete',
  description: 'Brick masonry, block and concrete work. Free estimates.',
  /**
   * The production origin, no trailing slash. Used for canonical links,
   * Open Graph and the sitemap — set it before the deploy build, either here
   * or with NEXT_PUBLIC_SITE_URL in .env.production.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://brixmasonrytn.com').replace(/\/+$/, ''),
  nav: [
    { index: '01', label: 'HOME', href: '/' },
    { index: '02', label: 'WORK', href: '/work' },
    { index: '03', label: 'SERVICES', href: '/services' },
    { index: '04', label: 'ABOUT', href: '/about' },
    { index: '05', label: 'CONTACT', href: '/contact' },
  ],
} as const

export type NavItem = (typeof site.nav)[number]
