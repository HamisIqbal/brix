// Post-build image pipeline for the static export (see lib/image-loader.ts).
// Renders every statically-imported JPEG/PNG in out/_next/static/media at each
// width next/image can request, as WebP. Runs automatically after `next build`.
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const MEDIA = 'out/_next/static/media'
const OPT = join(MEDIA, 'opt')
// Must match images.deviceSizes + images.imageSizes in next.config.ts.
const WIDTHS = [160, 240, 320, 390, 440, 560, 640, 828, 1080, 1200, 1440, 1920]

const files = (await readdir(MEDIA)).filter((f) => /\.(jpe?g|png)$/i.test(f))
if (files.length === 0) {
  console.error('[images] no media found in out/ — did `next build` run with output: export?')
  process.exit(1)
}
await mkdir(OPT, { recursive: true })

let count = 0
let bytes = 0
for (const file of files) {
  const base = file.replace(/\.(jpe?g|png)$/i, '')
  const input = join(MEDIA, file)
  // Normalise EXIF orientation once, so phone photos never render sideways.
  const source = await sharp(input).rotate().toBuffer()
  await Promise.all(
    WIDTHS.map(async (width) => {
      const out = join(OPT, `${base}-${width}.webp`)
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 76, effort: 5 })
        .toFile(out)
      bytes += (await stat(out)).size
      count += 1
    }),
  )
}

console.log(
  `[images] ${files.length} sources -> ${count} WebP files (${(bytes / 1024 / 1024).toFixed(1)} MB total across all widths)`,
)
