/**
 * next/image loader for the static export.
 *
 * Statically imported images are emitted to /_next/static/media/<name>.<hash>.<ext>.
 * After `next build`, scripts/optimize-images.mjs renders each of them at every
 * configured width to /_next/static/media/opt/<name>.<hash>-<width>.webp, and
 * this maps each srcset candidate to its file. Anything else passes through.
 *
 * In `next dev` the originals are served as-is (the optimized files only exist
 * in out/); the width is appended so next/image sees a width-aware loader.
 */
const MEDIA = /^\/_next\/static\/media\/([^/]+)\.(?:jpe?g|png)$/i

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (process.env.NODE_ENV === 'development') return `${src}?w=${width}`
  const match = MEDIA.exec(src)
  if (!match) return src
  return `/_next/static/media/opt/${match[1]}-${width}.webp`
}
