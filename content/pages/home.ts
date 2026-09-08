export const home = {
  hero: {
    // Recommended option A — content deck §2.1
    headline: ['STRUCTURE', 'IN BRICK'],
    sub: 'Brick masonry, block and concrete. Laid straight, jointed clean, finished square.',
    strip: ['BRICK / BLOCK / CONCRETE', 'FREE ESTIMATES'],
    cue: 'SCROLL',
  },

  argument: {
    eyebrow: { index: '02', label: 'MATERIAL' },
    headline: ['PLUMB', 'LEVEL', 'TRUE'],
    body: [
      'Paint fades. Framing moves. Brick stays where it is set.',
      'That is the whole reason to build in masonry, and it is the standard the work is held to.',
    ],
    imageId: '03',
  },

  capabilities: {
    eyebrow: { index: '03', label: 'CAPABILITIES' },
    headline: 'WHAT WE LAY',
  },

  selected: {
    eyebrow: { index: '04', label: 'SELECTED' },
    headline: ['RECENT', 'WORK'],
    support: 'A record of the work, photographed on site.',
    featuredImageId: '10',
    ledgerSlugs: ['002', '009', '011'],
  },

  method: {
    eyebrow: { index: '05', label: 'METHOD' },
    headline: ['HOW THE', 'WORK RUNS'],
    support: 'Four stages. The order does not change, because masonry does not allow it to.',
    steps: [
      {
        index: '01',
        title: 'ESTIMATE',
        body: 'You describe the job. We look at it, measure it, and quote it. No charge.',
      },
      {
        index: '02',
        title: 'LAYOUT',
        body: 'Lines, levels and material set before a single unit is laid.',
      },
      {
        index: '03',
        title: 'LAY',
        body: 'The work goes in — footing, course, joint, cap, in that order.',
      },
      {
        index: '04',
        title: 'FINISH',
        body: 'Joints tooled, site cleared, work left as it will stand.',
      },
    ],
    imageId: '11',
  },

  material: {
    eyebrow: { index: '06', label: 'DETAIL' },
    headline: ['THE JOINT', 'IS THE WORK'],
    body: 'Anyone can stack units. The joint is where the difference shows — width, depth, tooling, consistency across a whole elevation.',
    pair: ['04', '01'],
  },

  estimate: {
    eyebrow: { index: '07', label: 'ESTIMATE' },
    headline: ['TELL US', 'THE JOB'],
    body: [
      'Send the details and a photo if you have one. We will come back with a number.',
      'Estimates are free.',
    ],
  },

  specStrip: [
    'RUNNING BOND',
    'SOLDIER COURSE',
    'HERRINGBONE',
    'FLEMISH BOND',
    'ROWLOCK',
    'SAILOR COURSE',
  ],
} as const
