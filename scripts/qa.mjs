import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:3210'
const OUT = 'scripts/shots'
mkdirSync(OUT, { recursive: true })

const ROUTES = ['/', '/work', '/services', '/about', '/contact', '/work/red-brick-mailbox-column']
const WIDTHS = [360, 375, 390, 414, 768, 1024, 1280, 1440, 1920]

const problems = []

const browser = await chromium.launch()

async function audit(route, width, { shot = false, reducedMotion = 'no-preference' } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion,
    hasTouch: width < 768,
    isMobile: width < 768,
  })
  const page = await ctx.newPage()
  const errors = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

  const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 })
  if (!res || res.status() >= 400) problems.push(`${route} @${width}: HTTP ${res?.status()}`)

  // Let entrance animations settle, then scroll the whole page.
  await page.waitForTimeout(1200)
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, document.body.scrollHeight)
  })
  await page.waitForTimeout(900)
  await page.waitForLoadState('networkidle')

  // Horizontal overflow check.
  const overflow = await page.evaluate(() => {
    const de = document.documentElement
    const offenders = []
    if (de.scrollWidth > de.clientWidth + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          const style = getComputedStyle(el)
          if (style.position === 'fixed') continue
          offenders.push(
            `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(r.right)}`,
          )
        }
        if (offenders.length > 5) break
      }
      return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders }
    }
    return null
  })
  if (overflow) {
    problems.push(
      `${route} @${width}: horizontal overflow ${overflow.scrollWidth}>${overflow.clientWidth} :: ${overflow.offenders.join(' | ')}`,
    )
  }

  // Nothing fixed and opaque may cover the page at rest. The transition cover
  // is pointer-events:none, so hit-testing will not catch it — measure it.
  const covering = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' || cs.visibility === 'hidden' || cs.opacity === '0') continue
      const bg = cs.backgroundColor
      if (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') continue
      const r = el.getBoundingClientRect()
      const coversMost = r.width > window.innerWidth * 0.9 && r.height > window.innerHeight * 0.25
      if (coversMost) out.push(`${String(el.className).slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`)
    }
    return out.slice(0, 3)
  })
  if (covering.length) problems.push(`${route} @${width}: fixed overlay covering page: ${covering.join(' | ')}`)

  // Images that failed to load.
  const brokenImages = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src)
      .slice(0, 5),
  )
  if (brokenImages.length) problems.push(`${route} @${width}: broken images ${brokenImages.join(', ')}`)

  // A headline wider than its aperture is silently sliced by overflow:hidden.
  const clippedText = await page.evaluate(() =>
    [...document.querySelectorAll('[class*="ui_mask"]')]
      .filter((el) => el.scrollWidth > el.clientWidth + 2)
      .map((el) => (el.textContent || '').trim().slice(0, 24))
      .slice(0, 4),
  )
  if (clippedText.length) problems.push(`${route} @${width}: text clipped by aperture: ${clippedText.join(' | ')}`)

  // A plate whose box collapsed still "loads" its image — check the box.
  const collapsed = await page.evaluate(() =>
    [...document.querySelectorAll('figure img, [data-plate-img]')]
      .filter((el) => el.getBoundingClientRect().height < 8)
      .map((el) => (el.getAttribute('alt') || 'image').slice(0, 30))
      .slice(0, 4),
  )
  if (collapsed.length) problems.push(`${route} @${width}: collapsed image boxes: ${collapsed.join(', ')}`)

  // Content that never revealed (a reveal that failed leaves it clipped).
  const stuck = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('[data-reveal]')) {
      if (!el.hasAttribute('data-revealed')) {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) out.push(el.getAttribute('data-reveal'))
      }
    }
    return out.slice(0, 5)
  })
  if (stuck.length) problems.push(`${route} @${width}: unrevealed in view: ${stuck.join(', ')}`)

  if (errors.length) problems.push(`${route} @${width}: ${errors.slice(0, 3).join(' | ')}`)

  // Back to the top: the first section of a route is the one most likely to
  // be stuck, because it is already past the trigger line when the page loads.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  const stuckTop = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('[data-reveal]')) {
      if (el.hasAttribute('data-revealed')) continue
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0 && r.width > 0) {
        out.push(el.getAttribute('data-reveal') + ':' + (el.textContent || '').trim().slice(0, 24))
      }
    }
    return out.slice(0, 4)
  })
  if (stuckTop.length) problems.push(`${route} @${width}: stuck at top: ${stuckTop.join(' | ')}`)

  if (shot) {
    await page.waitForTimeout(200)
    const name = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '')
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: false })
  }

  await ctx.close()
}

// Full sweep on Home; key widths on the rest.
for (const w of WIDTHS) await audit('/', w, { shot: [390, 768, 1440].includes(w) })
for (const route of ROUTES.slice(1)) {
  for (const w of [390, 768, 1440]) await audit(route, w, { shot: w === 1440 })
}

// Reduced motion must render complete.
await audit('/', 1440, { shot: true, reducedMotion: 'reduce' })

await browser.close()

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`)
  for (const p of problems) console.log(' -', p)
  process.exit(1)
}
console.log('\nNo problems found.')
