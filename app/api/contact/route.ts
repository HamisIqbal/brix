import { Resend } from 'resend'
import { contactSchema, collectErrors } from '@/lib/form/schema'
import { acceptMedia, formatBytes } from '@/lib/form/media'
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

  // The form posts multipart (fields + optional media); JSON is still accepted
  // for field-only clients.
  let body: Record<string, unknown>
  let media: File[] = []
  try {
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const data = await request.formData()
      body = {}
      for (const [key, value] of data.entries()) {
        if (key === 'media') {
          if (typeof value !== 'string' && value.size > 0) media.push(value)
        } else if (typeof value === 'string') {
          body[key] = value
        }
      }
    } else {
      body = await request.json()
    }
  } catch {
    return Response.json({ ok: false, reason: 'invalid-body' }, { status: 400 })
  }

  // Honeypot: a filled "company" field is a bot. Answer 200 so it learns nothing.
  if (body && typeof body === 'object' && 'company' in body && body.company) {
    return Response.json({ ok: true })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ ok: false, errors: collectErrors(parsed.error) }, { status: 422 })
  }

  // Re-check the media against the same caps the client enforced.
  const checked = acceptMedia([], media)
  if (checked.rejected.length > 0) {
    return Response.json({ ok: false, reason: 'media-rejected' }, { status: 413 })
  }
  media = checked.files

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
    `Attachments:  ${media.length ? media.map((f) => `${f.name} (${formatBytes(f.size)})`).join(', ') : '-'}`,
    '',
    '--',
    `Sent from ${site.url}`,
  ].join('\n')

  const attachments = await Promise.all(
    media.map(async (file, i) => ({
      // Keep the visitor's name for the file but strip anything path-like.
      filename: file.name.replace(/[^\w.\- ]+/g, '_').slice(-120) || `attachment-${i + 1}`,
      content: Buffer.from(await file.arrayBuffer()),
      ...(file.type ? { contentType: file.type } : {}),
    })),
  )

  const { error } = await new Resend(apiKey).emails.send({
    from: `${site.shortName} Website <noreply@${domain}>`,
    to: [TO],
    replyTo: `${cleanName} <${email}>`,
    subject: `New estimate request: ${projectType} - ${cleanName}`,
    text,
    ...(attachments.length ? { attachments } : {}),
  })

  if (error) {
    console.error('[contact] Resend rejected the email:', error)
    return Response.json({ ok: false, reason: 'mail-failed' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
