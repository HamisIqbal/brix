export const site = {
  name: 'BRIX Masonry & Concrete',
  shortName: 'BRIX',
  tagline: 'Professional Masonry & Concrete · Brick · Block · Custom Work · Free Estimates',
  taglineShort: 'Brick · Block · Concrete',
  description: 'Brick masonry, block and concrete work. Free estimates.',
  /** Replace with the production origin before launch. */
  url: 'https://brixmasonry.example',
  nav: [
    { index: '01', label: 'HOME', href: '/' },
    { index: '02', label: 'WORK', href: '/work' },
    { index: '03', label: 'SERVICES', href: '/services' },
    { index: '04', label: 'ABOUT', href: '/about' },
    { index: '05', label: 'CONTACT', href: '/contact' },
  ],
} as const

export type NavItem = (typeof site.nav)[number]
