# BRIX — Frontend Architecture

**Version** 1.0 · **Status** Specification, pre-implementation
**Implements** `brix-visual-design-system.md` · `brix-motion-system.md` · `brix-home-page-design.md`
**Stack** Next.js 15 (App Router) · React 19 · TypeScript (strict) · GSAP + ScrollTrigger · Framer Motion · Lenis

---

## 0. The three laws

Everything in this document derives from three constraints. When a decision is unclear, resolve against these in order.

### Law 1 — The server/client boundary is drawn around *behavior*, not around *sections*

A section that animates does **not** become a Client Component. The section's markup stays on the server; a thin client wrapper claims it and animates it. React lets a Client Component receive server-rendered `children` as an opaque `ReactNode`, and this project uses that fact as its primary architectural tool.

```tsx
// app/(site)/page.tsx — Server Component
<Reveal>                        {/* 'use client' — ~40 lines, ships once */}
  <CourseArgument />            {/* Server Component — ships zero JS */}
</Reveal>
```

`CourseArgument` renders on the server, ships as HTML, and is never in the client bundle. `Reveal` is in the bundle exactly once no matter how many sections use it. **This is the pattern that keeps a heavily-animated site almost entirely server-rendered**, and violating it is the fastest way to ship 300KB of section components to the browser.

The corollary, which is the actual rule to enforce in review:

> **`'use client'` appears only in files whose name is the name of a behavior.**
> `Reveal`, `MagneticButton`, `MenuOverlay`, `CursorFollower`, `HeroVideo`, `ContactForm`.
> Never in a file whose name is the name of a *place*: `CourseHero`, `CourseMethod`, `WorkIndex`, `Footer`.

### Law 2 — One animation clock, one cleanup mechanism

GSAP's ticker is the site's only animation clock; Lenis is bound to it; nothing runs its own `requestAnimationFrame`. Every GSAP call is inside `useGSAP()` with a `scope`, so unmount reverts it automatically. Every ScrollTrigger has a stable `id`. There is no code path that creates an animation without a registered teardown.

### Law 3 — Content is data, layout is composition, motion is a wrapper

Copy, project records, service records and image metadata live in typed modules under `content/`. Sections read from them; nothing is hardcoded in JSX except structural markup. This is what makes `[[CLIENT: PHONE]]` placeholders enumerable at build time (§7.3) and what stops the eleven-image distribution map (§5.6 of the design system) from drifting.

---

## 1. App Router structure

### 1.1 Route tree

```
app/
├─ layout.tsx                 Server · <html>, fonts, tokens, JSON-LD, MotionProvider
├─ template.tsx               Client · PageTransition (AnimatePresence needs a remount boundary)
├─ page.tsx                   Server · Home
├─ not-found.tsx              Server
├─ error.tsx                  Client (required by React)
├─ global-error.tsx           Client (required by React)
├─ robots.ts                  Server · metadata route
├─ sitemap.ts                 Server · metadata route
├─ opengraph-image.tsx        Server · static OG, generated at build
├─ icon.svg / apple-icon.png
│
├─ work/
│  ├─ page.tsx                Server · index (ledger rows + plate grid)
│  ├─ opengraph-image.tsx
│  └─ [slug]/
│     ├─ page.tsx             Server · project detail
│     ├─ opengraph-image.tsx  Server · per-project OG
│     └─ not-found.tsx
├─ services/page.tsx          Server · The Elevation
├─ about/page.tsx             Server
└─ contact/page.tsx           Server · form island only
```

**Five pages plus project details.** No route groups: there is one shell and every page uses it, so a `(site)` group would add a directory for no behavioral difference. If a bare-shell route ever appears (a print view, an estimate PDF preview), *that* is when a group earns its place.

### 1.2 Why `template.tsx` and not `layout.tsx` for transitions

`layout.tsx` persists across navigations — its children change but it does not remount. `template.tsx` remounts on every route change, which is exactly what `AnimatePresence mode="wait"` needs to run an exit animation before the new tree mounts. The cover lives in `template.tsx`; the persistent chrome (rail, menu, cursor, Lenis) lives in `layout.tsx` and must *not* remount, or Lenis would be destroyed and recreated on every navigation.

This split is the single most important routing decision in the project. Getting it backwards produces either no exit animation or a scroll engine that reinitialises four times a minute.

### 1.3 Root layout composition

```tsx
// app/layout.tsx — Server Component
<html lang="en" className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}>
  <body>
    <SkipLink />                    {/* Server */}
    <MotionProvider>                {/* Client · Lenis + GSAP registration + reduced-motion */}
      <Rail />                      {/* Server shell, client islands inside */}
      <MenuOverlay />               {/* Client · presence */}
      <CursorFollower />            {/* Client · lazy, pointer-fine only */}
      <main id="main">{children}</main>
      <SiteFooter />                {/* Server */}
      <MobileActionBar />           {/* Client · one IntersectionObserver */}
    </MotionProvider>
    <LocalBusinessJsonLd />         {/* Server */}
  </body>
</html>
```

`MotionProvider` is a Client Component that renders `{children}` — so everything inside it stays server-rendered. It provides no visual output; it owns Lenis, the GSAP plugin registration, the `matchMedia` contexts, and the reduced-motion signal.

### 1.4 Rendering strategy

Every route is **statically generated**. There is no dynamic data: content is compiled from `content/`, and the contact form posts to a Route Handler. `export const dynamic = 'error'` on each page so any accidental dynamic API use fails the build rather than silently opting the route into SSR.

`app/api/contact/route.ts` is the only dynamic surface — `runtime: 'nodejs'`, POST only, with rate limiting and a honeypot check.

---

## 2. Page structure

### 2.1 The composition pattern

A page file is a **manifest**, not a component. It reads content, orders sections, and does nothing else. Target: **under 60 lines, zero markup beyond section elements.**

```tsx
// app/page.tsx — Server Component
import { home } from '@/content/pages/home'

export const metadata = pageMetadata('home')

export default function HomePage() {
  return (
    <>
      <CourseHero content={home.hero} />                       {/* 01 · own entrance timeline */}
      <Reveal><CourseArgument content={home.argument} /></Reveal>      {/* 02 */}
      <Reveal><CourseCapabilities items={home.capabilities} /></Reveal> {/* 03 */}
      <Reveal><CourseSelected projects={home.selected} /></Reveal>      {/* 04 */}
      <Reveal><CourseMethod steps={home.method} /></Reveal>             {/* 05 */}
      <Reveal><CourseMaterial pair={home.material} /></Reveal>          {/* 06 */}
      <CourseEstimate content={home.estimate} />                        {/* 07 · form island */}
    </>
  )
}
```

Eight courses, eight files, one manifest. **There is no `HomePage` component containing the page** — the route file *is* the composition, and the sections are siblings. This is what "avoid a giant monolithic page component" means concretely: the page's total JSX is the list above.

### 2.2 Section contract

Every section component, on every page, obeys the same five rules:

1. It is a **Server Component** unless it contains a form or a media element that needs lifecycle.
2. It renders exactly one `<section>` with an `id` (used by the course counter and anchor navigation) and an `aria-labelledby` pointing at its own heading.
3. It receives its content as a **typed prop**, never importing content directly. This makes sections reusable across pages and testable in isolation.
4. It emits `data-reveal` attributes on its animatable children (§4.3). It does not import GSAP.
5. It reserves space for every image and never depends on JS for layout.

### 2.3 Section index

| Route | Sections |
|---|---|
| Home | `CourseHero` · `CourseArgument` · `CourseCapabilities` · `CourseSelected` · `CourseMethod` · `CourseMaterial` · `CourseEstimate` |
| Work | `WorkHeader` · `WorkLedger` · `WorkPlateGrid` |
| Work/[slug] | `ProjectHeader` · `ProjectPlates` · `ProjectSpec` · `ProjectNext` |
| Services | `ServicesHeader` · `ServicesElevation` · `ServicesEstimateCta` |
| About | `AboutHeader` · `AboutStatement` · `AboutHonesty` · `AboutDetail` |
| Contact | `ContactHeader` · `ContactForm` · `ContactConditions` |

