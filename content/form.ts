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
      helper: 'A photo helps — you can send one by email',
      required: true,
    },
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
  },
  states: {
    idle: { label: 'SEND REQUEST', status: 'Estimates are free.' },
    sending: { label: 'SENDING', status: '' },
    sent: { label: 'REQUEST RECEIVED', status: 'We will be in touch.' },
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
