'use client'

import { useMemo, useState, type FormEvent } from 'react'
import clsx from 'clsx'
import { form, PROJECT_TYPES, type ProjectType } from '@/content/form'
import { contactSchema, collectErrors, type FieldErrors, type FieldName } from '@/lib/form/schema'
import { Apex } from '@/components/ui/Apex'
import { Cross } from '@/components/ui/Marks'
import s from './form.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

type Values = {
  name: string
  email: string
  phone: string
  projectType: ProjectType | ''
  job: string
  company: string
}

const EMPTY: Values = { name: '', email: '', phone: '', projectType: '', job: '', company: '' }
const REQUIRED: FieldName[] = ['name', 'email', 'projectType', 'job']

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  const set = (key: keyof Values, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  // Validation runs on blur, never on keystroke. Turning a field red while
  // someone is still typing is hostile.
  const validateField = (key: FieldName) => {
    const parsed = contactSchema.safeParse(values)
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => {
      const next = { ...prev }
      if (parsed.success) {
        delete next[key]
      } else {
        const all = collectErrors(parsed.error)
        if (all[key]) next[key] = all[key]
        else delete next[key]
      }
      return next
    })
  }

  const completed = useMemo(
    () =>
      REQUIRED.filter((key) => {
        const parsed = contactSchema.safeParse(values)
        if (parsed.success) return true
        return !collectErrors(parsed.error)[key]
      }),
    [values],
  )

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsed = contactSchema.safeParse(values)

    if (!parsed.success) {
      const all = collectErrors(parsed.error)
      setErrors(all)
      setTouched({ name: true, email: true, phone: true, projectType: true, job: true })
      const first = REQUIRED.find((k) => all[k])
      if (first) document.getElementById(`field-${first}`)?.focus()
      return
    }

    setStatus('sending')
    setFormError(null)

    try {
      // A PHP handler shipped in public/ — the site is a static export, and
      // Hostinger runs PHP natively. Not available under `next dev`.
      const res = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (res.status === 429) {
        setStatus('error')
        setFormError(form.messages.rateLimited)
        return
      }
      if (!res.ok) throw new Error('request failed')

      setStatus('sent')
    } catch {
      setStatus('error')
      setFormError(form.messages.submitFailed)
    }
  }

  const state = status === 'sent' ? form.states.sent : status === 'sending' ? form.states.sending : form.states.idle
  const locked = status === 'sending' || status === 'sent'

  const selectType = (type: ProjectType) => {
    set('projectType', type)
    setTouched((prev) => ({ ...prev, projectType: true }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.projectType
      return next
    })
  }

  const fieldError = (key: FieldName) => (touched[key] ? errors[key] : undefined)
  const isComplete = (key: FieldName) => completed.includes(key) && Boolean(values[key])

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <div className={s.progress} aria-hidden="true">
        {REQUIRED.map((key) => (
          <span
            key={key}
            className={clsx(s.progressCell, isComplete(key) && s.progressCellOn)}
          />
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {completed.length} of {REQUIRED.length} required fields complete
      </p>

      <TextField
        name="name"
        value={values.name}
        onChange={(v) => set('name', v)}
        onBlur={() => validateField('name')}
        error={fieldError('name')}
        complete={isComplete('name')}
        disabled={locked}
      />

      <TextField
        name="email"
        type="email"
        value={values.email}
        onChange={(v) => set('email', v)}
        onBlur={() => validateField('email')}
        error={fieldError('email')}
        complete={isComplete('email')}
        disabled={locked}
      />

      <TextField
        name="phone"
        type="tel"
        value={values.phone}
        onChange={(v) => set('phone', v)}
        onBlur={() => validateField('phone')}
        error={fieldError('phone')}
        complete={Boolean(values.phone) && !errors.phone}
        disabled={locked}
      />

      <fieldset
        className={clsx(s.field, fieldError('projectType') && s.fieldInvalid)}
        aria-describedby={fieldError('projectType') ? 'error-projectType' : undefined}
      >
        <legend className={clsx(s.label, 'label')}>
          <span className={s.labelIndex}>{form.fields.projectType.index}</span>
          <span>{form.fields.projectType.label}</span>
          <span className={s.required} aria-hidden="true">
            +
          </span>
          <span className="visually-hidden">required</span>
        </legend>
        <span className={clsx(s.helper, 'label')}>{form.fields.projectType.helper}</span>

        <div className={s.chips} role="radiogroup" aria-label={form.fields.projectType.label}>
          {PROJECT_TYPES.map((type, i) => {
            const on = values.projectType === type
            // Roving tabindex: the group is one tab stop, arrows move within it.
            const focusable = on || (!values.projectType && i === 0)
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={locked}
                tabIndex={focusable ? 0 : -1}
                data-chip={type}
                className={clsx(s.chip, on && s.chipOn, 'btn-label')}
                onKeyDown={(e) => {
                  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
                  if (!keys.includes(e.key)) return
                  e.preventDefault()
                  const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
                  const nextType =
                    PROJECT_TYPES[(i + step + PROJECT_TYPES.length) % PROJECT_TYPES.length]
                  if (!nextType) return
                  selectType(nextType)
                  document
                    .querySelector<HTMLButtonElement>(`[data-chip="${nextType}"]`)
                    ?.focus()
                }}
                onClick={() => selectType(type)}
              >
                <span className={s.chipFill} aria-hidden="true" />
                {type}
              </button>
            )
          })}
        </div>

        <span className={s.errorSlot}>
          {fieldError('projectType') && (
            <FieldError id="error-projectType" message={fieldError('projectType')!} />
          )}
        </span>
      </fieldset>

      <TextField
        name="job"
        multiline
        value={values.job}
        onChange={(v) => set('job', v)}
        onBlur={() => validateField('job')}
        error={fieldError('job')}
        complete={isComplete('job')}
        disabled={locked}
      />

      {/* Honeypot — never shown to a human. */}
      <div className={s.honeypot} aria-hidden="true">
        <label htmlFor="field-company">Company</label>
        <input
          id="field-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => set('company', e.target.value)}
        />
      </div>

      <div className={s.submitRow}>
        <button type="submit" className={s.submit} disabled={locked} aria-busy={status === 'sending'}>
          <span className={clsx(s.drain, status === 'sending' && s.drainOn)} aria-hidden="true" />
          {status === 'sent' && <Apex size={12} direction="up" />}
          {/* The label LAYs out and the new one LAYs in — a CSS keyframe
              keyed on the label itself, so no animation library is needed. */}
          <span key={state.label} className={clsx('btn-label', s.submitLabel)}>
            {state.label}
          </span>
        </button>

        <p className={clsx(s.status, 'label')} aria-live="polite">
          {formError ?? state.status}
        </p>
      </div>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className={clsx(s.error, 'label')} role="alert">
      <Apex size={12} direction="up" className={s.errorIcon} />
      {message}
    </p>
  )
}

