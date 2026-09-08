import type { ImageId } from './images'

export type Category = 'BRICK' | 'BLOCK' | 'STONE' | 'CONCRETE'

export type Project = {
  index: string
  slug: string
  title: string
  category: Category
  /** Secondary category, where a job spans two trades. */
  categorySecondary?: Category
  spec: string
  /** Two sentences maximum, describing only what is visible. */
  body: string
  imageId: ImageId
  /* Absent by default. Rendered only if the client ever supplies them. */
  completed?: string
  scope?: readonly string[]
}

/**
 * Titles describe what is in the frame — element and material, nothing else.
 * No client names, locations, dates or budgets: none were supplied.
 */
export const projects: readonly Project[] = [
  {
    index: '001',
    slug: 'stone-column-porch-entry',
    title: 'STONE COLUMN PORCH ENTRY',
    category: 'STONE',
    spec: 'STONE VENEER / SQUARE COLUMNS',
    body: 'Stone veneer carried across the entry columns and returned into the wall face. Coursed and fitted so the joint width holds consistent around every corner.',
    imageId: '01',
  },
  {
    index: '002',
    slug: 'brick-mailbox-and-planter',
    title: 'BRICK MAILBOX AND PLANTER',
    category: 'BRICK',
    spec: 'RUNNING BOND / ARCHED NICHE, PLANTER BASE',
    body: 'Brick mailbox column with an arched niche, set on a raised planter base laid in the same brick. The planter and the column read as one piece of work rather than two.',
    imageId: '02',
  },
  {
    index: '003',
    slug: 'arched-brick-mailbox',
    title: 'ARCHED BRICK MAILBOX',
    category: 'BRICK',
    spec: 'RUNNING BOND / HERRINGBONE PANEL',
    body: 'Tall brick arch with a herringbone panel set into the face. The herringbone is cut to the arch rather than stopped short of it.',
    imageId: '03',
  },
  {
    index: '004',
    slug: 'red-brick-mailbox-column',
    title: 'RED BRICK MAILBOX COLUMN',
    category: 'BRICK',
    spec: 'RUNNING BOND / RED BRICK COLUMN',
    body: 'Red brick column with a capped top and a set mailbox surround. Laid in full brick with a finished joint on every exposed face.',
    imageId: '04',
  },
  {
    index: '005',
    slug: 'block-raised-beds',
    title: 'BLOCK RAISED BEDS',
    category: 'BLOCK',
    spec: 'BLOCK / RAISED BEDS',
    body: 'Two raised beds built in block and levelled to each other across the lawn. Square corners, capped courses, set to sit flat on uneven ground.',
    imageId: '05',
  },
  {
    index: '006',
    slug: 'stone-pillar-address-plaque',
    title: 'STONE PILLAR WITH ADDRESS PLAQUE',
    category: 'STONE',
    spec: 'COURSED STONE / SET PLAQUE',
    body: 'Coursed stone pillar with the address plaque set into the face rather than fixed onto it. The courses run out level either side of the opening.',
    imageId: '06',
  },
  {
    index: '007',
    slug: 'arched-brick-mailbox-in-progress',
    title: 'ARCHED BRICK MAILBOX, IN PROGRESS',
    category: 'BRICK',
    spec: 'RUNNING BOND / ARCH, SITE CONDITION',
    body: 'Brick arch photographed with the site still around it. The work is finished; the ground is not.',
    imageId: '07',
  },
  {
    index: '008',
    slug: 'limewashed-arched-mailbox',
    title: 'LIMEWASHED ARCHED MAILBOX',
    category: 'BRICK',
    spec: 'LIMEWASHED BRICK / ARCHED PANEL',
    body: 'Brick mailbox column with a recessed arched panel, finished in limewash. The wash is carried over the joint so the face reads as one surface.',
    imageId: '08',
  },
  {
    index: '009',
    slug: 'brick-veneer-elevation',
    title: 'BRICK VENEER ELEVATION',
    category: 'BRICK',
    spec: 'RUNNING BOND / VENEER ELEVATION',
    body: 'Full brick veneer elevation with window openings carried through the coursing. The bond runs unbroken from corner to corner.',
    imageId: '09',
  },
  {
    index: '010',
    slug: 'covered-porch-brick-knee-wall',
    title: 'COVERED PORCH, BRICK KNEE WALL',
    category: 'BRICK',
    spec: 'RUNNING BOND / KNEE WALL AND COLUMNS',
    body: 'Brick knee wall and columns carrying a timber porch structure. The wall is capped level along its full run.',
    imageId: '10',
  },
  {
    index: '011',
    slug: 'covered-patio-brick-and-slab',
    title: 'COVERED PATIO, BRICK AND SLAB',
    category: 'BRICK',
    categorySecondary: 'CONCRETE',
    spec: 'BRICK AND CONCRETE / PIERS AND SLAB',
    body: 'Brick piers and knee wall set on a poured concrete slab under a covered patio. Brickwork and flatwork laid as one job.',
    imageId: '11',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug)
  const next = projects[(i + 1) % projects.length]
  // projects is a non-empty literal, so this is always defined.
  return next as Project
}
