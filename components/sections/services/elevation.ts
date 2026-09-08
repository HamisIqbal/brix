/** Geometry for the wall section drawing, in the real order of construction. */

export type CourseGeometry = {
  course: number
  x: number
  y: number
  w: number
  h: number
  /** Number of vertical joints; alternating offset gives running bond. */
  joints: number
}

export const VIEWBOX = { w: 220, h: 380 }

/** Bottom-up: footing, block, brick, stone, outdoor, cap. */
export const COURSES: readonly CourseGeometry[] = [
  { course: 1, x: 10, y: 320, w: 200, h: 44, joints: 4 },
  { course: 2, x: 30, y: 268, w: 160, h: 46, joints: 3 },
  { course: 3, x: 30, y: 208, w: 160, h: 54, joints: 5 },
  { course: 4, x: 30, y: 156, w: 160, h: 46, joints: 4 },
  { course: 5, x: 30, y: 104, w: 160, h: 46, joints: 3 },
  { course: 6, x: 20, y: 70, w: 180, h: 28, joints: 2 },
]

export function jointLines(g: CourseGeometry): number[] {
  const step = g.w / (g.joints + 1)
  // Half-unit offset per course: the bond pattern, drawn.
  const shift = g.course % 2 === 0 ? step / 2 : 0
  return Array.from({ length: g.joints }, (_, i) => g.x + step * (i + 1) + shift).filter(
    (x) => x > g.x + 4 && x < g.x + g.w - 4,
  )
}

export function courseFor(course: number): CourseGeometry {
  return COURSES.find((c) => c.course === course) ?? (COURSES[0] as CourseGeometry)
}
