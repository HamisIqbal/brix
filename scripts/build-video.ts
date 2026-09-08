/**
 * Media preparation.
 *
 * 1. Copies the hero video into public/media.
 * 2. Extracts a poster frame (the LCP-safe, JS-free hero state).
 * 3. Normalises the logo to a sensible delivery size.
 *
 * The masonry photographs are NOT processed here: they are statically imported
 * from assets/images and optimised by next/image, so the originals stay intact.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import sharp from 'sharp'

const root = process.cwd()
const publicMedia = path.join(root, 'public', 'media')
const assetsGen = path.join(root, 'assets', 'generated')

mkdirSync(publicMedia, { recursive: true })
mkdirSync(assetsGen, { recursive: true })

const srcVideo = path.join(root, 'assets', 'videos', 'Brix-vid1.mp4')
const outVideo = path.join(publicMedia, 'brix-hero.mp4')

if (!existsSync(outVideo)) {
  copyFileSync(srcVideo, outVideo)
  console.log('video: copied to public/media/brix-hero.mp4')
}

// Poster frame. Taken a little into the clip so it is not a fade-in frame.
const rawPoster = path.join(assetsGen, 'hero-poster-raw.png')
const outPoster = path.join(assetsGen, 'hero-poster.jpg')

if (!ffmpegPath) throw new Error('ffmpeg-static did not resolve a binary path')

execFileSync(ffmpegPath, ['-y', '-ss', '00:00:01.5', '-i', srcVideo, '-frames:v', '1', rawPoster], {
  stdio: 'ignore',
})

const meta = await sharp(rawPoster).metadata()
console.log(`poster: source frame ${meta.width}x${meta.height}`)

await sharp(rawPoster)
  .resize({ width: 900, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(outPoster)

console.log('poster: assets/generated/hero-poster.jpg')

// Logo: the source is a 613KB Photoroom export. Trim the transparent margin and
// deliver at 4x the largest rendered height (28px desktop).
const srcLogo = path.join(root, 'assets', 'logo', 'Brix-logo-Photoroom.png')
const outLogo = path.join(assetsGen, 'brix-logo.png')

const logoMeta = await sharp(srcLogo).metadata()
console.log(`logo: source ${logoMeta.width}x${logoMeta.height}`)

await sharp(srcLogo)
  .trim({ threshold: 5 })
  .resize({ height: 160, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(outLogo)

const finalLogo = await sharp(outLogo).metadata()
console.log(`logo: assets/generated/brix-logo.png ${finalLogo.width}x${finalLogo.height}`)