Shared across routes: `SectionHeader` (the three-part eyebrow/header/support block from design system §9.4), `EstimateCta`, `SiteFooter`.

---

## 3. Component architecture

### 3.1 The category set

The proposed structure was close. Four changes, each for a reason:

| Change | Why |
|---|---|
| `sections/` is **split by route** (`sections/home/`, `sections/work/`…), with `sections/shared/` | Sections are not reusable across routes in practice; a flat folder of 22 files with no ownership is where architectures rot. Route-scoped folders make dead code obvious when a page changes. |
| `hero/` **folded into** `sections/home/` | The hero is Home's first course, not a category. A top-level folder for one page's first section is a category of one. |
| `navigation/` **absorbed into** `chrome/` alongside the rail, cursor, transition and mobile bar | These are the persistent viewport furniture that lives in `layout.tsx`. They share concerns (fixed positioning, scroll-lock, focus management) that a `navigation/` folder alone doesn't capture. |
| `media/` **added**, separate from `ui/` | Images and video have their own loading, decoding and lifecycle rules (§11, §12). Mixing `Plate` and `Video` in with `Button` and `Rule` hides the most performance-critical components in the project. |

Final categories:

```
components/
├─ chrome/        Persistent viewport furniture (rail, menu, cursor, transition, mobile bar)
├─ layout/        Structural primitives (Grid, Course, Panel, Joint, Section)
├─ sections/      Page content, route-scoped
│  ├─ home/  work/  services/  about/  contact/  shared/
├─ motion/        Animation primitives — the only place GSAP is imported in components/
├─ media/         Plate, Figure, Video, poster and preview handling
├─ form/          Field, Chip, SubmitButton, form state
└─ ui/            Button, Link, Rule, Apex, Cross, Bracket, Label, Index, Eyebrow
```

### 3.2 The client-component census

**A complete list of every `'use client'` file in the project.** If a new one appears, it needs a justification in review.

| File | Why it must be client |
|---|---|
| `MotionProvider` | Lenis instance, GSAP registration, matchMedia contexts |
| `PageTransition` | `AnimatePresence` |
| `Reveal` | ScrollTrigger |
| `ScrollProgress` | ScrollTrigger |
| `CourseCounter` | ScrollTrigger |
| `MenuTrigger` | Open/close state |
| `MenuOverlay` | Presence, focus trap, scroll lock |
| `CursorFollower` | Pointer events |
| `MobileActionBar` | IntersectionObserver |
| `HeroTimeline` | GSAP timeline |
| `HeroVideo` | Media lifecycle, autoplay fallback |
| `SplitLines` | DOM splitting after hydration |
| `Parallax` | ScrollTrigger scrub |
| `MagneticButton` | Pointer events |
| `LedgerRow` | Hover preview coordination |
| `ProjectPreview` | Presence + pointer position |
| `ElevationDiagram` | Pinned ScrollTrigger |
| `ContactForm` | Form state |
| `FooterMonument` | GSAP timeline |
| `error.tsx` / `global-error.tsx` | Required by React |

**Twenty files.** Everything else — every section, every layout primitive, every static UI element, the entire footer apart from the monument's timeline — is a Server Component.

### 3.3 Layout components

Pure, presentational, server-rendered. They encode the design system's grid and shape rules so no section ever writes a raw grid definition.

| Component | Encodes | Props |
|---|---|---|
| `Section` | Section spacing (§3.6), `<section>` + `aria-labelledby`, `id` for the counter | `id`, `spacing`, `bleed`, `labelledBy` |
| `Grid` | The breakout grid (§3.3) — `full` / `content` columns | `as`, `className` |
| `Col` | Column placement with breakpoint-aware spans | `span`, `start`, `bond` |
| `Course` | A horizontal band of unequal panels with the bond offset (D1) | `offset`, `joint` |
| `Panel` | A surface: `ink-100`, 1px `ink-400`, radius 0, no shadow (§9.3) | `tone`, `bordered` |
| `Joint` | The hairline gap between panels (D2) | `size` |
| `Stack` | Vertical rhythm on the 4px scale | `gap` |

`Col`'s `bond` prop applies `--bond-offset` on `md+` and zero below, so the mobile exception in §3.4 is enforced by the primitive rather than remembered by developers.

### 3.4 UI components

Server-rendered, stateless, styled entirely in CSS. These are the design system's shape devices (D3–D8) as real components, so they can be referenced by name in review exactly as §4.2 intended.

| Component | Device | Notes |
|---|---|---|
| `Rule` | D3 | 1px line; `draw` prop adds the `.u-draw` class for a `Reveal` parent to trigger |
| `Apex` | D4 | SVG, 18° at large scale / 30° at ≤24px, per §4.3 |
| `Cross` | D5 | 12×12 red `+`; a dev-mode assertion warns past 4 per viewport |
| `Frame` | D6 | 12px offset outline for work plates |
| `Bracket` | D7 | L-marks at two opposite corners |
| `BondMark` | D8 | The stack; also the menu trigger's resting geometry |
| `Label` | — | Mono 11px eyebrow; optional `+` prefix and index |
| `IndexNumeral` | — | Archivo condensed, tabular figures |
| `Eyebrow` | — | `Rule` + `Label` composite used by every `SectionHeader` |
| `Button` | — | Server-rendered shell; `MagneticButton` wraps it client-side only when needed |
| `TextLink` | — | Ghost tier, two-part underline sweep |

