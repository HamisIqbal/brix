import { courseFor, jointLines } from './elevation'
import s from './services.module.css'

/**
 * The mobile expression of the elevation: each service is preceded by its own
 * single-course fragment of the drawing. The wall still builds as you descend;
 * it is distributed rather than sticky — a simpler expression of the same idea,
 * not a truncated version of the desktop one (§12.4).
 */
export function CourseFragment({ course }: { course: number }) {
  const g = courseFor(course)

  return (
    <svg
      className={s.fragment}
      viewBox={`${g.x} ${g.y} ${g.w} ${g.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect
        className={s.courseShape}
        x={g.x + 0.5}
        y={g.y + 0.5}
        width={g.w - 1}
        height={g.h - 1}
      />
      {jointLines(g).map((jx) => (
        <line key={jx} className={s.courseJoint} x1={jx} y1={g.y} x2={jx} y2={g.y + g.h} />
      ))}
    </svg>
  )
}
