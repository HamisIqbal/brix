import { Resend } from 'resend'
import { contactSchema, collectErrors } from '@/lib/form/schema'
import { site } from '@/content/site'

/**
 * Contact form handler. Validates with the same schema as the client, then
 * emails the request through Resend (provisioned via the Vercel Marketplace,
 * which sets RESEND_API_KEY and RESEND_EMAIL_DOMAIN on the project).
 */
const TO = 'brixmasonrycontact@gmail.com'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
// Best-effort per-instance rate limit. Fluid Compute reuses instances, so this
// stops a burst from one visitor; the honeypot handles the drive-by bots.
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => t > now - WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) return true
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return false
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return Response.json({ ok: false, reason: 'rate-limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, reason: 'invalid-json' }, { status: 400 })
  }

  // Honeypot: a filled "company" field is a bot. Answer 200 so it learns nothing.
  if (body && typeof body === 'object' && 'company' in body && body.company) {
    return Response.json({ ok: true })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ ok: false, errors: collectErrors(parsed.error) }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) {
    console.error('[contact] RESEND_API_KEY or RESEND_EMAIL_DOMAIN is not set')
    return Response.json({ ok: false, reason: 'not-configured' }, { status: 500 })
  }

  const { name, email, phone, projectType, job } = parsed.data
  const cleanName = name.replace(/[\r\n]+/g, ' ')

  const text = [
    'New estimate request from the website',
    '',
    `Name:         ${cleanName}`,
    `Email:        ${email}`,
    `Phone:        ${phone || '-'}`,
    `Project type: ${projectType}`,
    '',
    'The job:',
    job,
    '',
    '--',
    `Sent from ${site.url}`,
  ].join('\n')

  const { error } = await new Resend(apiKey).emails.send({
    from: `${site.shortName} Website <noreply@${domain}>`,
    to: [TO],
    replyTo: `${cleanName} <${email}>`,
    subject: `New estimate request: ${projectType} - ${cleanName}`,
    text,
  })

  if (error) {
    console.error('[contact] Resend rejected the email:', error)
    return Response.json({ ok: false, reason: 'mail-failed' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
