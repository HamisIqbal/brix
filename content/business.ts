/**
 * The [[CLIENT]] surface. Only supplied facts appear here as real values.
 * Anything unsupplied stays a placeholder and is REMOVED at render time by
 * <Fact>, never invented and never approximated.
 */
export const business = {
  phone: { raw: '+19013509597', display: '901-350-9597' },
  email: 'brixmasonrycontact@gmail.com',
  freeEstimates: true,

  // Not supplied. Rendered as nothing until the client provides them.
  instagram: '[[CLIENT: INSTAGRAM]]',
  serviceArea: '[[CLIENT: SERVICE AREA]]',
  address: '[[CLIENT: ADDRESS]]',
  hours: '[[CLIENT: HOURS]]',
} as const

const PLACEHOLDER = /^\[\[CLIENT:/

export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value !== 'string' || value.length === 0 || PLACEHOLDER.test(value)
}

/** Returns the value only if it is a real supplied fact. */
export function fact(value: string | undefined | null): string | null {
  return isPlaceholder(value) ? null : (value as string)
}
