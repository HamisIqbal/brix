export const work = {
  eyebrow: { index: '02', label: 'WORK' },
  headline: ['THE', 'RECORD'],
  support:
    'Photographs from site, not a portfolio shoot. Cropped to the work and captioned with what it is.',
} as const

export const servicesPage = {
  eyebrow: { index: '03', label: 'SERVICES' },
  headline: ['WHAT WE', 'BUILD IN'],
  support: 'Brick first. Block, stone and concrete where the job calls for them.',
  elevationLabel: 'WALL SECTION',
  close: {
    headline: ['NOT', 'ON THE LIST'],
    support: 'If it is masonry or concrete, ask. The estimate is free either way.',
  },
} as const

export const about = {
  eyebrow: { index: '04', label: 'ABOUT' },
  headline: ['MASONRY', 'IS A TRADE'],
  support: 'It is learned by laying, and it shows in the joint. That is the entire pitch.',

  statement: {
    headline: ['THE PART', 'NOBODY', 'REDOES'],
    body: [
      'Most of a house can be changed. Paint, fixtures, cabinets, floors — all of it comes out eventually.',
      'Masonry does not. A brick column, a footing, a veneer elevation: those get built once, and whatever was done that day is what stands there afterwards.',
      'That is why the work gets laid out before it gets laid, and why the joint gets as much attention as the face.',
    ],
  },

  honesty: {
    headline: ['PHOTOGRAPHED', 'ON SITE'],
    body: [
      'These are not staged photographs. They were taken on the job, on a phone, with the site still around them.',
      'Real work looks like this. A clean shot of a finished wall tells you less than an honest one.',
    ],
    imageId: '07',
  },

  standard: {
    headline: ['HOW IT', 'GETS LEFT'],
    items: [
      { index: '01', text: 'Laid to a line.' },
      { index: '02', text: 'Jointed consistently across the whole face.' },
      { index: '03', text: 'Capped and finished square.' },
      { index: '04', text: 'Site cleared before we leave.' },
    ],
  },

  close: {
    headline: ['BRICK', 'FIRST'],
    support: 'Block, stone and concrete as the job requires.',
  },
} as const

export const contact = {
  eyebrow: { index: '05', label: 'CONTACT' },
  headline: ['TELL US', 'THE JOB'],
  support: [
    'Describe what you want built. A photo of the spot helps. We come back with a number.',
    'Estimates are free.',
  ],
  imageId: '06',
} as const

export const footer = {
  headline: ['READY TO', 'GET A NUMBER'],
  monument: 'BRIX',
  legal: 'BRIX MASONRY & CONCRETE',
  legalRight: 'BRICK · BLOCK · CONCRETE',
} as const

export const notFound = {
  headline: ['NO', 'SUCH', 'PAGE'],
  body: 'The page is not here. Start again from the front.',
  cta: 'HOME',
} as const

export const projectNotFound = {
  headline: ['NOT', 'FOUND'],
  body: 'That project is not here. The full record is on the work page.',
} as const
