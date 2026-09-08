import type { StaticImageData } from 'next/image'

import img01 from '@/assets/images/Brix-masonry-image-01.jpeg'
import img02 from '@/assets/images/Brix-masonry-image-02.jpeg'
import img03 from '@/assets/images/Brix-masonry-image-03.jpeg'
import img04 from '@/assets/images/Brix-masonry-image-04.jpeg'
import img05 from '@/assets/images/Brix-masonry-image-05.jpeg'
import img06 from '@/assets/images/Brix-masonry-image-06.jpeg'
import img07 from '@/assets/images/Brix-masonry-image-07.jpeg'
import img08 from '@/assets/images/Brix-masonry-image-08.jpeg'
import img09 from '@/assets/images/Brix-masonry-image-09.jpeg'
import img10 from '@/assets/images/Brix-masonry-image-10.jpeg'
import img11 from '@/assets/images/Brix-masonry-image-11.jpeg'
import heroPoster from '@/assets/generated/hero-poster.jpg'
import brixLogo from '@/assets/generated/brix-logo.png'

export type ImageId =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11'

export type ImageRecord = {
  id: ImageId
  src: StaticImageData
  /** Alt text describes the masonry, not the photograph. */
  alt: string
  /** Title stamp — visual design system §1.5. */
  title: string
  /** Spec line: bond pattern and detail. Verified against the photograph. */
  spec: string
  orientation: 'portrait' | 'landscape'
}

/**
 * The eleven source photographs. Originals are untouched: they are statically
 * imported so next/image derives dimensions (CLS 0) and emits AVIF/WebP.
 */
export const images: Record<ImageId, ImageRecord> = {
  '01': {
    id: '01',
    src: img01,
    alt: 'Stone veneer porch entry with square columns and a flat lintel',
    title: 'STONE COLUMN PORCH ENTRY',
    spec: 'STONE VENEER / SQUARE COLUMNS',
    orientation: 'portrait',
  },
  '02': {
    id: '02',
    src: img02,
    alt: 'Brick mailbox column with an arched niche on a raised brick planter base',
    title: 'BRICK MAILBOX AND PLANTER',
    spec: 'RUNNING BOND / ARCHED NICHE, PLANTER BASE',
    orientation: 'portrait',
  },
  '03': {
    id: '03',
    src: img03,
    alt: 'Arched brick mailbox with a herringbone infill panel and a low planter box',
    title: 'ARCHED BRICK MAILBOX',
    spec: 'RUNNING BOND / HERRINGBONE PANEL',
    orientation: 'portrait',
  },
  '04': {
    id: '04',
    src: img04,
    alt: 'Red brick mailbox column with a capped top, standing on a cleared site',
    title: 'RED BRICK MAILBOX COLUMN',
    spec: 'RUNNING BOND / RED BRICK COLUMN',
    orientation: 'portrait',
  },
  '05': {
    id: '05',
    src: img05,
    alt: 'Two block raised garden beds set on a lawn',
    title: 'BLOCK RAISED BEDS',
    spec: 'BLOCK / RAISED BEDS',
    orientation: 'landscape',
  },
  '06': {
    id: '06',
    src: img06,
    alt: 'Coursed stone pillar mailbox with a set address plaque',
    title: 'STONE PILLAR WITH ADDRESS PLAQUE',
    spec: 'COURSED STONE / SET PLAQUE',
    orientation: 'portrait',
  },
  '07': {
    id: '07',
    src: img07,
    alt: 'Arched brick mailbox with the site still uncleared around it',
    title: 'ARCHED BRICK MAILBOX, IN PROGRESS',
    spec: 'RUNNING BOND / ARCH, SITE CONDITION',
    orientation: 'portrait',
  },
  '08': {
    id: '08',
    src: img08,
    alt: 'Limewashed brick mailbox column with an arched recessed panel',
    title: 'LIMEWASHED ARCHED MAILBOX',
    spec: 'LIMEWASHED BRICK / ARCHED PANEL',
    orientation: 'portrait',
  },
  '09': {
    id: '09',
    src: img09,
    alt: 'Brick veneer elevation running the length of a house with window openings',
    title: 'BRICK VENEER ELEVATION',
    spec: 'RUNNING BOND / VENEER ELEVATION',
    orientation: 'landscape',
  },
  '10': {
    id: '10',
    src: img10,
    alt: 'Covered porch with a brick knee wall, brick columns and timber posts',
    title: 'COVERED PORCH, BRICK KNEE WALL',
    spec: 'RUNNING BOND / KNEE WALL AND COLUMNS',
    orientation: 'landscape',
  },
  '11': {
    id: '11',
    src: img11,
    alt: 'Covered patio with brick piers, a timber ceiling and a poured concrete slab',
    title: 'COVERED PATIO, BRICK AND SLAB',
    spec: 'BRICK AND CONCRETE / PIERS AND SLAB',
    orientation: 'portrait',
  },
}

export function getImage(id: ImageId): ImageRecord {
  return images[id]
}

export const media = {
  heroPoster,
  brixLogo,
  heroVideo: '/media/brix-hero.mp4',
  /** Source video is 576x1024 — 9:16 portrait. */
  heroVideoRatio: 576 / 1024,
} as const
