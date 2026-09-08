import { NextResponse } from 'next/server'
import { contactSchema, collectErrors } from '@/lib/form/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The only dynamic surface on the site. In-memory rate limiting is sufficient
 * for a five-page marketing site; swap for a shared store if this ever runs on
 * more than one instance.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const attempts = new Map<string, { count: number; reset: number }>()

function rateLimited(key: string): boolean {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now > entry.reset) {
    attempts.set(key, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate-limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid-json' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: collectErrors(parsed.error) },
      { status: 422 },
    )
  }

  // Honeypot: a filled "company" field is a bot. Answer 200 so it learns nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  // Delivery is not wired up: no mail provider or inbox routing was supplied.
  // The submission is logged so nothing is silently dropped in the meantime.
  console.info('[contact] enquiry received', {
    name: parsed.data.name,
    email: parsed.data.email,
    projectType: parsed.data.projectType,
    at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