type TextFieldProps = {
  name: Exclude<FieldName, 'projectType'>
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  complete: boolean
  disabled: boolean
  type?: 'text' | 'email' | 'tel'
  multiline?: boolean
}

function TextField({
  name,
  value,
  onChange,
  onBlur,
  error,
  complete,
  disabled,
  type = 'text',
  multiline = false,
}: TextFieldProps) {
  const config = form.fields[name]
  const id = `field-${name}`
  const errorId = `error-${name}`
  const helper = 'helper' in config ? config.helper : undefined
  const helperId = helper ? `helper-${name}` : undefined

  const shared = {
    id,
    name,
    value,
    disabled,
    placeholder: config.placeholder,
    'aria-invalid': Boolean(error),
    'aria-describedby': [error ? errorId : null, helperId].filter(Boolean).join(' ') || undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onBlur,
  }

  return (
    <div className={clsx(s.field, error && s.fieldInvalid)}>
      <label htmlFor={id} className={clsx(s.label, 'label')}>
        <span className={s.labelIndex}>{config.index}</span>
        <span>{config.label}</span>
        {config.required && (
          <>
            <span className={s.required} aria-hidden="true">
              +
            </span>
            <span className="visually-hidden">required</span>
          </>
        )}
      </label>

      {helper && (
        <span id={helperId} className={clsx(s.helper, 'label')}>
          {helper}
        </span>
      )}

      <div className={s.inputWrap}>
        {multiline ? (
          <textarea {...shared} className={s.textarea} rows={4} />
        ) : (
          <input {...shared} type={type} className={s.input} autoComplete={autoCompleteFor(name)} />
        )}
        <span className={s.focusRule} aria-hidden="true" />
        <Cross className={clsx(s.stamp, complete && s.stampOn)} />
      </div>

      <span className={s.errorSlot}>
        {error && <FieldError id={errorId} message={error} />}
      </span>
    </div>
  )
}

function autoCompleteFor(name: string): string {
  if (name === 'name') return 'name'
  if (name === 'email') return 'email'
  if (name === 'phone') return 'tel'
  return 'off'
}
