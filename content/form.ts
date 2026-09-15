import { business } from './business'

export const PROJECT_TYPES = ['BRICK', 'BLOCK', 'STONE', 'CONCRETE', 'OUTDOOR', 'CUSTOM'] as const
export type ProjectType = (typeof PROJECT_TYPES)[number]

export const form = {
  fields: {
    name: { index: '01', label: 'NAME', placeholder: 'Your name', required: true },
    email: { index: '02', label: 'EMAIL', placeholder: 'you@email.com', required: true },
    phone: {
      index: '03',
      label: 'PHONE',
      placeholder: '901-000-0000',
      helper: 'Fastest way to reach you',
      required: false,
    },
    projectType: { index: '04', label: 'PROJECT TYPE', helper: 'Select one', required: true },
    job: {
      index: '05',
      label: 'THE JOB',
      placeholder: 'What you want built, and where',
      helper: 'Rough size, materials, and when you would like it done',
      required: true,
    },
    media: {
      index: '06',
      label: 'PHOTOS OR VIDEO',
      helper: 'A picture of the spot makes the estimate faster',
      required: false,
      drop: 'Add photos or video',
      dropHint: 'Drag files here or browse',
      dropActive: 'Drop to add',
      limits: 'JPG · PNG · HEIC · MP4 · MOV — up to 5 files, 10 MB each',
    },
  },
  /** Shared by the client and the Route Handler, so both enforce the same caps. */
  mediaLimits: {
    maxFiles: 5,
    maxFileBytes: 10 * 1024 * 1024,
    maxTotalBytes: 20 * 1024 * 1024,
    accept: 'image/*,video/*,.heic,.heif',
  },
  /** What the "still needed" list says for each unmet requirement. */
  missing: {
    heading: 'STILL NEEDED',
    ready: 'Everything is in. Ready to send.',
    name: 'Your name',
    email: 'An email we can reply to',
    emailInvalid: 'A complete email address',
    phoneInvalid: 'A complete phone number — or clear the field',
    projectType: 'A project type',
    job: 'A description of the job',
    jobShort: (left: number) => `${left} more character${left === 1 ? '' : 's'} in the job description`,
  },
  messages: {
    nameRequired: 'A name is needed.',
    emailRequired: 'An email address is needed.',
    emailInvalid: 'That address is not complete.',
    phoneInvalid: 'That number is not complete.',
    typeRequired: 'Select a project type.',
    jobRequired: 'Describe the job.',
    jobShort: 'A little more detail helps the estimate.',
    submitFailed: `That did not send. Call ${business.phone.display} or email ${business.email}.`,
    rateLimited: 'Too many attempts. Try again shortly.',
    incomplete: 'A few things are still needed — see the list above the button.',
    tooLarge: 'The files are too large to send. Remove some and try again.',
    fileType: (name: string) => `${name} is not a photo or video.`,
    fileSize: (name: string) => `${name} is over 10 MB.`,
    fileCount: 'Up to 5 files. Remove one to add another.',
    fileTotal: 'Files add up to more than 20 MB. Remove one to add another.',
  },
  states: {
    idle: { label: 'SEND REQUEST', status: 'Estimates are free.' },
    sending: { label: 'SENDING', status: '' },
    sent: { label: 'REQUEST RECEIVED', status: 'We will be in touch.' },
  },
  success: {
    eyebrow: 'REQUEST RECEIVED',
    heading: (name: string) => `Thanks, ${name}. We have it.`,
    body: (email: string, files: number) =>
      [
        `A reply will come to ${email}.`,
        files > 0 ? `${files} file${files === 1 ? '' : 's'} attached.` : null,
        'Estimates are free.',
      ]
        .filter(Boolean)
        .join(' '),
    done: 'DONE',
  },
  useful: {
    heading: 'USEFUL TO INCLUDE',
    items: [
      'What you want built',
      'Rough size or dimensions',
      'A photo of the location',
      'When you would like it done',
    ],
  },
} as const