`Button` being server-rendered with a separate client wrapper matters: most buttons on the site are not magnetic (secondary and ghost tiers aren't), so most buttons ship no JS at all.
---

## 4. Motion architecture

### 4.1 Ownership, restated as code boundaries

The motion system's boundary law (§4.1 of that document) becomes a set of import rules that a lint config can enforce:

| Owner | Imports allowed | Enforced by |
|---|---|---|
| **CSS** | — | Hover, focus, active, checked, `data-state`. No JS. |
| **Framer Motion** | `framer-motion` importable in **4 files only** | ESLint `no-restricted-imports` with an allowlist |
| **GSAP** | `gsap`, `@gsap/react`, `gsap/ScrollTrigger` importable in `components/motion/**` and `lib/motion/**` only | Same rule |

Framer Motion's four files: `PageTransition`, `MenuOverlay`, `ProjectPreview`, `SubmitButton`. Imported through `LazyMotion` + `domAnimation` with `m.*` components — the `LazyMotion` boundary sits in `MotionProvider`, so the feature bundle loads once.

**No component outside `components/motion/` imports GSAP.** Sections express animation intent through `data-reveal` attributes and primitive wrappers. That single rule is what keeps GSAP out of 40 files and makes the cleanup contract auditable.

### 4.2 The primitives — which are real, which were rejected

The brief's list, assessed honestly. Six ship. Two do not.

| Proposed | Verdict | Reasoning |
|---|---|---|
| `ScrollReveal` | **Ships as `Reveal`** | The workhorse. Wraps server children, runs The Course composite. Used ~40 times. |
| `SplitText` | **Ships as `SplitLines`** | Required infrastructure (motion system §8.1). Bespoke, ~40 lines, no plugin license. |
| `ParallaxImage` | **Ships as `Parallax`** | Generalised to any child, not just images — large type CARRYs too (motion §8.7). One implementation, two uses. |
| `MagneticButton` | **Ships** | Genuine behavior, pointer-fine only, delegated listener. |
| `PageTransition` | **Ships** | Owns the cover, the scroll reset, the failsafe and the ScrollTrigger lifecycle on navigation. |
| `RevealText` | **Rejected** | It would be `<Reveal><SplitLines>…</SplitLines></Reveal>` with no added logic. A composite with no behavior of its own is an alias, and aliases are how a component library doubles in size without gaining capability. Sections compose the two directly. |
| `RevealImage` | **Rejected** | The mask reveal is not a wrapper — it is intrinsic to `Plate` (§11.2). Every image on the site reveals identically, so the behavior belongs *in* the image component, not in a decorator around it. A `RevealImage` would exist solely to be forgotten on one plate somewhere. |
| `AnimatedLine` | **Rejected as a component; ships as a CSS class** | `Rule` already exists as a UI component. The draw is `.u-draw` — a `transform: scaleX()` transition on a `data-drawn` attribute that any `Reveal` parent sets. A JS component to animate a 1px line's transform would be the clearest possible case of abstraction for its own sake. |

Net: **six primitives**, one of which (`Parallax`) covers two of the brief's entries, and three behaviors that live where they belong rather than in a wrapper.

### 4.3 `Reveal` — the central component

```tsx
'use client'
export function Reveal({ children, start, stagger, once = true }: RevealProps)
```

Renders a `<div>` (or the given element) and nothing else. On mount, inside `useGSAP({ scope })`, it queries its own subtree for `data-reveal` attributes and builds one timeline:

```
[data-reveal="rule"]  → DRAW  scaleX 0→1 from origin        240ms   at t = 0
[data-reveal="line"]  → LAY   clip-path + 0.35em settle     760ms   at t = 80ms  × index
[data-reveal="body"]  → LAY   single mask                   760ms   at t = 240ms
[data-reveal="meta"]  → SET   opacity + 4px rise            420ms   at t = 320ms
```

Design consequences that make this work:

- **Sections stay server-rendered.** They emit attributes; they never import motion code.
- **Mask direction is computed, not authored** — `getBoundingClientRect().left` against the viewport midpoint, per the direction table. One helper, applied everywhere, which is what makes the whole site read as one hand.
- **Initial state is CSS, not JS.** A `[data-reveal]:not([data-revealed])` rule in the global stylesheet applies the closed `clip-path` in the server HTML. GSAP only *releases* it. Two consequences: no FOUC, and no hydration mismatch, because the server and client agree on the initial DOM.
- **A `.no-js` guard and a `@media (prefers-reduced-motion)` override both neutralise that rule**, so content is never hidden by a state only JS can undo. This is the blank-page failure mode and it is designed out rather than tested for.
- **One `Reveal` per section, not per element.** ScrollTrigger count stays at roughly one per section (~8–12 per page), well inside the budget of 24.

### 4.4 `MotionProvider` — the single owner of the clock

Client Component in `layout.tsx`, renders `{children}` unchanged. Responsibilities, in initialisation order:

```
1. gsap.registerPlugin(ScrollTrigger)
2. ScrollTrigger.config({ ignoreMobileResize: true })
3. Read prefers-reduced-motion → context value
4. If motion allowed AND pointer is fine:
     lenis = new Lenis({ lerp: 0.09, duration: 1.1, wheelMultiplier: 1, syncTouch: false })
     lenis.on('scroll', ScrollTrigger.update)
     gsap.ticker.add((t) => lenis.raf(t * 1000))
     gsap.ticker.lagSmoothing(0)
5. Create the three gsap.matchMedia() contexts (desktop / reduced / mobile)
6. document.fonts.ready.then(() => ScrollTrigger.refresh())
7. Expose { lenis, reducedMotion, prefersFinePointer } via context
```

Teardown on unmount: `gsap.ticker.remove(raf)`, `lenis.destroy()`, `mm.revert()`, `ScrollTrigger.killAll()`. It only unmounts on full page unload, but the teardown must exist or React StrictMode's double-invoke in development will produce two Lenis instances and two tickers — which presents as scroll running at double speed, a bug that is baffling if the teardown isn't there.

**`ScrollTrigger.config({ ignoreMobileResize: true })` is not optional.** Without it, the mobile URL bar collapsing fires a resize, which fires a refresh, which recalculates every trigger mid-scroll and produces a visible jump. This is the most common cause of "the site is janky on iOS" in this genre.

### 4.5 Lenis integration rules

| Rule | Reason |
|---|---|
| `syncTouch: false`; **Lenis is not instantiated on coarse pointers at all** | Native momentum beats any emulation. Motion system §4.3. |
| Not instantiated under reduced motion | Smooth scroll *is* motion |
| Instantiated in `layout.tsx`, never in `template.tsx` | Would be destroyed and rebuilt on every navigation |
| All programmatic scrolling goes through `lenis.scrollTo()` with `offset: -88` | The rail height; a jumped-to section must never sit under it |
| `lenis.stop()` / `.start()` for the menu and any modal | Never `overflow: hidden` alone — it loses position on iOS |
| Anchor links use a `useLenis()` hook, never `scrollIntoView` | Two scroll engines fighting produces a visible stutter |
| Falls back to `scrollTo({ behavior: 'smooth' })` when Lenis is absent | The reduced-motion and touch paths must still navigate |

### 4.6 ScrollTrigger lifecycle — the exact contract

This is where sites of this kind actually break. Six rules, all mandatory.

**1. Every trigger is created inside `useGSAP()` with a scope.**

```tsx
useGSAP(() => { /* triggers */ }, { scope: ref, dependencies: [] })
```

`@gsap/react`'s `useGSAP` wraps the body in a `gsap.context()` and calls `.revert()` on unmount — which kills every tween and every ScrollTrigger created inside it, including ones created in nested callbacks. **There is no manual cleanup in this codebase**, because manual cleanup is where leaks come from. This also makes React 19 StrictMode's double-mount a non-event: the first context reverts fully before the second runs.

**2. Every trigger has a stable, unique `id`.**

```
id: `reveal:${sectionId}`   `parallax:${imageId}`   `elevation:course-${n}`
```

Two purposes: `ScrollTrigger.getById()` guards against duplicates, and a dev-only assertion at route-transition-complete fails loudly if the live trigger count exceeds the page's declared budget. A duplicate ScrollTrigger is invisible until it isn't — it double-applies a transform and the element moves twice as far.

**3. Refresh happens on exactly four events, and nothing else.**

| Event | Why |
|---|---|
| `document.fonts.ready` | Archivo's metrics differ from the fallback; every trigger position shifts |
| Route transition complete (after the new tree paints) | Every trigger position is new |
| Debounced **width-only** resize (200ms) | Layout changed |
| Any image `load` on an element without a reserved box | Should never fire — it is a tripwire that logs in development |

**Never on height-only resize.** Mobile chrome collapse fires that constantly (§15.4 of the motion system).

**4. Route changes kill page-scoped triggers before the new page mounts.** Sequence in §4.8.

**5. Pinned triggers get `invalidateOnRefresh: true`** and their pin spacer is inspected on resize. The Services elevation is the only pin; it is created inside a `matchMedia("(min-width: 1024px)")` branch so crossing the breakpoint tears it down and rebuilds it correctly.

**6. `ScrollTrigger.batch()` for sibling groups** (ledger rows, plate grids) — one trigger for twelve rows instead of twelve. This is the difference between 24 triggers on the Work page and 60.

### 4.7 Cleanup contract

| Resource | Created by | Torn down by |
|---|---|---|
| GSAP tweens and timelines | `useGSAP` | Context revert on unmount |
| ScrollTriggers | `useGSAP` | Same |
| `matchMedia` contexts | `MotionProvider`, section-level `mm` | `mm.revert()` |
| Lenis | `MotionProvider` | `lenis.destroy()` + ticker removal |
| `pointermove` delegate | `usePointerDelegate` (one listener, document-level) | Ref-counted; removed at zero subscribers |
| IntersectionObservers | `useInView`, `MobileActionBar`, video | `observer.disconnect()` |
| `quickTo` setters | `MagneticButton`, `CursorFollower` | Garbage-collected with the context |
| `requestAnimationFrame` | **Nowhere.** Only GSAP's ticker. | — |
| Timeouts (transition failsafe) | `PageTransition` | Cleared on success and on unmount |

**The delegated pointer listener deserves emphasis.** Every magnetic button, the cursor follower and the ledger preview subscribe to one `document`-level `pointermove` that is `rAF`-throttled, reads no layout, and is removed when the last subscriber unmounts. Ten magnetic buttons must not mean ten listeners.

### 4.8 Route transition — the exact sequence

The order here is the difference between a clean transition and a page that arrives with stale trigger positions and a mid-page scroll offset.

```
1. User clicks a link. next/link has already prefetched on hover.
2. PageTransition (template.tsx) begins the exit: three cover courses wipe up,
   420ms, --ease-mechanical. A 1200ms failsafe timeout is registered NOW.
3. AnimatePresence mode="wait" holds the new tree until exit completes.
4. On exit complete:
     a. ScrollTrigger.getAll().forEach(t => t.kill())   — page-scoped only;
        layout-scoped triggers (progress rule, counter) are tagged and preserved
     b. lenis.scrollTo(0, { immediate: true })
     c. New tree mounts. Its Reveal components create fresh triggers.
5. Minimum 260ms hold, so an instant route never flickers.
6. Cover courses wipe up and off the top, 420ms.
7. On complete: ScrollTrigger.refresh(), clear the failsafe, restore focus to
   the new page's <h1> (announced via a visually-hidden live region).
```

The failsafe force-completes and removes the cover if step 4 has not fired within 1200ms. Browser back/forward is never blocked; the page is never left covered.

**Focus management on route change is not optional** — a single-page-app navigation that leaves focus on a now-unmounted link is a real accessibility failure, and it is trivially fixed here because the transition already has a completion callback.

### 4.9 Hydration safety

Rules that prevent the whole class of problem:

- **No `window`, `document`, `matchMedia`, `Date.now()` or `Math.random()` in a render body.** All in effects.
- **`SplitLines` splits after hydration, never during render.** The server ships the sentence as one text node with the proper `aria-label`; the client wraps it in spans on mount. The DOM changes *after* hydration, which React permits, whereas rendering different markup on server and client would not.
- **Initial animation states are CSS classes present in the server HTML**, never inline styles set by JS.
- **No `useLayoutEffect` in SSR paths** — `useGSAP` uses `useIsomorphicLayoutEffect` internally, which is one more reason to route everything through it.
- **Reduced-motion is read in an effect, never during render**, with a `useSyncExternalStore` subscription so a mid-session OS setting change is honoured.
- **Nothing renders conditionally on viewport width during SSR.** Mobile/desktop differences are CSS media queries or `matchMedia` contexts created after mount. Rendering a different tree per breakpoint is a hydration mismatch by construction.

---

## 5. Hooks

Eleven hooks. Each has a single responsibility and each is used more than once — that is the bar for a hook existing at all.

| Hook | Returns | Used by |
|---|---|---|
| `useMotionContext()` | `{ lenis, reducedMotion, finePointer }` | Every motion component |
| `useLenis()` | The Lenis instance, or `null` | Anchor links, menu scroll lock, Services jump |
| `useReducedMotion()` | `boolean`, live-updating via `useSyncExternalStore` | Every motion component |
| `usePointerFine()` | `boolean` | Magnetic, cursor, preview |
| `usePointerDelegate(fn)` | Subscribes to the single delegated `pointermove` | Magnetic, cursor, preview |
| `useScrollLock()` | `{ lock, unlock }` — Lenis-aware, iOS-safe | Menu overlay |
| `useFocusTrap(ref, active)` | Traps focus, restores on release | Menu overlay |
| `useInView(ref, opts)` | `boolean` via IntersectionObserver | Video pause, mobile bar, lazy media |
| `useSplitLines(ref, text)` | Splits, re-splits on width change and `fonts.ready` | `SplitLines` |
| `useMediaQuery(q)` | `boolean` (post-mount only, SSR-safe default) | Rare layout branches |
| `useRouteTransition()` | `{ isTransitioning, phase }` | Suppressing hover state and pointer events during a cover |

Deliberately absent: `useScrollProgress`, `useParallax`, `useAnimation`. Each would be a thin wrapper over `useGSAP` that hides where the trigger is created — which is precisely the information a reviewer needs to audit the trigger budget. **Motion stays visible in the components that own it.**

---

## 6. Utilities

```
lib/
├─ motion/
│  ├─ gsap.ts          Plugin registration; the single GSAP import surface
│  ├─ tokens.ts        Durations, easings, stagger — typed, read from CSS custom props
│  ├─ direction.ts     Position → mask direction (the direction table, §6.4)
│  ├─ mask.ts          clip-path string builders for the four origins
│  ├─ stagger.ts       The clamp formula: min(base, 480 / (n - 1))
│  ├─ timeline.ts      buildCourse() — The Course composite as a reusable timeline
│  └─ registry.ts      Trigger id conventions + the dev-mode budget assertion
├─ media/
│  ├─ images.ts        Typed accessors over the generated manifest
│  ├─ sizes.ts         `sizes` attribute builders per treatment (T1–T8)
│  └─ video.ts         Source selection, autoplay probe, poster resolution
├─ seo/
│  ├─ metadata.ts      pageMetadata() — canonical, OG, Twitter, per route
│  └─ jsonld.ts        LocalBusiness / Service / BreadcrumbList builders
├─ content/
│  ├─ placeholders.ts  Detects and enumerates [[CLIENT: ...]] tokens
│  └─ validate.ts      Zod schemas for every content module, run at build
├─ form/
│  ├─ schema.ts        Zod schema shared by client and Route Handler
│  └─ submit.ts        Fetch wrapper with typed error states
└─ utils/
   ├─ cn.ts            Class composition
   ├─ clamp.ts, lerp.ts
   └─ debounce.ts, rafThrottle.ts
```

**`lib/motion/tokens.ts` reads from CSS custom properties rather than duplicating them.** A single `getComputedStyle(document.documentElement)` at init, cached, gives GSAP the same `--dur-reveal` and `--ease-structural` values the stylesheet uses. Two sources of truth for a duration is how a site ends up with a 760ms CSS reveal next to an 800ms GSAP reveal that nobody can explain.

The easing curves are exported as GSAP-compatible `CustomEase`-free strings — `cubic-bezier` values converted once into GSAP's `power` equivalents or, more precisely, registered via `gsap.parseEase()` on the raw bezier so the curves are numerically identical between CSS and JS. This matters: `--ease-structural` appears in both systems and any divergence is visible when a CSS hover runs beside a GSAP reveal.
---

## 7. Content and data files

### 7.1 Content is typed TypeScript, not MDX and not a CMS

Five pages, eleven images, six services, a handful of projects. A CMS would add a network boundary, a build dependency and a schema migration path to a site whose entire content set fits in a few hundred lines. MDX would put copy inside a compiler for no benefit — there is no long-form prose here, only structured fields.

```
content/
├─ site.ts              Name, tagline, nav, canonical URL, social
├─ business.ts          Phone, email, address, service area, hours — the [[CLIENT]] surface
├─ pages/
│  ├─ home.ts           One export per course, typed to each section's props
│  ├─ work.ts   services.ts   about.ts   contact.ts
├─ projects.ts          The project records (slug, index, title, category, spec, images)
├─ services.ts          Six services with elevation course, spec line, detail image
├─ images.generated.ts  BUILD OUTPUT — do not edit (§11.3)
└─ schema.ts            Zod schemas for all of the above
```

### 7.2 Every content module is validated at build

`lib/content/validate.ts` runs every Zod schema in a `prebuild` step. A missing spec line, a project pointing at a nonexistent image, a service without an elevation course — each fails the build with a named error rather than rendering an empty element at runtime.

This is cheap insurance for a specific risk in this project: the design system mandates that **every image carries a bond-pattern spec line** (§1.5) and that **no image repeats within a viewport** (§5.6). Both are checkable, so both are checked.

### 7.3 Client placeholders

Eleven facts are not yet supplied (`[[CLIENT: PHONE]]`, `[[CLIENT: CITY, ST]]`…). The rule from the Home spec is that anything not supplied is **removed, not invented**. Architecturally:

- Placeholders live only in `content/business.ts`, never inline in components.
- `lib/content/placeholders.ts` exports `isPlaceholder(v)` and a build-time scan.
- **Any component receiving a placeholder value renders nothing** — not the label, not the wrapper, not an empty rule. A `<Fact>` helper handles this in one place.
- **The build fails** if a placeholder reaches `metadata`, JSON-LD, or a `sitemap` entry. Shipping `[[CLIENT: PHONE]]` into a `LocalBusiness` schema would be actively harmful to the client's search presence, so it is a hard error rather than a warning.
- A `pnpm check:placeholders` script lists what is still outstanding — the launch checklist, generated rather than maintained.

---

## 8. Styling architecture

**Tailwind CSS v4 for composition · CSS Modules for choreography.** The boundary is explicit:

| Concern | Where |
|---|---|
| Grid, spacing, type scale, color, flow | Tailwind utilities, driven by `@theme` from the design tokens |
| Masks, clip-path states, sweeps, keyframes, `data-state` transitions, `:has()` sibling dimming | CSS Modules, colocated with the component |
| Tokens | One `styles/tokens.css` — the literal §8 token block, imported by both |

The design system already anticipated the Tailwind mapping (§8), and utilities are genuinely better for the grid and spacing work. But `clip-path: inset(-0.15em 0 100% 0)` as an arbitrary-value class is unreadable, and the sweep interactions need real keyframes and pseudo-elements. Splitting on *composition vs. choreography* keeps each tool doing what it is good at, and the split is easy to police: **if a class name contains a motion token, it belongs in a module.**

No runtime CSS-in-JS. Nothing that ships a style engine to the browser.

`styles/tokens.css` is the single source of truth, consumed by `@theme` (for Tailwind), by CSS Modules (via `var()`), and by `lib/motion/tokens.ts` (via `getComputedStyle`). One file, three consumers, no duplication.

---

## 9. Three.js — the decision

**Three.js is not used, and no dependency on it is added.**

The brief says "only where genuinely beneficial," which is an invitation to justify rather than to include. The honest assessment:

| Candidate use | Verdict |
|---|---|
| A shader film-grain / texture overlay | The grain is **baked into the images at build time** (design system §5.2) — deliberately, for consistency across eleven photos and for zero runtime cost. A WebGL grain pass would duplicate it worse and more expensively. |
| A displacement or distortion transition between project images | The image language is explicitly **clip-path masks with counter-scale** (§5.5). A liquid distortion would contradict "structures do not bounce" more directly than almost anything else available. |
| A 3D wall/brick visualisation on Services | The Elevation is a **1px line drawing** — a section drawing, an architectural convention. Rendering it in 3D would make it a product demo, which is a different and weaker idea. |
| A WebGL text effect on the hero | The hero's LCP is real text (§16 of the Home spec). Moving it to a canvas destroys the LCP, selection, SEO and accessibility simultaneously. |

Adding Three.js would cost ~150KB gzipped against a **62KB total motion budget** — it would be 2.4× the entire animation system for effects the design explicitly rejects.

**What would change this:** if the client later supplies photogrammetry or scan data of built work, a single dedicated route (`/work/[slug]/model`) could justify it — lazy-loaded on that route only, behind an explicit user action, disabled under reduced motion, with a static fallback. That is a future feature with its own budget, not a reason to install a renderer now.

---

## 10. SEO

### 10.1 Metadata

`export const metadata` on every static route; `generateMetadata` on `work/[slug]`. Both go through `lib/seo/metadata.ts` so canonical URLs, OG image resolution and title templates are defined once.

```
metadataBase        Set in the root layout; every relative OG URL resolves from it
title.template      "%s — BRIX Masonry & Concrete"
title.default       "BRIX Masonry & Concrete — [[CLIENT: CITY, ST]]"  (placeholder-guarded)
alternates.canonical Per route, absolute
openGraph           type, url, siteName, one 1200×630 image per route
twitter             summary_large_image
robots              index, follow; noindex on any /preview route
```

### 10.2 OG images

`opengraph-image.tsx` per route, using `next/og` at **build time** (static export, not on-demand). Composition follows the brand: black ground, Archivo condensed wordmark, a red 2px foundation rule, and the route's lead image as a graded plate. Project pages generate one per project from the project's own plate.

Not runtime-generated: these are static routes with static content, so an edge function per crawl request would be cost with no benefit.

### 10.3 Structured data

Server-rendered JSON-LD in the root layout and per route:

| Schema | Where | Notes |
|---|---|---|
| `HomeAndConstructionBusiness` | Root layout | The correct specific type, not bare `LocalBusiness`. `areaServed`, `telephone`, `address`, `openingHours`, `image`, `sameAs` (Instagram) |
| `Service` × 6 | Services page | One per capability, each `provider`-linked to the business node |
| `BreadcrumbList` | Work detail | |
| `ImageObject` | Project pages | With the spec-line caption as `caption` — the design system's documentation convention becomes machine-readable, which is a genuine bonus rather than a stretch |

**Every JSON-LD field sourced from `content/business.ts` is placeholder-guarded**: an unsupplied field is omitted from the graph entirely. An invented address in structured data is worse than no address.

### 10.4 Crawl surface

- `app/sitemap.ts` — generated from the route list plus `projects.ts`, with `lastModified` from git.
- `app/robots.ts` — allow all, sitemap reference.
- All navigation is real `<a>` elements via `next/link`; **the menu overlay's links are crawlable in the server HTML** even though the overlay is visually hidden. `hidden` + `inert` when closed, never `display: none` on the nav itself in a way that removes it from the document.
- No route is client-side-only. Every page is a real URL with real server-rendered content, which the "no giant page component" architecture gets for free.

### 10.5 Local intent

This is a local contractor site; the search job is "masonry near me," not brand search. Architecturally that means: the business name, service area, and phone appear in server-rendered HTML on **every** page (in the footer, which is a Server Component); each service has crawlable body copy; each project page carries a real `<h1>` and a spec-line caption naming bond pattern and material. None of that content is behind a reveal that JS must run to release (§4.3).

---

## 11. Image handling

### 11.1 The pipeline

Eleven source JPEGs, 250–580KB each, phone-shot. They are **not** shipped as sources. A build-time pipeline produces every rendered variant:

```
scripts/build-images.ts   (sharp)

assets/images/*.jpeg
  → apply the §5.2 grade:
      black point to near-zero · contrast +8–12%
      green/blue saturation −35…−45% · red/orange held at ~95%
      midtone temperature +3 toward orange
      film grain 2–4% at 100%
      watermark crop on 09–11
  → apply the per-image focal crop for each treatment it appears in (T1–T8)
  → emit AVIF + WebP at 1× and 2× of the FINAL RENDERED SIZE
  → emit a 24px LQIP (used as a solid-tone ground, not a blur-up — see 11.2)
  → write content/images.generated.ts
```

The grade is baked, not applied at runtime, for the two reasons the design system gives — consistency across eleven photos, and zero runtime cost — plus a third that matters architecturally: **`filter` is a forbidden animated property (§15.2 of the motion system)**, so a runtime grade could never be part of any transition anyway.

`images.generated.ts` exports a typed record per image per treatment:

```ts
{ id: '04', treatment: 'T1', w: 1080, h: 1440, ratio: 0.75,
  avif: '/media/04-t1.avif', webp: '/media/04-t1.webp',
  avif2x: '…', webp2x: '…', tone: '#0B0908',
  alt: 'Red brick mailbox column with soldier course cap',
  spec: 'RUNNING BOND / SOLDIER COURSE CAP' }
```

Components never reference a file path. They reference an image id and a treatment, and the manifest supplies dimensions — which is how CLS reaches zero by construction rather than by discipline.

### 11.2 `Plate` — the one image component

Every image on the site is a `Plate`. It is a **Server Component**; the reveal is CSS released by an ancestor `Reveal`, so no image ships JavaScript.

```
<figure> reserves the exact aspect box from the manifest (aspect-ratio, never padding hacks)
  ground: the image's own extracted tone (#0B0908 etc.), so the box is never empty white
  <picture> AVIF → WebP → JPEG, srcset 1×/2×, explicit width/height, sizes per treatment
  mask: clip-path closed by CSS in the server HTML, released by the parent Reveal
  inner <img>: scale(1.06) → 1.0 counter-motion, transform only
  <figcaption>: the mandatory spec line (design system §1.5)
```

Decisions worth stating:

- **`<picture>` with hand-built srcset, not `next/image`.** Every image here is a fixed art-directed crop at a known rendered size, already optimised at build. `next/image`'s value is on-demand resizing of unknown images; here it would add a runtime layer, a loader, and its own opacity-based placeholder transition that **conflicts directly with "images never fade" (§9.1 of the motion system)**. The static `<picture>` is smaller, faster and honest about what it is.
- **No blur-up placeholder.** The mask is the reveal. A blur-up is a fade by another name. The LQIP is used only as a flat background tone so a slow connection shows a dark ground rather than nothing.
- **Loading:** `loading="eager"` + `fetchpriority="high"` on the hero plate only; `loading="lazy"` + `decoding="async"` on everything else. Work-index preview images preload at low priority after the page entrance completes (motion §11.2).
- **`sizes` is generated per treatment** from `lib/media/sizes.ts` — T1 course panels, T2 full bleed and T3 framed plates have different viewport relationships, and a single generic `sizes` string would over-download on two of the three.

### 11.3 Budgets

| Page | Media budget |
|---|---|
| Home | ≤ 1.9 MB including the video's first segment |
| Work index | ≤ 1.4 MB (11 plates at T3, small) |
| Other routes | ≤ 900 KB |

A `pnpm check:media` script sums the manifest per route against these and fails the build on breach.

---

## 12. Video handling

### 12.1 The source

One 2.42MB H.264 MP4, portrait (9:16), used once — the hero plate on Home. It is the single heaviest asset on the site and it is **never on the critical path**.

### 12.2 Encoding

```
scripts/build-video.ts   (ffmpeg)

Brix-vid1.mp4
  → VP9/WebM, ~1.1 MB, CRF 33, no audio track at all (not muted — absent)
  → H.264/MP4 fallback, faststart, ~1.4 MB, no audio track
  → poster: frame at the video's strongest composition, graded to match §5.2,
            AVIF + WebP, ~40 KB, exact plate dimensions
```

Stripping the audio track rather than muting it removes weight and eliminates an entire class of autoplay-policy edge case.

### 12.3 `HeroVideo` — Client Component, tightly scoped

Responsibilities and nothing else: mount timing, source selection, autoplay probe, in-view pause. It does **not** own the reveal — the reveal is part of the hero timeline (motion §7.2), which passes it a completion signal.

```
1. Server renders the poster as a <Plate>. That is the LCP-safe, JS-free state.
2. After first paint (useEffect + requestIdleCallback fallback to setTimeout 0),
   the <video> element is created with preload="metadata".
3. muted · playsInline · autoPlay · loop · no controls · aria-hidden (decorative)
4. On 'canplay': fade the video in over the poster, 240ms opacity — the ONE
   sanctioned image opacity transition on the site, because it is a source swap.
5. play() promise rejected (autoplay refused) → poster holds, a labelled play
   control LAYs in. Never a black rectangle, never a spinner.
6. IntersectionObserver: pause on leave, resume on enter (only if it was playing).
7. visibilitychange: pause on hidden.
8. Reduced motion: the video element is never created. Poster + play control only.
9. saveData or deviceMemory ≤ 4: video never created.
```

The poster being a real server-rendered `<Plate>` is what makes every one of those failure paths graceful: the hero is visually complete before any video decision is made, so every fallback is "the video didn't arrive," never "the hero is broken."

---

## 13. Accessibility

### 13.1 Structure

- One `<h1>` per page. Every `<Section>` is `aria-labelledby` its own heading.
- `<SkipLink>` to `#main`, first focusable element, visible on focus.
- Landmarks: `banner` (rail), `navigation` (menu), `main`, `contentinfo` (footer).
- **Route change:** focus moves to the new page's `<h1>` (`tabIndex={-1}`), and a visually-hidden `aria-live="polite"` region announces the new page title.

### 13.2 Motion

- Reduced motion is a first-class path (motion system §17). The test is that **final frames are pixel-identical with motion on and off** — enforced by screenshot comparison in CI, not by inspection.
- Split text preserves `aria-label` on the container; generated spans are `aria-hidden`.
- The course counter and progress rule are `aria-hidden` — visual instruments, not live regions.
- The cursor follower and all previews are pointer-only enhancements that never gate information.

### 13.3 Interaction

- `:focus-visible` everywhere, never `outline: none` without an immediate replacement in the same rule.
- Menu: focus trap, `Escape` to close, focus returns to the trigger, `aria-expanded`, `aria-modal`, `inert` on the background when open.
- Ledger rows and elevation courses are real `<a>` / `<button>` elements in real lists, with `aria-current` where applicable.
- Form: labels associated, `aria-invalid`, `aria-describedby`, `role="alert"` only while an error is present, validation on blur (never per keystroke), submit status via `aria-live="polite"` and `aria-busy`.
- Minimum 44px tap targets, achieved with padding, never by scaling.

### 13.4 Verification

`axe-core` in the Playwright suite on every route, in both motion modes, at 390px and 1440px. Contrast pairs are already fixed by the token system (§2.4) but are re-asserted in CI so a future token edit cannot silently break them.

---

## 14. Performance

### 14.1 Budgets, enforced in CI

| Metric | Budget |
|---|---|
| Motion JS, gzipped (GSAP core + ScrollTrigger + Framer `domAnimation` + Lenis + splitter) | **≤ 62 KB** |
| Total first-load JS, Home | **≤ 130 KB** gz |
| Webfont payload, subset latin | **≤ 95 KB** |
| LCP (Home, mobile, 4G) | **≤ 1.6 s**, headline painted ~880 ms |
| CLS, every route | **0** |
| INP | **≤ 150 ms** |
| Total media, Home | ≤ 1.9 MB |
| Lighthouse Performance / A11y / SEO / Best Practices | ≥ 95 / 100 / 100 / 100 |

`size-limit` on the motion bundle and `@next/bundle-analyzer` in CI. A budget breach fails the build.

### 14.2 The levers, in the order they matter

1. **Server Components by default** (§0, Law 1). Twenty client files against ~70 components is the single largest performance decision in this document.
2. **`next/font/local`** with variable Archivo, Geist Sans and Geist Mono, subset to `latin`, `display: swap`, with an `adjustFontFallback` metric-compatible stack so the LCP headline paints in the fallback and swaps without shifting.
3. **Static generation everywhere**, `dynamic: 'error'` to keep it that way.
4. **Build-time media**, so no runtime image or video processing exists (§11, §12).
5. **Route-level code splitting** for the three heaviest client components: `CursorFollower`, `ElevationDiagram` and `ProjectPreview` are `next/dynamic` with `ssr: false` — all three are pointer-fine, desktop-only enhancements, so mobile never downloads them.
6. **One animation clock, one pointer listener, zero component RAF loops** (§4.4, §4.7).
7. **`will-change` only during known animation**, ≤6 elements at once, applied by GSAP callbacks and removed on complete.

### 14.3 Guardrails against the specific failure modes named in the brief

| Failure | Prevention |
|---|---|
| **Memory leaks** | `useGSAP` scoping means no manual cleanup exists to forget. Ref-counted pointer delegate. Explicit `disconnect()` on every observer. Failsafe timeouts cleared on unmount. |
| **Duplicate ScrollTriggers** | Stable `id` per trigger + `getById()` guard + a dev-mode assertion on live trigger count after every route transition. `ScrollTrigger.batch()` for sibling groups. |
| **Animation conflicts** | The library boundary is lint-enforced: no element is touched by two systems. `overwrite: 'auto'` on hover tweens. Parallax and reveal never share an element (motion §2.5). Pointer events disabled on the incoming page during a route cover. |
| **Hydration issues** | No browser APIs in render; initial motion states are CSS classes in the server HTML; splitting happens post-hydration; no width-conditional trees during SSR (§4.9). |
| **Layout shifts** | Every image box reserved from the generated manifest; fonts metric-matched; no JS-inserted layout; the video replaces a poster of identical dimensions. CLS budget is 0, not 0.1. |
| **Unnecessary client components** | The census in §3.2 is the allowlist. A new `'use client'` requires a review justification. |

### 14.4 Verification suite

| Check | Tool | Gate |
|---|---|---|
| Bundle budgets | `size-limit` | Build fails |
| Content validity, placeholders, media budgets | Node scripts, `prebuild` | Build fails |
| Lighthouse CI, 4 routes, mobile + desktop | `@lhci/cli` | PR fails below thresholds |
| `axe-core`, every route, both motion modes | Playwright | PR fails |
| Reduced-motion final-frame parity | Playwright screenshot diff | PR fails |
| No-JS render of every route | Playwright, `javaScriptEnabled: false` | PR fails |
| Trigger-count assertion after route transitions | Playwright + dev assertion | PR fails |
| Type safety | `tsc --noEmit`, strict | Build fails |

The reduced-motion parity test and the no-JS test are the two that are unusual, and they are the two that protect the design system's most important promises.
---

## 15. The exact folder structure

`C` marks a Client Component. Everything unmarked is a Server Component or non-React code.

```
brix/
├─ app/
│  ├─ layout.tsx                      Root shell: fonts, tokens, chrome, JSON-LD
│  ├─ template.tsx                  C Remount boundary for PageTransition
│  ├─ page.tsx                        Home — a manifest of eight courses
│  ├─ not-found.tsx
│  ├─ error.tsx                     C
│  ├─ global-error.tsx              C
│  ├─ robots.ts
│  ├─ sitemap.ts
│  ├─ opengraph-image.tsx
│  ├─ icon.svg
│  ├─ apple-icon.png
│  ├─ work/
│  │  ├─ page.tsx
│  │  ├─ opengraph-image.tsx
│  │  └─ [slug]/
│  │     ├─ page.tsx
│  │     ├─ opengraph-image.tsx
│  │     └─ not-found.tsx
│  ├─ services/page.tsx
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  └─ api/
│     └─ contact/route.ts             POST only, zod-validated, rate-limited
│
├─ components/
│  ├─ chrome/                         Persistent viewport furniture
│  │  ├─ Rail.tsx                     Fixed top bar: logo, trigger, progress, counter
│  │  ├─ MenuTrigger.tsx            C Bond-mark → X morph, open state
│  │  ├─ MenuOverlay.tsx            C Framer presence, focus trap, scroll lock
│  │  ├─ MenuNav.tsx                  Server-rendered links inside the overlay
│  │  ├─ MenuPreview.tsx            C Adjacent thumbnail on item hover (desktop)
│  │  ├─ ScrollProgress.tsx         C 1px red rule, scrubbed
│  │  ├─ CourseCounter.tsx          C "03 / 08"
│  │  ├─ CursorFollower.tsx         C Dynamic, pointer-fine only
│  │  ├─ MobileActionBar.tsx        C CALL / FREE ESTIMATE, appears once
│  │  ├─ PageTransition.tsx         C Three cover courses, failsafe, scroll reset
│  │  └─ SkipLink.tsx
│  │
│  ├─ layout/
│  │  ├─ Section.tsx                  <section> + spacing + aria-labelledby + id
│  │  ├─ Grid.tsx                     The breakout grid
│  │  ├─ Col.tsx                      Span / start / bond offset
│  │  ├─ Course.tsx                   D1 — a band of unequal panels
│  │  ├─ Panel.tsx                    Surface, not "card"
│  │  ├─ Joint.tsx                    D2
│  │  └─ Stack.tsx
│  │
│  ├─ motion/                         The ONLY place GSAP is imported in components/
│  │  ├─ MotionProvider.tsx         C Lenis, GSAP registration, matchMedia, context
│  │  ├─ Reveal.tsx                 C The Course composite over data-reveal children
│  │  ├─ SplitLines.tsx             C Post-hydration line splitting
│  │  ├─ Parallax.tsx               C Scrubbed CARRY, any child
│  │  ├─ MagneticButton.tsx         C 6px lean, delegated pointer
│  │  └─ HeroTimeline.tsx           C Home's authored entrance sequence
│  │
│  ├─ media/
│  │  ├─ Plate.tsx                    Every image on the site
│  │  ├─ PlateCaption.tsx             The mandatory spec line
│  │  ├─ HeroVideo.tsx              C Mount timing, autoplay probe, in-view pause
│  │  └─ VideoPoster.tsx              Server-rendered LCP-safe poster
│  │
│  ├─ ui/
│  │  ├─ Button.tsx                   Server shell; wrapped by MagneticButton when primary
│  │  ├─ TextLink.tsx
│  │  ├─ Rule.tsx                     D3
│  │  ├─ Apex.tsx                     D4
│  │  ├─ Cross.tsx                    D5
│  │  ├─ Frame.tsx                    D6
│  │  ├─ Bracket.tsx                  D7
│  │  ├─ BondMark.tsx                 D8
│  │  ├─ Label.tsx
│  │  ├─ IndexNumeral.tsx
│  │  ├─ Eyebrow.tsx
│  │  └─ Fact.tsx                     Renders nothing for an unsupplied [[CLIENT]] value
│  │
│  ├─ form/
│  │  ├─ ContactForm.tsx            C Form state, validation on blur, submit states
│  │  ├─ Field.tsx                    Baseline-rule field, numbered mono label
│  │  ├─ ChipGroup.tsx              C Project-type radio group
│  │  ├─ SubmitButton.tsx           C Drain progress, Framer label swap
│  │  ├─ FieldError.tsx               Apex glyph + off-white message
│  │  └─ FormProgress.tsx             Segmented completion rule
│  │
│  └─ sections/
│     ├─ shared/
│     │  ├─ SectionHeader.tsx         Eyebrow / header / support (design system §9.4)
│     │  ├─ EstimateCta.tsx
│     │  ├─ SiteFooter.tsx
│     │  └─ FooterMonument.tsx      C The final DRAW → LAY → SET sequence
│     ├─ home/
│     │  ├─ CourseHero.tsx            01 · composes HeroTimeline + HeroVideo
│     │  ├─ CourseArgument.tsx        02
│     │  ├─ CourseCapabilities.tsx    03 · the six-cell band
│     │  ├─ CourseSelected.tsx        04 · featured plate + ledger rows
│     │  ├─ CourseMethod.tsx          05 · four steps, red string line
│     │  ├─ CourseMaterial.tsx        06 · diptych
│     │  ├─ CourseEstimate.tsx        07 · the footing
│     │  └─ SpecStrip.tsx           C The one scroll-velocity strip
│     ├─ work/
│     │  ├─ WorkHeader.tsx
│     │  ├─ WorkLedger.tsx            The row list
│     │  ├─ LedgerRow.tsx           C Hover coordination with the preview
│     │  ├─ ProjectPreview.tsx      C Cursor-following plate (dynamic import)
│     │  ├─ WorkPlateGrid.tsx
│     │  ├─ ProjectHeader.tsx
│     │  ├─ ProjectPlates.tsx
│     │  ├─ ProjectSpec.tsx
│     │  └─ ProjectNext.tsx
│     ├─ services/
│     │  ├─ ServicesHeader.tsx
│     │  ├─ ServicesElevation.tsx     Server shell + content
│     │  ├─ ElevationDiagram.tsx    C Pinned, scrubbed SVG (dynamic import)
│     │  ├─ ElevationCourse.tsx       One course of the wall section
│     │  └─ ServiceEntry.tsx          Right-column content per service
│     ├─ about/
│     │  ├─ AboutHeader.tsx  AboutStatement.tsx  AboutHonesty.tsx  AboutDetail.tsx
│     └─ contact/
│        ├─ ContactHeader.tsx  ContactConditions.tsx
│
├─ hooks/
│  ├─ useMotionContext.ts   useLenis.ts        useReducedMotion.ts
│  ├─ usePointerFine.ts     usePointerDelegate.ts
│  ├─ useScrollLock.ts      useFocusTrap.ts    useInView.ts
│  ├─ useSplitLines.ts      useMediaQuery.ts   useRouteTransition.ts
│
├─ lib/
│  ├─ motion/    gsap.ts tokens.ts direction.ts mask.ts stagger.ts timeline.ts registry.ts
│  ├─ media/     images.ts sizes.ts video.ts
│  ├─ seo/       metadata.ts jsonld.ts
│  ├─ content/   placeholders.ts validate.ts
│  ├─ form/      schema.ts submit.ts
│  └─ utils/     cn.ts clamp.ts lerp.ts debounce.ts rafThrottle.ts
│
├─ content/
│  ├─ site.ts  business.ts  projects.ts  services.ts  schema.ts
│  ├─ pages/   home.ts work.ts services.ts about.ts contact.ts
│  └─ images.generated.ts             BUILD OUTPUT — never edited by hand
│
├─ styles/
│  ├─ tokens.css                      The design system §8 block — single source of truth
│  ├─ globals.css                     Reset, black ground, radius 0, reveal initial states
│  ├─ typography.css                  Scale, tracking, leading, optical corrections
│  └─ motion.css                      .u-draw .u-lay .u-set .u-dim + keyframes
│
├─ public/
│  ├─ media/                          Build output: AVIF/WebP plates, video, posters
│  ├─ logo.svg
│  └─ fonts/                          Self-hosted variable Archivo, Geist Sans, Geist Mono
│
├─ scripts/
│  ├─ build-images.ts                 sharp: grade, crop, encode, manifest
│  ├─ build-video.ts                  ffmpeg: VP9 + H.264 + poster
│  ├─ check-placeholders.ts           Lists outstanding [[CLIENT]] facts
│  ├─ check-media-budget.ts
│  └─ check-motion-budget.ts          Static scan: trigger ids, forbidden properties
│
├─ tests/
│  ├─ e2e/                            Playwright: routes, no-JS, reduced-motion parity
│  ├─ a11y/                           axe-core per route, both motion modes
│  └─ visual/                         Screenshot baselines, 390px and 1440px
│
├─ assets/                            SOURCE ONLY — never served
│  ├─ images/  Brix-masonry-image-01…11.jpeg
│  ├─ videos/  Brix-vid1.mp4
│  └─ logo/    Brix-logo-Photoroom.png
│
├─ docs/
│  ├─ brix-visual-design-system.md
│  ├─ brix-motion-system.md
│  ├─ brix-home-page-design.md
│  └─ brix-frontend-architecture.md   ← this document
│
├─ next.config.ts   tsconfig.json   eslint.config.mjs   .size-limit.json
├─ lighthouserc.json   playwright.config.ts   package.json
```

**Counts:** ~70 components, **20 of them client** (§3.2). Six motion primitives. Eleven hooks. Five content modules plus one generated.

---

## 16. Dependencies

| Package | Why |
|---|---|
| `next` `react` `react-dom` | — |
| `gsap` | Core + ScrollTrigger only. No plugin club — no `SplitText`, `Flip`, or `Draggable`. |
| `@gsap/react` | `useGSAP`. This is the cleanup contract; it is not optional. |
| `framer-motion` | Four files, via `LazyMotion` + `domAnimation` |
| `lenis` | Smooth scroll, desktop + motion-allowed only |
| `zod` | Content schemas and the form schema, shared client/server |
| `sharp` | Build-time image pipeline (dev dependency) |
| `clsx` | Class composition |
| `tailwindcss` v4 | Utilities from `@theme` |

Dev/CI: `@next/bundle-analyzer`, `size-limit`, `@lhci/cli`, `playwright`, `axe-core`, `typescript`.

**Not installed:** `three`, `@react-three/fiber` (§9) · `gsap` SplitText (§4.2) · any CMS client · any runtime CSS-in-JS · any carousel, modal, or animation-utility library. Every one of those would be solving a problem this architecture does not have.

---

## 17. Build sequence

Ordered so that each stage is verifiable before the next depends on it.

| Stage | Deliverable | Gate |
|---|---|---|
| **1. Foundation** | `tokens.css`, `globals.css`, fonts, Tailwind `@theme`, TS config, lint rules including the GSAP/Framer import allowlist | Tokens render; a blank black page passes Lighthouse 100 |
| **2. Content layer** | All `content/` modules + Zod schemas + placeholder guards | `pnpm check:content` and `check:placeholders` pass |
| **3. Media pipeline** | `build-images.ts`, `build-video.ts`, generated manifest | Every plate exists at every treatment; budgets pass |
| **4. Layout primitives** | `Grid`, `Col`, `Course`, `Panel`, `Joint`, `Section`, `Stack` | Grid renders correctly at all seven breakpoints |
| **5. UI + shape devices** | `Rule`, `Apex`, `Cross`, `Frame`, `Bracket`, `BondMark`, `Button`, `Label` | All states in CSS, no JS; contrast verified |
| **6. Motion core** | `MotionProvider`, `Reveal`, `SplitLines`, `lib/motion/*` | One test section reveals correctly; reduced-motion parity holds; zero leaked triggers on unmount |
| **7. Chrome** | Rail, menu, progress, counter, transition, mobile bar | Full keyboard path; focus trap; no-JS navigation works |
| **8. Home** | Eight courses + hero timeline + video | LCP ≤ 1.6s, CLS 0, motion budget audit passes |
| **9. Work** | Ledger, preview, plate grid, project detail | Trigger count ≤ 24; preview is pointer-fine only |
| **10. Services** | The Elevation, pinned + distributed mobile variant | The one sanctioned pin; mobile has no pin |
| **11. Contact + About** | Form, Route Handler, validation, submit states | a11y suite green; no spinner anywhere |
| **12. Footer + polish** | Monument, OG images, JSON-LD, sitemap | Full CI suite green on every route |

Stages 1–6 are the architecture. Stages 7–12 are execution against it. **If stage 6 does not produce a reveal that leaks nothing and reverts cleanly on unmount, do not proceed** — every subsequent stage multiplies that component ~40 times.

---

## 18. Decisions taken here, for the record

Six that a reviewer should know were deliberate rather than defaulted:

1. **Sections are Server Components wrapped by a client `Reveal`.** The central decision. It is what allows a site with ~40 scroll animations to ship 20 client files.
2. **`next/image` is not used.** Every image is a fixed, build-time-graded, art-directed crop at a known size; `next/image`'s runtime layer adds cost and its placeholder transition contradicts the motion system's "images never fade."
3. **Three.js is declined**, with the condition that would reverse it stated (§9).
4. **`RevealText`, `RevealImage` and `AnimatedLine` are not built.** Two are aliases and one is a CSS class. Named here because the brief proposed them, and declining to build an abstraction is a decision that should be visible.
5. **`template.tsx` owns the transition, `layout.tsx` owns Lenis.** Reversing this is the single most likely architectural error in this stack.
6. **Content is typed TypeScript, not a CMS.** Reversible later behind the same section prop contracts — sections receive typed content and do not care where it came from, so a CMS could be introduced without touching a component.

### Open question for the client, not for engineering

The eleven `[[CLIENT: …]]` facts (phone, email, city, service area, hours, licence and insurance status, Instagram handle) block **structured data, the footer, the contact page and the mobile action bar** from being complete. They do not block any of stages 1–8. `pnpm check:placeholders` produces the outstanding list on demand, so this can be chased in parallel with the build rather than gating it.
