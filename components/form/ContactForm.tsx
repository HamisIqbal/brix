'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { form, PROJECT_TYPES, type ProjectType } from '@/content/form'
import { business } from '@/content/business'
import { contactSchema, collectErrors, type FieldErrors, type FieldName } from '@/lib/form/schema'
import { acceptMedia, formatBytes } from '@/lib/form/media'
import { useMotion } from '@/components/motion/MotionProvider'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'
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

type Missing = { key: FieldName; text: string }

const EMPTY: Values = { name: '', email: '', phone: '', projectType: '', job: '', company: '' }
const REQUIRED: FieldName[] = ['name', 'email', 'projectType', 'job']
const ORDER: FieldName[] = ['name', 'email', 'phone', 'projectType', 'job']
const JOB_MIN = 20

/** Every unmet requirement, in form order, phrased as what is still needed. */
function missingFrom(values: Values, errors: FieldErrors): Missing[] {
  const t = form.missing
  const out: Missing[] = []
  for (const key of ORDER) {
    if (!errors[key]) continue
    if (key === 'name') out.push({ key, text: t.name })
    if (key === 'email') out.push({ key, text: values.email.trim() ? t.emailInvalid : t.email })
    if (key === 'phone') out.push({ key, text: t.phoneInvalid })
    if (key === 'projectType') out.push({ key, text: t.projectType })
    if (key === 'job') {
      const len = values.job.trim().length
      out.push({ key, text: len > 0 ? t.jobShort(JOB_MIN - len) : t.job })
    }
  }
  return out
}

function focusField(key: FieldName) {
  const el =
    key === 'projectType'
      ? document.querySelector<HTMLElement>('[data-chip][tabindex="0"]')
      : document.getElementById(`field-${key}`)
  el?.focus()
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [files, setFiles] = useState<File[]>([])
  const [fileNotes, setFileNotes] = useState<string[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [receipt, setReceipt] = useState<{ name: string; email: string; files: number } | null>(null)

  const set = (key: keyof Values, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  // One parse per change, shared by the progress bar and the still-needed list.
  const liveErrors = useMemo(() => {
    const parsed = contactSchema.safeParse(values)
    return parsed.success ? {} : collectErrors(parsed.error)
  }, [values])
  const missing = useMemo(() => missingFrom(values, liveErrors), [values, liveErrors])
  const completed = REQUIRED.filter((key) => !liveErrors[key])

  // Validation runs on blur, never on keystroke. Turning a field red while
  // someone is still typing is hostile. Once a submit has been attempted,
  // errors clear as soon as the field is fixed.
  const validateField = (key: FieldName) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => {
      const next = { ...prev }
      if (liveErrors[key]) next[key] = liveErrors[key]
      else delete next[key]
      return next
    })
  }
  useEffect(() => {
    if (!attempted) return
    setErrors((prev) => {
      const next: FieldErrors = {}
      for (const key of Object.keys(prev) as FieldName[]) {
        if (liveErrors[key]) next[key] = liveErrors[key]
      }
      return next
    })
  }, [attempted, liveErrors])

  const addFiles = (incoming: File[]) => {
    const { files: next, rejected } = acceptMedia(files, incoming)
    setFiles(next)
    setFileNotes(rejected)
  }
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFileNotes([])
  }

  // Stable identity: the dialog's focus trap re-binds whenever this changes.
  const reset = useCallback(() => {
    setValues(EMPTY)
    setFiles([])
    setFileNotes([])
    setErrors({})
    setTouched({})
    setAttempted(false)
    setFormError(null)
    setProgress(0)
    setStatus('idle')
    setReceipt(null)
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsed = contactSchema.safeParse(values)

    if (!parsed.success) {
      const all = collectErrors(parsed.error)
      setErrors(all)
      setAttempted(true)
      setTouched({ name: true, email: true, phone: true, projectType: true, job: true })
      setFormError(form.messages.incomplete)
      const first = ORDER.find((k) => all[k])
      if (first) focusField(first)
      return
    }

    setStatus('sending')
    setFormError(null)
    setProgress(0)

    const body = new FormData()
    for (const [key, value] of Object.entries(parsed.data)) {
      if (typeof value === 'string') body.append(key, value)
    }
    body.append('company', values.company)
    for (const file of files) body.append('media', file, file.name)

    try {
      // XHR rather than fetch: it reports upload progress, which matters when
      // someone sends a video from a phone.
      const code = await new Promise<number>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/contact')
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => resolve(xhr.status)
        xhr.onerror = () => reject(new Error('network'))
        xhr.send(body)
      })

      if (code === 429) {
        setStatus('error')
        setFormError(form.messages.rateLimited)
        return
      }
      if (code === 413) {
        setStatus('error')
        setFormError(form.messages.tooLarge)
        return
      }
      if (code < 200 || code >= 300) throw new Error('request failed')

      setStatus('sent')
      setReceipt({
        name: parsed.data.name.trim().split(/\s+/)[0] ?? parsed.data.name,
        email: parsed.data.email,
        files: files.length,
      })
    } catch {
      setStatus('error')
      setFormError(form.messages.submitFailed)
    }
  }

  const sending = status === 'sending'
  const state = status === 'sent' ? form.states.sent : sending ? form.states.sending : form.states.idle
  const locked = sending || status === 'sent'
  const sendingLabel = files.length > 0 && progress > 0 && progress < 100 ? `${state.label} ${progress}%` : state.label

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
    <>
      <form className={s.form} onSubmit={onSubmit} noValidate>
        <div className={s.progressRow}>
          <div className={s.progress} aria-hidden="true">
            {REQUIRED.map((key) => (
              <span
                key={key}
                className={clsx(s.progressCell, isComplete(key) && s.progressCellOn)}
              />
            ))}
          </div>
          <p className={clsx(s.progressCount, 'label')} aria-live="polite">
            {completed.length} / {REQUIRED.length} required
          </p>
        </div>

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
          complete={Boolean(values.phone) && !liveErrors.phone}
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

        <MediaField
          files={files}
          notes={fileNotes}
          disabled={locked}
          onAdd={addFiles}
          onRemove={removeFile}
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

        <MissingList items={missing} emphasised={attempted} />

        <div className={s.submitRow}>
          <button type="submit" className={s.submit} disabled={locked} aria-busy={sending}>
            <span
              className={clsx(s.drain, sending && (files.length > 0 ? s.drainMeasured : s.drainOn))}
              style={
                sending && files.length > 0
                  ? { transform: `scaleX(${progress / 100})` }
                  : undefined
              }
              aria-hidden="true"
            />
            {status === 'sent' && <Apex size={12} direction="up" />}
            {/* The label LAYs out and the new one LAYs in — a CSS keyframe
                keyed on the label itself, so no animation library is needed. */}
            <span key={state.label} className={clsx('btn-label', s.submitLabel)}>
              {sending ? sendingLabel : state.label}
            </span>
          </button>

          <p className={clsx(s.status, formError && s.statusError, 'label')} aria-live="polite">
            {formError ?? state.status}
          </p>
        </div>
      </form>

      <SuccessDialog receipt={receipt} onClose={reset} />
    </>
  )
}

