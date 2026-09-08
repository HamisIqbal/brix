import type { ImageId } from './images'

export type Service = {
  index: string
  /** Position in the wall elevation, bottom-up. Brick sits at the centre. */
  course: number
  name: string
  statement: string
  detail: string
  /** Two-line spec used by the Home capability band. */
  specLine: string
  imageId: ImageId
  /** Positioning encoded as data: brick leads the elevation and the band. */
  primary?: boolean
}

export const services: readonly Service[] = [
  {
    index: '01',
    course: 1,
    name: 'CONCRETE',
    statement: 'Flatwork and footings.',
    detail:
      'Slabs, driveways, walkways, patios, and the footings everything else is laid on. Formed, poured, and finished level.',
    specLine: 'Slabs, drives, flatwork',
    imageId: '11',
  },
  {
    index: '02',
    course: 2,
    name: 'BLOCK',
    statement: 'Structure below the finish.',
    detail:
      'Footings, foundation courses, retaining walls and structural block. The part of the job that gets covered up and has to be right.',
    specLine: 'Footings, retaining, structural',
    imageId: '05',
  },
  {
    index: '03',
    course: 3,
    name: 'BRICK',
    statement: 'The primary trade.',
    detail:
      'Veneer, columns, mailboxes, knee walls, arches and elevations. Laid to a line, jointed consistently, capped square.',
    specLine: 'Veneer, columns, mailboxes',
    imageId: '09',
    primary: true,
  },
  {
    index: '04',
    course: 4,
    name: 'STONE',
    statement: 'Veneer and set pieces.',
    detail: 'Stone veneer, pillars, caps and plaque settings. Fitted and pointed by hand.',
    specLine: 'Veneer, pillars, caps',
    imageId: '01',
  },
  {
    index: '05',
    course: 5,
    name: 'OUTDOOR',
    statement: 'Structures that live outside.',
    detail:
      'Patios, knee walls, planters and raised beds. Built in the same materials as the house they sit beside.',
    specLine: 'Patios, knee walls, beds',
    imageId: '10',
  },
  {
    index: '06',
    course: 6,
    name: 'CUSTOM',
    statement: 'One-offs and detail work.',
    detail:
      'Arches, inset patterns, limewash finishes and anything drawn rather than ordered.',
    specLine: 'Arches, detail work, one-offs',
    imageId: '03',
  },
]

/** Home capability band order — brick first, then the rest. */
export const capabilityOrder: readonly string[] = [
  'BRICK',
  'BLOCK',
  'STONE',
  'CONCRETE',
  'OUTDOOR',
  'CUSTOM',
]

export const capabilities = capabilityOrder
  .map((name, i) => {
    const s = services.find((x) => x.name === name)
    if (!s) throw new Error(`Unknown capability: ${name}`)
    return { ...s, index: String(i + 1).padStart(2, '0') }
  })
