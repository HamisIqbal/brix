import { business } from './business'

/** The complete sanctioned CTA set — content deck §1.3. Nothing else on a button. */
export const cta = {
  estimate: 'REQUEST AN ESTIMATE',
  submit: 'SEND REQUEST',
  work: 'SEE THE WORK',
  call: `CALL ${business.phone.display}`,
  services: 'WHAT WE LAY',
  next: 'NEXT PROJECT',
  note: 'Estimates are free.',
} as const
