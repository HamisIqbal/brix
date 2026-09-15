import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:3210'
const problems = []
const ok = (label) => console.log('  PASS', label)
const fail = (label, detail) => {
  problems.push(`${label}${detail ? ` — ${detail}` : ''}`)
  console.log('  FAIL', label, detail ?? '')
}

const browser = await chromium.launch()

async function page(width = 1440, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    hasTouch: width < 768,
    isMobile: width < 768,
    ...opts,
  })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  p.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 160)}`)
  })
  return { p, ctx }
}

// ── Menu: open, focus trap, escape, navigation ──────────────
for (const width of [390, 768, 1440]) {
  console.log(`\nMENU @${width}`)
  const { p, ctx } = await page(width)
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)

  const trigger = p.locator('button[aria-controls="site-menu"]')
  if ((await trigger.getAttribute('aria-expanded')) !== 'false') fail('aria-expanded starts false')

  await trigger.click()
  await p.waitForTimeout(900)

  const overlay = p.locator('#site-menu')
  if (!(await overlay.isVisible())) fail(`menu opens @${width}`)
  else ok(`menu opens @${width}`)

  if ((await trigger.getAttribute('aria-expanded')) !== 'true') fail('aria-expanded true when open')
  else ok('aria-expanded reflects state')

  // Focus should have moved inside the overlay.
  const focusInside = await p.evaluate(
    () => !!document.activeElement?.closest('#site-menu'),
  )
  focusInside ? ok('focus moves into overlay') : fail('focus moves into overlay')

  // Scroll must be locked while open.
  const locked = await p.evaluate(() => getComputedStyle(document.body).position === 'fixed')
  locked ? ok('scroll locked') : fail('scroll locked')

  // Escape closes and returns focus to the trigger.
  await p.keyboard.press('Escape')
  await p.waitForTimeout(700)
  if (await overlay.isVisible()) fail('escape closes menu')
  else ok('escape closes menu')

  const returned = await p.evaluate(
    () => document.activeElement?.getAttribute('aria-controls') === 'site-menu',
  )
  returned ? ok('focus returns to trigger') : fail('focus returns to trigger')

  const unlocked = await p.evaluate(() => getComputedStyle(document.body).position !== 'fixed')
  unlocked ? ok('scroll unlocked') : fail('scroll unlocked')

  // Navigate from the menu.
  await trigger.click()
  await p.waitForTimeout(900)
  await p.locator('#site-menu a[href="/work"]').click()
  await p.waitForTimeout(2000)
  if (!p.url().endsWith('/work')) fail(`menu navigation @${width}`, p.url())
  else ok(`menu navigation @${width}`)

  const stillOpen = await p.locator('#site-menu').count()
  stillOpen === 0 ? ok('menu closes on navigate') : fail('menu closes on navigate')

  await ctx.close()
}

// ── Route transitions: cover never strands the page ─────────
console.log('\nROUTE TRANSITIONS')
{
  const { p, ctx } = await page(1440)
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)

  for (const [href, expect] of [['/services', '/services'], ['/about', '/about'], ['/', '/']]) {
    await p.evaluate((h) => {
      document.getElementById('nav-probe')?.remove()
      const a = document.createElement('a')
      a.href = h
      a.id = 'nav-probe'
      a.textContent = 'go'
      a.style.cssText = 'position:fixed;top:200px;left:8px;z-index:200'
      document.body.appendChild(a)
    }, href)
    await p.click('#nav-probe')
    await p.waitForTimeout(2200)

    const url = new URL(p.url()).pathname
    if (url !== expect) fail(`navigate to ${expect}`, url)
    else ok(`navigate to ${expect}`)

    const covered = await p.evaluate(() => {
      const c = document.querySelector('[class*="chrome_cover"]')
      if (!c) return false
      return [...c.children].some((el) => el.getBoundingClientRect().height > 4)
    })
    covered ? fail(`cover cleared after ${expect}`) : ok(`cover cleared after ${expect}`)

    const scrolled = await p.evaluate(() => window.scrollY)
    scrolled < 5 ? ok('scroll reset to top') : fail('scroll reset to top', String(scrolled))
  }

  // Browser back must not strand the cover either.
  await p.goBack()
  await p.waitForTimeout(1800)
  const coveredBack = await p.evaluate(() => {
    const c = document.querySelector('[class*="chrome_cover"]')
    return c ? [...c.children].some((el) => el.getBoundingClientRect().height > 4) : false
  })
  coveredBack ? fail('cover cleared after back') : ok('cover cleared after back')

  await ctx.close()
}

// ── Contact form validation ─────────────────────────────────
console.log('\nCONTACT FORM')
{
  const { p, ctx } = await page(1440)
  // Stub the handler: the real one emails the client through Resend.
  let posted = null
  await p.route(/\/api\/contact\/?$/, (route) => {
    // Multipart: pull the text fields out of the raw body.
    const raw = route.request().postDataBuffer()?.toString('latin1') ?? ''
    const field = (name) => raw.match(new RegExp(`name="${name}"\\r\\n\\r\\n([^\\r]*)`))?.[1]
    posted = {
      email: field('email'),
      projectType: field('projectType'),
      media: [...raw.matchAll(/name="media"; filename="([^"]+)"/g)].map((m) => m[1]),
    }
    route.fulfill({ status: 200, json: { ok: true } })
  })
  await p.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)

  // Submitting empty must not send, must surface errors, must focus the first.
  await p.locator('form button[type="submit"]').click()
  await p.waitForTimeout(500)

  const alerts = await p.locator('form [role="alert"]').count()
  alerts >= 3 ? ok(`errors shown (${alerts})`) : fail('errors shown on empty submit', String(alerts))

  const focused = await p.evaluate(() => document.activeElement?.id)
  focused === 'field-name' ? ok('focus moves to first error') : fail('focus moves to first error', String(focused))

  const invalid = await p.locator('#field-name[aria-invalid="true"]').count()
  invalid === 1 ? ok('aria-invalid set') : fail('aria-invalid set')

  // The still-needed list names every missing requirement before sending.
  const missingItems = await p.locator('[data-missing-item]').count()
  missingItems === 4 ? ok('still-needed list shows 4 items') : fail('still-needed list', String(missingItems))
  await p.locator('[data-missing-item="projectType"]').click()
  await p.waitForTimeout(600)
  const jumped = await p.evaluate(() => document.activeElement?.getAttribute('data-chip'))
  jumped ? ok('still-needed item jumps to its field') : fail('still-needed item jumps to its field')

  // Bad email, checked on blur only.
  await p.fill('#field-name', 'Sam Rivera')
  await p.fill('#field-email', 'not-an-email')
  await p.locator('#field-email').blur()
  await p.waitForTimeout(300)
  const emailErr = await p.locator('#error-email').textContent()
  emailErr?.includes('not complete') ? ok('email validated on blur') : fail('email validated on blur', String(emailErr))

  // Short job description.
  await p.fill('#field-job', 'too short')
  await p.locator('#field-job').blur()
  await p.waitForTimeout(300)
  const jobErr = await p.locator('#error-job').textContent()
  jobErr?.includes('more detail') ? ok('minimum detail enforced') : fail('minimum detail enforced', String(jobErr))

  // Complete it properly and submit.
  await p.fill('#field-email', 'sam@example.com')
  await p.locator('[data-chip="BRICK"]').click()
  await p.waitForTimeout(200)
  if ((await p.locator('[data-chip="BRICK"]').getAttribute('aria-checked')) !== 'true') {
    fail('chip selects on click')
  } else ok('chip selects on click')

  // Arrow keys move within the group (ARIA radiogroup pattern).
  await p.locator('[data-chip="BRICK"]').press('ArrowRight')
  await p.waitForTimeout(200)
  const moved = await p.locator('[data-chip="BLOCK"]').getAttribute('aria-checked')
  moved === 'true' ? ok('arrow keys move within radiogroup') : fail('arrow keys move within radiogroup')
  await p.locator('[data-chip="BLOCK"]').press('ArrowLeft')
  await p.waitForTimeout(200)
  await p.fill('#field-job', 'Brick mailbox column with a capped top, at the end of the driveway.')
  await p.locator('#field-job').blur()
  await p.waitForTimeout(300)

  const ready = await p.locator('[data-missing-item]').count()
  ready === 0 ? ok('still-needed list clears when complete') : fail('still-needed list clears', String(ready))

  // Optional media: one valid image is accepted, a non-media file is refused.
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
  await p.setInputFiles('#field-media', [
    { name: 'site.png', mimeType: 'image/png', buffer: png },
    { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('x') },
  ])
  await p.waitForTimeout(300)
  const rows = await p.locator('[aria-label="Attached files"] li').count()
  rows === 1 ? ok('media attaches, non-media refused') : fail('media attaches', String(rows))

  await p.locator('form button[type="submit"]').click()
  await p.waitForTimeout(2500)

  const label = (await p.locator('form button[type="submit"]').textContent())?.trim()
  label?.includes('RECEIVED') ? ok('submit succeeds') : fail('submit succeeds', String(label))
  posted?.email === 'sam@example.com' && posted?.projectType === 'BRICK' && posted?.media?.[0] === 'site.png'
    ? ok('posts the form and media to /api/contact')
    : fail('posts the form to /api/contact', JSON.stringify(posted))

  const disabled = await p.locator('form button[type="submit"]').isDisabled()
  disabled ? ok('button locks after send') : fail('button locks after send')

  const dialog = p.locator('[data-success][role="dialog"]')
  ;(await dialog.isVisible()) && (await dialog.textContent())?.includes('sam@example.com')
    ? ok('success dialog confirms the request')
    : fail('success dialog confirms the request')
  await p.keyboard.press('Escape')
  await p.waitForTimeout(400)
  const closed = (await dialog.count()) === 0
  const cleared = (await p.inputValue('#field-name')) === ''
  closed && cleared ? ok('dialog closes and form resets') : fail('dialog closes and form resets')

  await ctx.close()
}

// ── Keyboard path ───────────────────────────────────────────
console.log('\nKEYBOARD')
{
  const { p, ctx } = await page(1440)
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)

  await p.keyboard.press('Tab')
  const first = await p.evaluate(() => document.activeElement?.className || '')
  first.includes('skip-link') ? ok('skip link is first stop') : fail('skip link is first stop', first)

  // Every focused element must show a visible ring.
  let missing = 0
  for (let i = 0; i < 14; i++) {
    await p.keyboard.press('Tab')
    const hasRing = await p.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return true
      const cs = getComputedStyle(el)
      return cs.outlineStyle !== 'none' || cs.boxShadow !== 'none'
    })
    if (!hasRing) missing++
  }
  missing === 0 ? ok('focus ring on every stop') : fail('focus ring on every stop', `${missing} missing`)

  await ctx.close()
}

await browser.close()

console.log('\n' + '─'.repeat(50))
if (problems.length) {
  console.log(`${problems.length} PROBLEM(S):`)
  for (const p of problems) console.log(' -', p)
  process.exit(1)
}
console.log('All interaction checks passed.')
