# Verification suites

All five run against a **production build served on :3210**:

```
npm run build && npx next start -p 3210
npm run qa:all
```

| Script | What it proves |
|---|---|
| `qa` | Nine widths (360→1920): no console errors, no horizontal overflow, no broken or collapsed image boxes, no text clipped by its aperture, no fixed overlay covering the page, nothing left unrevealed. |
| `qa:interact` | Menu (open/close/focus trap/Escape/focus return/scroll lock/navigate) at 3 widths, route transitions incl. browser back, contact-form validation and submit, keyboard path and focus rings. |
| `qa:nojs` | Every route renders complete and navigable with JavaScript disabled. |
| `qa:motion` | Reduced motion settles to byte-for-byte the same *layout* as the animated path. |
| `qa:vitals` | CLS and LCP per route. |

A stale `next start` serving a replaced `.next` produces phantom 400s on hashed
CSS and apparently-unstyled layout. `scripts/serve.sh` rebuilds and kills the
old listener first — do not skip it.