/* ── Still needed ─────────────────────────────────────────── */

function MissingList({ items, emphasised }: { items: Missing[]; emphasised: boolean }) {
  const ready = items.length === 0
  return (
    <div
      className={clsx(s.missing, ready && s.missingReady, emphasised && !ready && s.missingLoud)}
      data-missing
    >
      <p className={clsx(s.missingHead, 'label')} aria-live="polite">
        {ready ? (
          <>
            <Cross className={s.missingStamp} />
            <span>{form.missing.ready}</span>
          </>
        ) : (
          <>
            <span className={s.missingCount}>{items.length}</span>
            <span>{form.missing.heading}</span>
          </>
        )}
      </p>
      {!ready && (
        <ul className={s.missingList}>
          {items.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={s.missingItem}
                onClick={() => focusField(item.key)}
                data-missing-item={item.key}
              >
                <Apex size={12} direction="right" className={s.missingIcon} />
                <span>{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── Photos or video ──────────────────────────────────────── */

function MediaField({
  files,
  notes,
  disabled,
  onAdd,
  onRemove,
}: {
  files: File[]
  notes: string[]
  disabled: boolean
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
}) {
  const config = form.fields.media
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const full = files.length >= form.mediaLimits.maxFiles

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setOver(false)
    if (disabled) return
    onAdd(Array.from(e.dataTransfer.files))
  }

  return (
    <div className={s.field}>
      <span className={clsx(s.label, 'label')} id="label-media">
        <span className={s.labelIndex}>{config.index}</span>
        <span>{config.label}</span>
        <span className={s.optional}>OPTIONAL</span>
      </span>
      <span id="helper-media" className={clsx(s.helper, 'label')}>
        {config.helper}
      </span>

      <input
        ref={inputRef}
        id="field-media"
        type="file"
        multiple
        accept={form.mediaLimits.accept}
        className={s.fileInput}
        disabled={disabled || full}
        aria-labelledby="label-media"
        aria-describedby="helper-media limits-media"
        onChange={(e) => {
          onAdd(Array.from(e.target.files ?? []))
          // Clear so picking the same file again after removing it still fires.
          e.target.value = ''
        }}
      />
      <label
        htmlFor="field-media"
        className={clsx(s.drop, over && s.dropOver, (disabled || full) && s.dropOff)}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <span className={s.dropMark} aria-hidden="true">
          <Apex size={28} direction="up" strokeWidth={2} />
        </span>
        <span className={s.dropText}>
          <span className={s.dropTitle}>{over ? config.dropActive : config.drop}</span>
          <span className={clsx(s.dropHint, 'label')}>
            {full ? form.messages.fileCount : config.dropHint}
          </span>
        </span>
      </label>
      <span id="limits-media" className={clsx(s.helper, s.limits, 'label')}>
        {config.limits}
      </span>

      {files.length > 0 && (
        <ul className={s.files} aria-label="Attached files">
          {files.map((file, i) => (
            <FileRow
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              disabled={disabled}
              onRemove={() => onRemove(i)}
            />
          ))}
        </ul>
      )}

      <span className={s.errorSlot} aria-live="polite">
        {notes.map((note) => (
          <span key={note} className={clsx(s.error, 'label')}>
            <Apex size={12} direction="up" className={s.errorIcon} />
            {note}
          </span>
        ))}
      </span>
    </div>
  )
}

function FileRow({ file, disabled, onRemove }: { file: File; disabled: boolean; onRemove: () => void }) {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  const [url, setUrl] = useState<string | null>(null)
  const [broken, setBroken] = useState(false)

  // Object URLs are created and revoked with the row, so previews never leak.
  useEffect(() => {
    if (!isImage && !isVideo) return
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file, isImage, isVideo])

  return (
    <li className={s.fileRow}>
      <span className={s.thumb} aria-hidden="true">
        {url && isImage && !broken && (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img src={url} alt="" onError={() => setBroken(true)} />
        )}
        {url && isVideo && !broken && (
          <video src={url} muted playsInline preload="metadata" onError={() => setBroken(true)} />
        )}
        <span className={clsx(s.thumbTag, 'label')}>{isVideo ? 'VIDEO' : 'PHOTO'}</span>
      </span>
      <span className={s.fileMeta}>
        <span className={s.fileName}>{file.name}</span>
        <span className={clsx(s.fileSize, 'label')}>{formatBytes(file.size)}</span>
      </span>
      <button
        type="button"
        className={s.fileRemove}
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
      >
        <span className={s.fileRemoveMark} aria-hidden="true" />
      </button>
    </li>
  )
}

/* ── Success ──────────────────────────────────────────────── */

function SuccessDialog({
  receipt,
  onClose,
}: {
  receipt: { name: string; email: string; files: number } | null
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { lenis } = useMotion()
  const open = receipt !== null
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useScrollLock(open, lenis)
  useFocusTrap(ref, open, onClose)

  if (!mounted || !receipt) return null

  // Portalled to <body>: a transformed Reveal ancestor would otherwise become
  // the containing block for position: fixed.
  return createPortal(
    <div className={s.dialogBackdrop} onClick={onClose}>
      <div
        ref={ref}
        className={s.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-heading"
        aria-describedby="success-body"
        data-success
        onClick={(e) => e.stopPropagation()}
      >
        <span className={s.dialogRule} aria-hidden="true" />
        <span className={s.dialogApex} aria-hidden="true">
          <Apex size={40} direction="up" strokeWidth={2} />
        </span>
        <p className={clsx(s.dialogEyebrow, 'label')}>{form.success.eyebrow}</p>
        <h2 id="success-heading" className={clsx(s.dialogHeading, 'h2')}>
          {form.success.heading(receipt.name)}
        </h2>
        <p id="success-body" className={s.dialogBody}>
          {form.success.body(receipt.email, receipt.files)}
        </p>
        <div className={s.dialogActions}>
          <button type="button" className={s.submit} onClick={onClose}>
            <span className="btn-label">{form.success.done}</span>
          </button>
          <a href={`tel:${business.phone.raw}`} className={clsx(s.dialogLink, 'label')}>
            CALL {business.phone.display}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* ── Fields ───────────────────────────────────────────────── */

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
        {config.required ? (
          <>
            <span className={s.required} aria-hidden="true">
              +
            </span>
            <span className="visually-hidden">required</span>
          </>
        ) : (
          <span className={s.optional}>OPTIONAL</span>
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
