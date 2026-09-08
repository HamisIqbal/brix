import { z } from 'zod'
import { form, PROJECT_TYPES } from '@/content/form'

const m = form.messages

/**
 * One schema, shared by the client and the Route Handler, with its messages
 * imported from the content module — so the client-side error and the
 * server-side error are the same string by construction (architecture §10.7).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, m.nameRequired),
  email: z.string().trim().min(1, m.emailRequired).email(m.emailInvalid),
  phone: z
    .string()
    .trim()
    .refine((v) => v === '' || /^[+()\d][\d\s\-().]{6,}$/.test(v), m.phoneInvalid)
    .optional()
    .or(z.literal('')),
  projectType: z.enum(PROJECT_TYPES, { errorMap: () => ({ message: m.typeRequired }) }),
  job: z.string().trim().min(1, m.jobRequired).min(20, m.jobShort),
  /** Honeypot: must stay empty. Never shown to a human. */
  company: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export type FieldName = keyof Omit<ContactInput, 'company'>

export type FieldErrors = Partial<Record<FieldName, string>>

export function collectErrors(error: z.ZodError<ContactInput>): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && key !== 'company' && !(key in out)) {
      out[key as FieldName] = issue.message
    }
  }
  return out
}
