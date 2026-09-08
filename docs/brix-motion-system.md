# BRIX — Motion System

**Version** 1.0 · **Status** Specification, pre-implementation · **Scope** Every animation on the BRIX Masonry & Concrete website
**Extends** `brix-visual-design-system.md` §6 (Motion language) and §7 (Interactive language) · **Consumed by** every page specification

---

## 0. How to use this document

§6 and §7 of the visual design system established the *physics* — easings, durations, the mask-not-fade rule, the motion budget. They did not establish a *grammar*. This document does.

The test it has to pass: a developer building the Services page and a developer building the Contact page, working from different sections, produce motion that feels authored by the same hand. That only happens if there is a small closed vocabulary every animation is built from. There is. It is four verbs (§1).

Reading modes:

- **Building any animation** → §1 (verbs), §2 (orchestration), §3 (timing), §4 (library assignment). Mandatory before writing a line of motion code.
- **Building a specific surface** → §5–§14
- **Reviewing motion** → §15 (performance), §16 (mobile), §17 (reduced motion), §18 (when not to animate), §20 (checklist)

**Conflict resolution** follows the design system's order (accessibility → performance → grid → shape → preference). One addition: **if an animation cannot be expressed in the four verbs, it does not ship.** A fifth verb is a system-level amendment, not a page-level decision.

New tokens introduced here are collected in §19. Nothing here contradicts §6/§7; where it appears to, this document is wrong and §6/§7 wins.

---

## 1. The thesis — four verbs

> **Structures do not bounce.** (§6.1)
>
> Extended: **structures are drawn, laid, set, and carried.**

Masonry has a real sequence of operations, and it is the correct source for this vocabulary because it is the only source that is *true* to the product. A wall is laid out with a line; units are laid into place; they are set and tooled; the whole is carried by what is beneath it. Four operations. Four verbs. Every animation on this site is exactly one of them.

| Verb | What it is | Property | Bound to | Default duration |
|---|---|---|---|---|
| **DRAW** | A line extends from a fixed origin | `transform: scaleX/scaleY` from an origin, or `stroke-dashoffset` | Time or scroll | `--dur-quick` / `--dur-reveal` |
| **LAY** | A mass arrives into a fixed opening | `clip-path: inset()` + a small counter-translate | Time | `--dur-reveal` / `--dur-major` |
| **SET** | A thing already present adjusts in place | `transform` (≤12px / ≤1.06), `color`, `opacity` | Event | `--dur-instant` / `--dur-quick` |
| **CARRY** | A thing is displaced by the scroll beneath it | `transform: translateY/translateX/scaleX` | **Scroll position only** | scrubbed |

### 1.1 The rules that make it a system

1. **One verb per element per moment.** An element may DRAW and later SET, never both at once. Two verbs on one element simultaneously is the exact texture of animation-for-its-own-sake.
2. **DRAW is the only verb that may originate from nothing.** The line is the site's atomic mark (D3, D6, D7). A rule appearing is never a fade — always a scale from an origin.
3. **LAY is the only entrance verb.** Nothing enters by fading and nothing enters by travelling distance. It is revealed through a fixed aperture. Translation inside a LAY is capped at `0.35em` for text and `0` for images: a settle, not a journey.
4. **SET never runs unprompted.** SET is a response — hover, focus, press, active change, in-view change. If nothing caused it, it is decoration and it is deleted.
5. **CARRY is never time-based.** If it is not driven by `scrub`, it is not CARRY. This is what stops parallax becoming an idle float, and it means CARRY is always reversible and always matches the user's hand.
6. **Composition is ordered, always DRAW → LAY → SET.** The line goes down first, the unit is laid to it, then it is tooled. Reversing that order reads wrong and is the easiest motion defect to catch in review.

### 1.2 The one canonical composite

Because every reveal on the site composes the same way, there is exactly one composite pattern and it has a name. **The Course:**

```
t = 0ms     DRAW   eyebrow rule, red, scaleX 0→1 from left       --dur-quick   240ms
t = +80ms   LAY    headline, one line per course, 80ms apart     --dur-reveal  760ms
t = +240ms  LAY    supporting copy, single mask                  --dur-reveal  760ms
t = +320ms  SET    metadata / mono strip, opacity + 4px rise     --dur-base    420ms
```

Elapsed to complete: **1080ms**; everything after the eyebrow overlaps, so perceived time is ~800ms.

Every section header on every page (design system §9.4) uses this and nothing else. Section-specific animation is what happens *after* The Course resolves — never a substitute for it.

**The 80ms beat.** Every choreographic offset in the system is a multiple of **80ms** (80 / 160 / 240 / 320), because 80ms is the temporal analogue of the half-unit bond offset. List stagger keeps its own values (§3.4). Offsets and stagger are different things and must not be conflated.

---

## 2. Orchestration law

Timing values do not produce coherence — orchestration does. Five laws, all countable in review.

### 2.1 One primary per viewport

Restating §6.7 because it is the most-violated rule in this genre: **at most one primary motion runs in a viewport at a time.** Primary = any DRAW, LAY or CARRY above 240ms. SET is unlimited (user-driven, cannot collide with itself).

If two sections would animate in the same viewport, the second one's entrance is suppressed and it renders final. A section that only works if it animates is a design failure, not a motion failure.

### 2.2 Entrances fire once

`once: true` on every entrance trigger, sitewide, no exceptions. Scrolling back up a BRIX page shows a finished wall, not one that rebuilds itself. Walls do not rebuild.

### 2.3 The trigger line

One number, sitewide, so reveals feel metered rather than arbitrary:

```
start: "top 82%"
```

Elements taller than 90vh use `"top 92%"` so they never sit half-revealed. Do not tune per section.

### 2.4 Interruption is always allowed

Every time-based animation must be interruptible and must resolve to a valid final state if interrupted. Entrance timelines are killed and their targets snapped to final values on route change; hover tweens use `overwrite: "auto"`; the page cover has a hard failsafe (§5.3). **A user who scrolls fast must never see a half-revealed element.** `ScrollTrigger.refresh()` runs after font load and after any layout-affecting image load.

### 2.5 Scroll owns the clock

Where an animation and the scroll express the same idea, the scroll wins — it is the user's hand. Never run a time-based reveal on something the user is actively scrubbing. This is why parallax (CARRY) and section reveal (LAY) are never applied to the same element: they would fight for control of one object.

---

## 3. Timing, easing, stagger

### 3.1 Easing — the four curves, unchanged

Per §6.2: `--ease-structural` `cubic-bezier(0.16, 1, 0.3, 1)` · `--ease-mechanical` `cubic-bezier(0.65, 0, 0.35, 1)` · `--ease-set` `cubic-bezier(0.33, 1, 0.68, 1)` · `--ease-lift` `cubic-bezier(0.4, 0, 0.2, 1)`.

Curve choice is now determined by verb, not taste:

| Verb | Curve | Why |
|---|---|---|
| **DRAW** | `--ease-structural` | A snapped line: fast departure, long settle |
| **LAY** | `--ease-structural` | The mass arrives decisively and comes to rest |
| **SET** | `--ease-set` | Small, gentle, undramatic |
| **CARRY** | **`none` (linear)** | Scrubbed motion must be 1:1 with scroll or it reads as lag |
| Covers, swaps, exits | `--ease-mechanical` | Symmetric — it should feel operated, not organic |

**Easing a scrubbed animation with anything but `none` is a defect.** The only permitted softening on a scrub is `scrub: 0.6` (§6.6), which is inertia, not easing.

No curve overshoots. No springs. **Framer Motion's default spring is banned** — every Framer transition in this codebase declares an explicit `duration` + `ease` array. Greppable.

### 3.2 Duration

Existing tokens (§6.3) hold. Assignment by verb and consequence:

| Token | Value | Verb | Use |
|---|---|---|---|
| `--dur-instant` | 120ms | SET | Hover color, focus ring, index color change |
| `--dur-quick` | 240ms | DRAW, SET | Rule draws, fill sweeps, underline swaps, chip select |
| `--dur-base` | 420ms | LAY, SET | Menu courses, overlay panels, page cover, metadata rise |
| `--dur-reveal` | 760ms | LAY | All text and standard image reveals |
| `--dur-major` | 1000ms | LAY | Hero beats, full-bleed masks, footer monument |

**Exit law:** `exit = entrance × 0.6`, floor 120ms, curve `--ease-mechanical`. Menus, overlays and covers leave faster than they arrive, because a user closing something has already decided. New token `--dur-exit-factor: 0.6`.

**Nothing animates longer than 1000ms** except scrubbed CARRY, which has no duration.

### 3.3 Latency budget

| Interaction | First visible response |
|---|---|
| Hover / focus | ≤ 120ms |
| Click on a control | ≤ 120ms (the press state, not the outcome) |
| Route change | ≤ 160ms (cover begins) |
| Scroll-triggered reveal | Immediate at the trigger line |

If an action produces no visual change within 120ms the interface reads as broken, whatever happens at 400ms.

### 3.4 Stagger

Per §6.4, with the ceiling expressed as a formula rather than a warning:

```
base    = 60ms if count ≤ 6 else 40ms
stagger = min(base, 480ms / (count - 1))
```

Implement the clamp in code, never by hand-tuning. A 14-item list gets 36ms automatically.

**Stagger direction follows reading order.** `from: "start"` only — never `random`, `center`, or `edges`. Randomised stagger is the loudest signal of decorative motion and is banned sitewide.

**Stagger is for lists that are lists.** Six service cells: yes. Four unrelated elements in a section: no — those compose as The Course (§1.2).

### 3.5 Distance — the exhaustive table

| Motion | Max displacement |
|---|---|
| Text settle inside a LAY | `0.35em` |
| Metadata / mono rise (SET) | `4px` |
| Ledger row title shift (SET) | `12px` |
| Magnetic button lean (SET) | `6px` (`--magnet-max`) |
| Image scale inside a fixed mask (SET) | `1.04` |
| Image counter-scale inside a LAY | `1.06 → 1.0` |
| Parallax (CARRY) | `8%` of element height (`--parallax-max`) |
| Anything else | **There is nothing else.** |

That table is exhaustive. If a proposed animation needs a displacement not on it, the animation is wrong.

---

## 4. Library doctrine

### 4.1 The boundary law

> **CSS owns state. Framer Motion owns presence. GSAP owns progress.**

- **State** — the element exists and its appearance changes: hover, focus, active, checked, current-page, disabled, in-view boolean → **CSS**
- **Presence** — React controls whether it is mounted and it must animate *out* before unmounting → **Framer Motion** (`AnimatePresence`)
- **Progress** — a multi-element timeline, or anything coupled to scroll position → **GSAP / ScrollTrigger**

No element is animated by two libraries. Where a component has both presence and internal choreography (the menu overlay), **Framer animates the container's presence and GSAP animates nothing inside it** — the interior courses are CSS keyframes with `animation-delay`, driven by a `data-state` attribute on the container. One owner per element, always.

### 4.2 Why all three, and what would remove one

**CSS** is not optional: ~70% of the site's motion is hover/focus state, and routing that through JS would be worse in weight, latency and reliability.

**GSAP + ScrollTrigger** is not optional: Lenis integration, `scrub`, pinning, `once: true`, timeline sequencing across unrelated DOM nodes, and `ScrollTrigger.refresh()` after font load have no acceptable substitute at this level of choreography. `matchMedia()` is also the cleanest implementation of §16 and §17.

**Framer Motion** earns its place for exactly one reason: **exit animation for React-conditional content** — the App Router route transition and the menu overlay. Hand-rolling exit animation with GSAP inside React means manual mount deferral, cleanup races and a bespoke `usePresence`: more code, more failure modes.

Cost control, mandatory:

- Import via `LazyMotion` + `domAnimation`, use `m.*` components, never `motion.*`. ~34KB gz → ~18KB gz.
- Framer appears in **four files only**: the route-transition template, the menu overlay, the cursor preview panel, the submit-state swap. A fifth import is a review failure.
- GSAP loads core + ScrollTrigger only. No plugin club, no `SplitText` (see §8.1), no `Flip`, no `Draggable`.

**Sanctioned fallback:** if the JS budget in §15.1 is breached at build time, remove Framer Motion — not GSAP. Route transitions move to a GSAP cover keyed off `usePathname()` with a two-frame mount deferral; the menu overlay moves to `data-state` + CSS with a `transitionend`-gated unmount. Budget beats convenience.

### 4.3 Lenis is infrastructure, not a tier

`lerp: 0.09`, `duration: 1.1`, `wheelMultiplier: 1`, `syncTouch: false` (§6.6). Wired to GSAP's ticker so ScrollTrigger reads the smoothed position:

```
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

Not initialised under reduced motion, and not initialised on touch (native momentum is better than any emulation).

### 4.4 Master assignment

| # | System | CSS | Framer | GSAP | ScrollTrigger | Verb |
|---|---|---|---|---|---|---|
| 1 | Page entrance (first load) | | | ● | | LAY |
| 2 | Route transition cover | | ● | | | LAY |
| 3 | Smooth scroll | | | Lenis | | — |
| 4 | Scroll progress rule | | | | ● | CARRY |
| 5 | Course counter in rail | | | | ● | SET |
| 6 | Section reveals (The Course) | | | ● | ● | DRAW→LAY→SET |
| 7 | Menu trigger morph | ● | | | | SET |
| 8 | Menu overlay presence | | ● | | | LAY |
| 9 | Menu interior courses + items | ● | | | | LAY |
| 10 | Nav hover / active | ● | | | | DRAW |
| 11 | Mobile bottom bar | ● | | | ● | SET |
| 12 | Hero entrance timeline | | | ● | | DRAW+LAY |
| 13 | Hero video plate reveal | | | ● | | LAY |
| 14 | Hero scroll indicator | ● | | | | SET |
| 15 | Hero → Course 02 handoff | | | | ● | CARRY |
| 16 | Line / word reveals | | | ● | ● | LAY |
| 17 | Character reveals (2 places only) | | | ● | ● | LAY |
| 18 | Scroll-velocity spec strip | | | | ● | CARRY |
| 19 | Image mask reveal | | | ● | ● | LAY |
| 20 | Image parallax | | | | ● | CARRY |
| 21 | Image hover zoom | ● | | | | SET |
| 22 | Button fill sweep / underline | ● | | | | DRAW |
| 23 | Button icon + label shift | ● | | | | SET |
| 24 | Magnetic button | | | ● `quickTo` | | SET |
| 25 | Ledger row hover | ● | | | | DRAW+SET |
| 26 | Cursor follower + preview | | ● (panel) | ● `quickTo` | | SET |
| 27 | Services elevation (§12) | | | ● | ● pinned | CARRY |
| 28 | Form field focus / validity | ● | | | | DRAW+SET |
| 29 | Form progress course | ● | | | | DRAW |
| 30 | Submit → sending → sent | ● | ● | | | DRAW+LAY |
| 31 | Footer monument | | | ● | ● | DRAW+LAY |
---

## 5. GLOBAL

### 5.1 Page entrance (first load)

**GSAP timeline. LAY. Runs once per session-load, never on client-side navigation.**

The ground is black from the first painted frame — the `<html>` background is `#000` in the document itself, not in a stylesheet that can arrive late. **There is never a white flash**, and this is the single highest-priority rule in the entire motion system because it is the one failure a visitor can see before anything else.

```
0ms      Rail hairline DRAWs left→right across the full viewport      700ms  structural
80ms     Logo LAYs from the left                                      420ms
80ms     [surface-specific entrance begins — hero timeline, §7.1]
```

A brief, deliberate hold: nothing above the fold is visible for the first ~80ms other than the rail drawing. That emptiness is the site introducing its ground before its content — it is why the entrance reads as construction rather than as a loading state.

**No preloader. No percentage counter. No logo-assembly splash.** A preloader on a five-page marketing site is a self-inflicted 1.5s penalty, and this brief's premium reference points do not use one. If a font is still loading, the headline paints in the metric-compatible fallback and swaps; the entrance does not wait for it.

**Anti-FOUC contract:** every element that will be LAID starts with its final layout and its `clip-path` inset applied via a CSS class present in the server-rendered HTML, removed by the timeline. If JS never executes, a `<noscript>`-adjacent rule and a `.no-js` guard reveal everything immediately. **Content is never hidden by a state only JS can undo** — that is a blank-page failure mode and it is not acceptable.

### 5.2 Page exit

**Framer Motion. LAY, reversed, mechanical.**

Per §6.8: a black cover wipes up from the bottom in **three offset courses**, staggered 60ms, `--dur-base` 420ms total, `--ease-mechanical`. The three courses are offset horizontally by `--bond-offset` — the cover is itself a piece of running bond, so even the transition is made of the same material as the site.

Courses are `position: fixed`, `inset: 0`, `transform: translateY(100%) → 0`, `will-change: transform` applied only while running.

### 5.3 Route transitions

**Framer Motion `AnimatePresence mode="wait"` in `template.tsx`.**

```
0ms     Cover courses wipe UP from the bottom            420ms  mechanical
420ms   Route commits behind the cover
        Scroll resets to 0 via lenis.scrollTo(0, {immediate: true})
        Minimum hold: 260ms (prevents a flicker on an instant route)
680ms   Cover courses wipe UP and off the top            420ms  mechanical
        Incoming page's first section is already in final state — it does NOT replay
        its entrance behind the cover; only the hero timeline runs, and only on Home.
```

Total **≤ 900ms**, hard **1200ms failsafe** that force-completes and removes the cover if a route hangs. Browser back/forward is never blocked. The page is never left covered — the failsafe is a `setTimeout` registered before the transition begins, cleared on success.

**Continuity refinement:** the cover's direction is constant (always up) because a wall is always laid upward. Direction does not vary by nav order — varying it would make the site feel like a slideshow rather than a structure.

**Prefetch:** `next/link` prefetches on hover, so by the time the cover has finished its 420ms the route is usually already resolved and the 260ms minimum hold is what the user actually experiences.

### 5.4 Smooth scrolling

**Lenis. Not a verb — infrastructure.** Config per §4.3.

Hard rules:

- **`syncTouch: false`.** Native momentum on touch, always. Emulated touch scrolling is the fastest way to make a premium site feel cheap on a phone.
- Anchor jumps go through `lenis.scrollTo(target, { offset: -88 })` — the rail height — so a jumped-to section never sits under the rail.
- `lenis.stop()` whenever the menu is open or a modal is present; `lenis.start()` on close. Body scroll lock is never done with `overflow: hidden` alone (it loses position on iOS).
- **If smooth scroll ever costs frames, it is removed, not tuned.** A site that feels heavy to scroll is the defining failure of this genre (§6.6).

### 5.5 Scroll progress

**ScrollTrigger. CARRY.** Two coupled indicators, both in the fixed rail — this is one system, not two.

1. **The progress rule.** A 1px `#D90D0F` line along the bottom edge of the rail, `transform: scaleX(0→1)`, `transform-origin: left`, `scrub: true` (raw, no smoothing — it is a measurement instrument and must be exact). It is the site's only permanently-visible red element, which is correct: red is *live state*, and progress is the most literal live state there is.

2. **The course counter.** Mono 11px in the rail reading `03 / 08`. The numerator swaps as each course's ScrollTrigger becomes active. The swap is a SET: outgoing digit LAYs out upward 4px + fades, incoming LAYs in from below, 160ms, `--ease-mechanical`. `font-variant-numeric: tabular-nums` so it does not jitter (§1.6). `aria-hidden` — it is a visual instrument, not a live region, and announcing it would be hostile to screen readers.

The counter is what turns a scroll bar into *documentation*: the page is stated to have eight courses and you are told which one you are in. That is a drawing convention, not a web convention, and it is exactly the register this brand wants.

### 5.6 Section reveals

**GSAP + ScrollTrigger. The Course composite (§1.2).**

One reusable `revealCourse(section)` function, called by every section on every page. It reads `data-reveal` children:

```
[data-reveal="rule"]     → DRAW  scaleX 0→1 from left    240ms  at t=0
[data-reveal="line"]     → LAY   per line, 80ms apart    760ms  at t=80
[data-reveal="body"]     → LAY   single mask             760ms  at t=240
[data-reveal="meta"]     → SET   opacity + 4px rise      420ms  at t=320
```

Mask direction is derived from position, never authored (§6.4): left half → from left; right half → from right; full-width → from bottom; stacked → top-to-bottom. Implemented as a single helper reading `getBoundingClientRect().left` against the viewport midpoint. **One rule, applied everywhere, is what makes the whole site feel like one hand.**

`once: true`. Trigger `top 82%`. One `ScrollTrigger.batch()` per page where sections are short enough to enter together, so §2.1 is enforced structurally rather than by discipline.

---

## 6. NAVIGATION

### 6.1 Menu button

**CSS only. SET.** The trigger is the running-bond mark (D8): two short 2px bars over one offset long bar, `#F3F3F3`, in a 44×44 hit area.

| State | Behavior | Timing |
|---|---|---|
| Rest | Bars offset by `--bond-offset` in miniature: top bar 16px, middle 24px, bottom 16px inset 8px | — |
| Hover | The three courses **slide into alignment** — all become 24px, flush left. The bond resolves. | 240ms `--ease-set` |
| Focus-visible | 2px `#D90D0F` ring, 2px offset. Additive to hover, never a replacement. | 120ms |
| Open | Bars rotate into the **X from the logo**: top and bottom rotate ±18°… **corrected to ±30° at icon scale** per §4.3; middle bar `scaleX(0)` from center | 240ms `--ease-mechanical` |
| Press | `translateY(1px)`, no scale | 120ms |

Adjacent mono 11px label reads `MENU`, crossfading with a 4px rise to `CLOSE` on open, 200ms. Two absolutely-positioned spans in a fixed-height clip — `LAY` out / `LAY` in, never a width change (width animation is forbidden, §6.7).

`aria-expanded` always reflects state. The label is `aria-hidden`; the button carries `aria-label="Open menu" / "Close menu"`.

### 6.2 Menu opening

**Framer Motion for presence · CSS keyframes for the interior. LAY.**

```
0ms     Overlay container mounts, pointer-events on, lenis.stop()
0ms     FIVE horizontal courses sweep in from ALTERNATING SIDES
        Course 1 ← left, 2 → right, 3 ← left, 4 → right, 5 ← left
        Each: transform: translateX(∓100%) → 0    420ms  --ease-mechanical
        Stagger 60ms   → last course lands at 660ms
420ms   The seams close: each course's 1px ink-400 joint DRAWs to full width  240ms
560ms   Nav items LAY in, top to bottom, stagger 60ms                          420ms
760ms   Footer strip of the overlay (phone / email / Instagram) SETs in        420ms
```

Visually complete at **~1180ms**, but the first course is on screen at 60ms and the overlay is opaque by ~500ms, so perceived latency is low. The alternating sweep is not a flourish — it is the bond pattern rendered in time. It is the one place on the site where the wall assembles in front of the visitor, and it earns the length.

`will-change: transform` set on the five courses at open, removed on `animationend`.

### 6.3 Menu closing

**Exit law (§3.2): 0.6 × entrance.**

```
0ms     Nav items LAY out upward, stagger 30ms, reverse order (bottom-first)  180ms
120ms   Courses sweep out to the sides they came from, stagger 40ms           250ms
370ms   Container unmounts (AnimatePresence), lenis.start()
        Focus returns to the menu trigger
```

**Total 370ms.** Closing must feel like a decision already executed. `Escape` closes from anywhere in the overlay. Clicking a nav item closes the menu *and* starts the route transition — the two overlap deliberately: the menu's course sweep-out runs *behind* the page cover wiping up, so the visitor never sees an unfurnished page between them.

### 6.4 Navigation item entrance

**CSS keyframes, `animation-delay` staggered by index. LAY.**

Items are numbered at massive scale (`01 HOME` … `05 CONTACT`). Each item is a two-part LAY: the index and the label are separately masked, index leading by 40ms. The index is Archivo condensed at `display-2`; the label at `display-3`.

Mask direction: **from the left**, for all five. This is one of two sitewide exceptions to position-derived direction (§6.4 of the design system) — a vertical nav list is a stack, and stacks resolve top-to-bottom with a consistent horizontal origin. Alternating direction here would read as noise.

### 6.5 Navigation hover

**CSS. DRAW + SET.**

| Element | Behavior | Timing |
|---|---|---|
| Hovered item label | 1px `#D90D0F` rule DRAWs beneath, `scaleX(0→1)` from left | 240ms `--ease-set` |
| Hovered item index | `#ABABAB` → `#D90D0F` | 120ms |
| Hovered item | `translateX(12px)` — same value as the ledger row shift, deliberately | 240ms |
| **Siblings** | Dim to `ink-600` | 240ms |
| Adjacent preview panel | Project thumbnail crossfades in (§7.5 of design system) | 420ms |

**Sibling dimming is the highest-value hover interaction in the system** and it recurs at every scale: nav items, ledger rows, service courses, footer links. It is the interaction equivalent of the color discipline in §2.1 — attention is a scarce resource that gets spent on exactly one thing.

Implement with `:has()` on the list container (`ul:has(li:hover) li:not(:hover) { color: var(--ink-600) }`), with a `.js-dim` class fallback. No JS required in supporting browsers.

### 6.6 Active page

**CSS. Static, with one drawn element.**

Per §7.3: the red rule under the current page's label is **permanently present**, and a red `+` (D5) precedes the label. The rule does not animate on load in the overlay — it is already there, because the current page is a fact, not an event. `aria-current="page"` carries it semantically.

The **one** animation: when the menu opens, the active item's rule is the only one already at `scaleX(1)`, so as the other items LAY in around it, it reads as pre-existing. Small, and it does a real job — it tells you where you are without a color you have to decode.

### 6.7 Mobile navigation

Same overlay, reduced choreography:

- **Three courses instead of five**, all sweeping from the left. Alternating direction at 390px width reads as jitter, not as bond.
- Stagger 40ms, course duration 320ms → overlay opaque at ~440ms.
- Nav items LAY in at 40ms stagger, `display-3` scale rather than `display-2`.
- **No adjacent preview panel** — there is no room, and it would cost an image download for a hover that cannot happen.
- The overlay is `100dvh`, not `100vh`, and `lenis` is not running on touch so the body lock is `position: fixed` + stored `scrollY`, restored on close.
- **Mobile bottom bar** (design system §9.7): `CALL` and `FREE ESTIMATE`. It LAYs up from the bottom edge once, when the hero's ScrollTrigger passes `bottom top` — i.e. after the visitor commits to scrolling. 320ms, `--ease-structural`, `once: true`. It never hides again, never re-animates, and never animates on scroll direction change (direction-reactive bars are jumpy and a well-known irritant).

---

## 7. HERO

The Home hero is the site's one fully choreographed sequence (§6.5). Every value below is fixed; this is the timeline, not a starting point.

### 7.1 Entrance timeline

**GSAP timeline. DRAW + LAY.** Fires immediately on mount; does not wait for fonts, does not wait for the video.

| t | Element | Verb | Motion | Duration |
|---|---|---|---|---|
| 0ms | Page ground | — | Already `#000`. No flash, ever. | — |
| 0ms | Rail rule | DRAW | `scaleX(0→1)` from left, full viewport | 700ms |
| 80ms | Logo | LAY | Mask from left | 420ms |
| 120ms | Headline line 1 — `PERMANENT` | LAY | `inset(0 0 100% 0)` → 0, `translateY(0.35em → 0)` | 760ms |
| 200ms | Headline line 2 — `BY TRADE` | LAY | Same. **The 80ms offset is the bond offset in time.** | 760ms |
| 340ms | Video plate | LAY | `inset(100% 0 0 0)` → 0 (rises), inner video `scale(1.06 → 1)` | 1000ms |
| 460ms | Image course panels | LAY | Staggered 90ms, each clipping from its outer edge | 900ms |
| 700ms | Sub-line | LAY | Single mask + 0.35em settle | 420ms |
| 780ms | Technical strip (mono) | SET | opacity + 4px rise | 420ms |
| 1000ms | Apex scroll cue | SET | opacity 0→1, then begins its idle loop | 420ms |

**Visually complete at ~1.6s. LCP (the headline) painted by ~880ms.**

The headline is real text with `font-display: swap` and a metric-compatible fallback, so the LCP time is independent of Archivo's arrival. The headline's *mask* is CSS-applied in the server HTML and released by the timeline — meaning the LCP element is present in the DOM from the first byte and only its clip changes.

### 7.2 Video entrance

**GSAP, part of the hero timeline. LAY.**

The plate is a 9:16 portrait video (the source is portrait — §0.1 of the Home spec) presented as a tall plate that overhangs into Course 02. It LAYs upward — `inset(100% 0 0 0) → inset(0 0 0 0)` — because it is a *plate being set into the wall*, and things set into walls come up from the course below.

Sequencing rules, in priority order:

1. The video element **mounts after first paint** and is never on the critical path (§16 of the Home spec).
2. The **poster** — a baked, graded WebP/AVIF at ~40KB — is what the LAY reveals. The video fades in beneath it once `canplay` fires: a 240ms opacity crossfade on the `<video>` only, poster stays as the element's `poster` attribute so there is no gap.
3. `muted` + `playsinline` + `autoplay`. If autoplay is refused, **the poster holds and a labelled play control LAYs in** — never a black rectangle, never a spinner.
4. The video **pauses when scrolled out of view** via a ScrollTrigger `onLeave` / `onEnterBack` pair. A nonessential loop running offscreen is a battery cost with zero benefit.
5. No parallax on the video plate. It already overhangs two courses; adding CARRY to a 112svh element would exceed `--parallax-max` in perceived terms and would fight the scroll.

### 7.3 Headline reveal

Two lines, two masks, 80ms apart, per §7.1. **Line-level, not word-level, and never character-level.**

This is a deliberate rejection of the default. `display-1` at up to 15rem, condensed to `wdth 62`: at that scale a per-character reveal turns the site's single most important statement into a novelty animation, and it forces `will-change` onto 15+ elements at the exact moment the browser is doing its heaviest work. **Two lines, laid like two courses, is both cheaper and more correct.**

### 7.4 Text movement

The only text movement in the hero is the `0.35em` settle inside each LAY. There is no floating, no idle drift, no mouse-parallax on the headline. `display-1` type is *mass*; mass does not respond to a cursor.

### 7.5 CTA animation

Enters at 700ms with the sub-line group as a LAY. It becomes interactive only when the timeline completes — before then it is `pointer-events: none`, so a fast clicker cannot hit a moving target. All hover behavior per §10.

The hero carries **exactly one primary CTA** (design system §9.1). The phone number beside it is a ghost link, not a second button.

### 7.6 Scroll indicator

**CSS keyframes. SET.** The apex (D4) above a D8 stack, bottom-left of the hero at the margin — not centered, because §4.4 forbids centering.

Idle loop, 2.4s: the three stack bars illuminate in sequence, top to bottom, `#5C5C5C → #F3F3F3 → #5C5C5C`, 200ms each with a 600ms rest at the end of the cycle. **The apex itself does not move.** A bouncing chevron is the most template-looking element available in this genre and it is banned.

Termination rules, all mandatory:

- The loop stops permanently at first scroll of >40px. `once`.
- The whole cue fades out over 240ms as the hero passes `top 40%`.
- The loop stops when the tab is hidden (`visibilitychange`) and when the cue is offscreen.
- Removed entirely under reduced motion — the static apex + stack remains as a visual affordance.

### 7.7 Transition into the next section

**ScrollTrigger. CARRY.** The hero does not end; it is overlapped.

The video plate is 112svh tall in a 100svh hero, so it **overhangs into Course 02**. As the visitor scrolls, the plate CARRYs upward at 0.94× scroll speed while the page moves at 1× — a 6% differential, inside `--parallax-max` — so the plate appears to be *set into* the incoming section rather than scrolling away from it. Course 02's content LAYs in around it, and the plate's bottom edge becomes the top edge of Course 02's composition.

This is the site's structural signature expressed in scroll: **courses overlap, they never abut with a seam.** The same handoff logic governs Course 04 → 05 and Course 06 → 07.

---

## 8. TYPOGRAPHY

### 8.1 Splitting — the infrastructure decision

**No `SplitText` (GSAP paid plugin). No `splitting.js`. A ~40-line local splitter.**

Because the site only ever splits to **lines** and, in two named places, to **characters**, a bespoke splitter is smaller, has no license, and lets us enforce the rules mechanically. Requirements:

- Wraps each line in a `<span class="line">` containing a `<span class="line__inner">`. The outer span is the mask (`overflow: hidden` is not used — `clip-path` is, so descenders are not clipped by an `overflow` box; see below). The inner span carries the transform.
- **Descender safety:** masking headline type with `overflow: hidden` clips descenders on `g`, `y`, `p` at tight leading (`--lh-display: 0.86`). Use `clip-path: inset(-0.15em 0 100% 0)` — negative top inset — so ascenders and descenders survive.
- **Re-splits on resize** (debounced 200ms, width-only — never on height change, which fires on mobile URL-bar scroll) and after `document.fonts.ready`, then calls `ScrollTrigger.refresh()`.
- **Accessibility contract:** the original text is preserved. The split container carries `aria-label` with the full string and the generated spans are `aria-hidden="true"`. Otherwise screen readers announce fragments and copy/paste breaks.
- **Never splits body copy.** Only `display-*`, `h1`, `h2`.

### 8.2 Line reveal — the default

**GSAP + ScrollTrigger. LAY.** This is the sitewide default and 90% of all typographic motion.

```
clip-path:  inset(-0.15em 0 100% 0) → inset(-0.15em 0 -0.15em 0)
translateY: 0.35em → 0
duration:   760ms   --ease-structural
stagger:    80ms per line (the beat, not the list stagger)
```

Never `translateY(60px)` + fade. That is the template look and the single most common way this genre gives itself away (§6.4).

### 8.3 Word reveal — the exception

**Permitted in exactly one situation: a short statement line of ≤6 words that is the entire content of its section.** On this site that is Course 02's statement and the Services page's opening claim. Stagger 60ms, same LAY parameters, direction from the left.

Any headline longer than six words reveals by line. A twelve-word headline revealed word-by-word takes 720ms of stagger to deliver one sentence, and by word four the visitor is waiting rather than reading.

### 8.4 Character reveal — two places, both justified

Character-level splitting is banned by default. Two sanctioned exceptions:

1. **Ledger and project index numerals** (`001`, `002`…). Three characters, tabular figures, `display-2` scale. They LAY in from the bottom at 40ms stagger — this is legible as a *counter incrementing*, which is exactly what an index is. Cheap: three spans.

2. **The footer monument `BRIX`.** Four characters, and they are the brand. See §14.

That is the complete list. It is short because the justification bar is: *does character-level granularity carry meaning that line-level cannot?* For a numeral (it counts) and for a four-letter wordmark (each letter is a unit being laid), yes. For a sentence, no — sentences are read in lines.

### 8.5 Masked text

Every text reveal on the site is masked. This is already established, but the mechanics are worth stating once because they are the most-repeated code in the codebase:

- The **mask never moves.** It is a `clip-path` inset animated on the element itself.
- The **content moves 0.35em**, opposite to nothing — it simply settles up into place.
- Mask origin follows the direction table (§6.4).
- **Opacity is not animated on masked text.** The mask *is* the reveal. Adding a fade on top makes it mushy and defeats the entire point of choosing masks over fades.

That last rule is the one most likely to be violated by habit, and it is a review-failing defect.

### 8.6 Scrolling text

**ScrollTrigger. CARRY. There is exactly one instance of this on the site, and it is not a marquee.**

A single mono spec strip runs the full width at the seam between Course 05 (Method) and Course 06 (Material), reading the material vocabulary as a continuous specification line:

```
RUNNING BOND / SOLDIER COURSE / HERRINGBONE / FLEMISH BOND / ROWLOCK / SAILOR COURSE /
```

It is **velocity-driven, not time-driven**: `x` is bound to scroll position at 0.12× so it drifts left as you scroll down and **right as you scroll up**. It is motionless when the page is motionless.

That distinction is the whole justification. An infinite auto-marquee is animation for its own sake: it runs when nobody is watching, it costs battery, it never stops, and it says nothing. A scroll-bound strip is a *readout* of the visitor's own motion, which is consistent with the site's instrumentation register (the progress rule, the course counter). One instance. Not repeated on any other page.

`aria-hidden="true"` — it is decorative typography, and it duplicates content stated properly elsewhere.

### 8.7 Large typography movement

**ScrollTrigger. CARRY.** Applies to `display-1` and `display-2` type only, in three places sitewide (Course 02 statement, Services page title, footer monument).

Large type CARRYs at **0.96× scroll speed** — a 4% differential, half of `--parallax-max`. Restraint here is the entire point: at 15rem, a 4% differential is already a visible 20–30px of drift, and 8% would read as the text sliding.

**Hard constraints:**

- Large type never CARRYs while it is also LAYing in. The reveal completes first; CARRY attaches after.
- Large type never CARRYs horizontally. Vertical only. Horizontal drift on a headline reads as a broken layout.
- Never applied to type the visitor needs to read carefully — never on body copy, never on form labels, never on the ledger rows.
---

## 9. IMAGES

### 9.1 The reveal — clip-path, sitewide

**GSAP + ScrollTrigger. LAY.** Per §5.5 of the design system, restated with full mechanics because this is the second-most-repeated code in the codebase:

```
Mask (the figure):   clip-path: inset(0 0 100% 0) → inset(0 0 0 0)     900ms  --ease-structural
Inner <img>:         scale(1.06) → scale(1.0)                          900ms  --ease-structural
```

**The counter-motion is the entire idea.** The mask opens one way while the image settles the other. That opposition is what produces a structural feel rather than a generic fade-up, and dropping the counter-scale to save a line of code destroys the effect.

Mask origin follows the direction table (§6.4): an image that bleeds left opens from the left; a full-bleed band opens from the bottom, like a wall rising.

**Never a fade.** No image on this site ever animates `opacity` on entrance. There is one narrow exception: the poster→video crossfade in §7.2, which is a source swap, not a reveal.

**Layout safety:** every image reserves its exact aspect box before it loads (`aspect-ratio` from the §5.4 treatment table). Reveal animations must not be the reason a layout shifts. Target CLS on every page: **0**.

### 9.2 Scale reveal

The `1.06 → 1.0` counter-scale in §9.1 is the site's only entrance scale. It is applied to the inner `<img>`, inside `overflow: hidden` on the mask element, so the frame is fixed and the content moves within it — consistent with §7.1's governing principle.

**Nothing on this site scales up on entrance.** An element growing from 0.9 to 1.0 is a "pop", and pops are the visual signature of playful motion. Masonry does not pop.

### 9.3 Parallax

**ScrollTrigger. CARRY. `scrub: 0.6`, `ease: none`.**

```
yPercent: -(parallaxMax * 100) / 2  →  +(parallaxMax * 100) / 2
```

Applied to the inner `<img>`, which is oversized by exactly `--parallax-max` (8%) relative to its mask so no edge is ever exposed. The mask never moves.

Rules:

- **Maximum 8% of element height.** More reads as gimmick (§6.6).
- **Maximum two parallax elements active simultaneously per page**, counted against the total scrubbed-ScrollTrigger budget of 2 (§6.7).
- **Never on a text element and its background image at once** — two differentials in one composition reads as a rendering fault.
- **Never below 768px** (§16).
- Disabled under reduced motion; elements sit at their neutral (mid-range) position, not at either extreme.

Which images get parallax is a *page-level* decision made once per page and recorded in that page's motion budget audit. On Home: the Course 04 featured plate (7%) and the Course 06 diptych — never both in view.

### 9.4 Grayscale-to-color

**Not used. Explicitly rejected.**

The images have already received a single unified grade at build time (§5.2 of the design system): desaturated greens and blues, brick held at ~95%, film grain at 2–4%. A runtime `filter: grayscale()` transition would:

1. Animate `filter`, which is on the forbidden-properties list (§6.7);
2. Force a full-layer repaint on every frame of a hover — the most expensive thing you can do to a large image;
3. Undo the build-time grade that unifies eleven photographs into one body of work;
4. Say "we are hiding the photo until you interact with it," which is precisely the wrong message for a business whose credibility rests on showing real work honestly.

**The images arrive fully graded and stay fully graded.** If a hover needs to signal state, it moves a line (§7.1) or dims siblings — it does not desaturate the product.

The one sanctioned near-relative: **sibling dimming** on the Work index, implemented as `opacity: 0.4` on non-hovered plates over the black ground. That is a compositing operation, not a filter, and it is cheap.

### 9.5 Hover zoom

**CSS. SET.**

```
.plate:hover .plate__img { transform: scale(1.04); }   700ms  --ease-structural
```

Fixed mask, inner image scales — the frame is static, the content moves (§7.1). 1.04, not 1.08: at 1.08 a 2× asset visibly softens, and the move stops reading as *considered*.

Accompanying, in the same 700ms: a red `+` (D5) SETs in at the plate's top-left corner (`opacity` only — it is 12×12px and already positioned). Over a clickable project image the cursor follower expands to a labelled `VIEW` disc (§11.3).

Touch: `:hover` is scoped inside `@media (hover: hover) and (pointer: fine)`. No sticky hover states on phones, ever.

### 9.6 Directional image movement

Direction is derived, never authored — three coupled rules that together make the image language read as one system:

| Context | Direction |
|---|---|
| **Reveal mask origin** | The edge nearest the margin the image bleeds toward |
| **Parallax direction** | Always vertical, always against the scroll |
| **Alternation** | Odd sections bleed left, even sections bleed right (design system §4.4) |

Because bleed alternates by section index, mask direction alternates automatically down the page — producing a woven rhythm nobody had to author. That is the property that makes this a system rather than a list of settings.

In the Course 06 diptych, the two plates open from *opposite* outer edges toward the joint between them, 90ms apart. The joint is where they meet, so it is where the motion resolves. This is the only place two images animate simultaneously, and it is permitted because they are one composition.

---

## 10. BUTTONS

Three tiers, per §7.2 of the design system. Every state below is **CSS**, with one GSAP exception (§10.2).

### 10.1 Anatomy

Every button is the same four layers, which is what lets one stylesheet serve all three tiers:

```
<button>
  <span class="btn__fill">    ← the sweep plane; scaleX(0) from left
  <span class="btn__label">   ← text; translateX on hover
  <span class="btn__icon">    ← apex chevron (D4); translateX on hover
  <span class="btn__rule">    ← 1px underline; ghost tier only
```

### 10.2 Magnetic interaction

**GSAP `quickTo`. SET.** Primary buttons only.

```
radius of influence:  80px from the button's bounding box
lerp:                 0.15
max displacement:     6px  (--magnet-max)
label counter-move:   2px in the SAME direction (a 1/3 differential, giving depth)
leave:                400ms  --ease-set  back to 0
```

`gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" })` — created once per button, not a new tween per `mousemove`. A single delegated `pointermove` listener on `document`, throttled to `requestAnimationFrame`, serves every magnetic button on the page. Never one listener per button.

**The element leans; it does not leap** (§7.1). 6px is the ceiling and it is not negotiable — beyond ~8px the button starts to feel like it is dodging the cursor, which is the opposite of an invitation.

**Disabled entirely** on `(hover: none)`, on `(pointer: coarse)`, and under reduced motion. On those paths the button is simply a button, and nothing is lost.

### 10.3 The red sweep

**CSS. DRAW.** The signature button interaction, identical across tiers.

| Tier | Rest | Hover |
|---|---|---|
| **Primary** | `#BA0507` fill (MASS) | `.btn__fill` in `#D90D0F` (LIGHT) `scaleX(0→1)` from left, 240ms `--ease-set` |
| **Secondary** | Transparent, 1px `ink-500` border | Border → `#D90D0F` (120ms); `#D90D0F` fill sweeps from left (240ms); text stays `#F3F3F3` |
| **Ghost** | 1px `ink-500` underline at 6px offset | Existing underline sweeps OUT to the right; red underline sweeps IN from the left. Both 240ms, the second offset by 80ms. |

The ghost tier's two-part sweep is worth the extra 80ms: one line replacing another *is* the interaction, and crossfading them would lose the sense of substitution.

`transform: scaleX()` on a `transform-origin: left` plane. **Never `width`, never `background-position`** — both are on the forbidden list (§6.7).

Corollary from §2.2: a filled shape is never bright red at rest. Bright red arrives on hover — energy arriving — and recedes on leave. The sweep out is 144ms (0.6×) from the right, so the light exits the way it would drain.

### 10.4 Icon movement

**CSS. SET.** The apex chevron (D4), 12px, 8px gap.

```
rest:   translateX(0),  opacity 1
hover:  translateX(8px)                     240ms  --ease-set
```

On the primary tier the chevron *slides in from the right* rather than translating in place: it starts at `translateX(-8px)` with `opacity: 0` and arrives at `0/1`. The chevron is a direction indicator and it should feel like it is being handed to you.

The icon never rotates. It never spins on click. It is a fixed piece of geometry derived from the logo (§4.2, D4) and rotating it would break the one relationship it has.

### 10.5 Text movement

**CSS. SET.** `translateX(4px)` on hover, 240ms, moving with the icon rather than away from it. Half the icon's displacement, so the gap between label and chevron opens by exactly 4px — the smallest unit in the system.

On the ghost tier the label does not move at all; only the rule beneath it changes. A text link that shifts on hover disturbs the paragraph it sits in.

### 10.6 Active (pressed) state

**CSS. SET. ≤120ms — this must feel instant.**

| Tier | Pressed |
|---|---|
| Primary | `#8F0405` (`--red-900`), `translateY(1px)` |
| Secondary | `#8F0405` fill |
| Ghost | Underline → `#8F0405` |

`translateY(1px)` and no scale. A button that scales down on press is a soft, toy-like gesture; a 1px depression is a switch being thrown. Magnetic displacement is suspended while pressed so the button does not drift under a held finger.

### 10.7 Focus state

**CSS. SET. `:focus-visible` only.**

2px `#D90D0F` ring at 2px offset on dark surfaces; 2px `#F3F3F3` ring on red-filled buttons (§2.5). The ring **appears at 120ms and does not animate its geometry** — a ring that scales or pulses in is a distraction at exactly the moment a keyboard user needs certainty about where they are.

Focus must be visible **before** any hover-equivalent effect and must not depend on it: keyboard users get the ring *and* the sweep, because the sweep is bound to `:hover, :focus-visible` jointly. `outline: none` never appears without a replacement in the same rule.

---

## 11. WORK PAGE

The Work index is ledger rows, not cards (§7.6). This is the highest-value interaction on the site and it costs almost nothing to render.

### 11.1 Project hover

**CSS. DRAW + SET.** One row is `[index] [title] [category] [apex]` on a hairline rule, 96px tall desktop / 72px mobile.

| Layer | Rest | Hover | Timing |
|---|---|---|---|
| Row background | transparent | `ink-100` sweeps **from the left**, `scaleX(0→1)` | 240ms `--ease-set` |
| Index | `#ABABAB` | `#D90D0F` | 120ms |
| Title | `#F3F3F3` | `translateX(12px)` | 240ms `--ease-set` |
| Category / spec | `#ABABAB` | `translateX(12px)`, 40ms behind the title | 240ms |
| Apex, far right | `opacity: 0` | `opacity: 1`, `translateX(-8px → 0)` | 240ms |
| Bottom rule | `ink-400` | `#D90D0F`, DRAWs from the left | 240ms |
| **Siblings** | `#F3F3F3` | dim to `ink-600` | 240ms |

The 40ms lag between title and category is doing real work: it makes the row read as a *unit being pushed* rather than as two elements moving in lockstep, and it costs one line of CSS.

Sibling dimming via `:has()` on the list, exactly as in §6.5. Same technique, same timing, different scale — that repetition is what the visitor perceives as a coherent language.

### 11.2 Project image preview

**Framer Motion for presence (the panel) + GSAP `quickTo` for position. SET.**

Treatment T7: a 4:5 panel, ~280×350px, following the cursor.

```
mount:    clip-path inset(0 0 100% 0) → 0    320ms  --ease-structural   (a LAY, at small scale)
          inner image scale 1.06 → 1.0       320ms
unmount:  reverse                            190ms  (0.6×)              --ease-mechanical
```

The panel carries the project's spec line in mono at its base — the preview is a *plate*, complete with its caption, not a floating thumbnail.

**Constraints, all mandatory:**

- The preview appears **only on pointer-fine devices**. It never fires on keyboard focus — it is a pointer-only enhancement, and the row's focus ring plus its own destination page carry the same information (§7.6).
- **One preview instance in the DOM**, reused. Its `src` swaps on row change with a 120ms mask wipe rather than a fade — the plate stays, the content is replaced, which is far more precise than crossfading two images.
- All preview images are **preloaded at low priority** after the page's own entrance completes. A preview that arrives blank on first hover is worse than no preview.
- Position updates via `quickTo` with `duration: 0.35, ease: "power3"` — a trailing lerp, so the plate follows with weight rather than sticking to the cursor.

### 11.3 Cursor-follow

**GSAP `quickTo`. SET.** Per §7.9: the native cursor is never hidden. A 10px red-outlined square trails at `lerp 0.18`, expanding to a 96px labelled disc — `VIEW` — over project images and the menu trigger.

Wait: a *disc* is a circle, and §4.1 forbids radius everywhere. **Correction to §7.9: the expanded follower is a 96px square, not a disc**, with a 1px `#D90D0F` border and a centered mono `VIEW` label. Recorded as an amendment in §19.

- Expansion is `scale()` on a fixed-size element, 240ms `--ease-set` — never a `width`/`height` animation.
- The label LAYs in from below inside the square, 40ms behind the expansion.
- Purely additive: if it fails to initialise, nothing breaks. Disabled entirely on touch and under reduced motion.
- Position updates are one delegated `pointermove` → `quickTo`, driven by GSAP's ticker. Never `requestAnimationFrame` loops of its own, and never a `transition` on `transform` (that produces the rubbery lag everyone recognises).

### 11.4 Project transitions

**Framer Motion cover, plus one continuity element.**

The standard route transition (§5.3) runs. The one addition: **the row's index numeral is the shared element.** As the cover wipes up, the clicked row's index (`004`) SETs to `#D90D0F` and holds; the destination project page's own index numeral is already `#D90D0F` and in the same grid column, at the same `display-2` scale, so it appears to have persisted through the cover.

This is a *positional* shared element, not a FLIP animation — no measurement, no `Flip` plugin, no layout thrash. The grid does the work, because both pages use the same grid. That is the payoff for the design system's strictness, and it is worth stating in review as evidence that the constraint was correct.

### 11.5 Scroll reveals

Rows enter in batches, not individually:

```
ScrollTrigger.batch(".ledger-row", {
  start: "top 82%",
  onEnter: batch => LAY in, stagger 60ms (clamped per §3.4),
  once: true
})
```

Each row is a two-part LAY: the bottom rule DRAWs from the left (240ms), then the row's content LAYs down into it (420ms, 80ms offset). **The rule arrives before the content, always** — the line is struck, then the unit is laid to it (§1.1, rule 6). At 12 rows the clamp gives 43ms and the whole index resolves in under a second.

On the Work index's plate grid (T3, framed plates), the D6 offset frame DRAWs as two strokes — top-left corner outward — over 420ms after the plate's mask completes. The frame is a *dimension line* and dimension lines are drawn after the object they measure.

---

## 12. SERVICES — "The Elevation"

> **Ordinary service cards are forbidden here** (§9.3: the word "card" does not exist in this system). The Services page is not a list of offerings. It is a **wall section drawing**, and scrolling builds it.

### 12.1 The concept

The left column holds a **sticky elevation drawing**: a 1px line diagram of a wall in section, built bottom-up in the real order of construction —

```
        ┌──────────────┐   06  CAP / COPING
        ├──────────────┤   05  OUTDOOR STRUCTURES
        ├──────────────┤   04  STONE VENEER
        ├──────────────┤   03  BRICK VENEER
        ├──────────────┤   02  BLOCK / STRUCTURAL
   ═════╧══════════════╧═   01  FOOTING / CONCRETE
```

The right column scrolls through the six services. **As you scroll, the wall builds upward, course by course, in the drawing.** The active course is `#F3F3F3` with a `#D90D0F` dimension line extending from it to the service's title in the right column. Inactive courses are `ink-500` outline only.

This is not a metaphor applied to a list. It is the actual construction sequence — you cannot lay brick before the footing — so the page's scroll order *is* the trade's order, and the drawing is a genuine explanation rather than an ornament. It is also the only thing on the site that could not be mistaken for another contractor's website.

### 12.2 The motion

**GSAP + ScrollTrigger, pinned. CARRY. This is the one sanctioned pin on the site** (§6.6).

| Element | Verb | Behavior |
|---|---|---|
| Elevation container | — | Pinned for the section's scroll length, max 200vh per §6.6 |
| Each course outline | DRAW | `stroke-dashoffset` → 0, **scrubbed** to scroll. The wall literally draws itself as you descend the page. |
| Active course fill | SET | `ink-500` → `#F3F3F3` stroke, 240ms, on its ScrollTrigger becoming active |
| Dimension line | DRAW | 1px `#D90D0F`, `scaleX(0→1)` from the drawing to the right column, 320ms on activation |
| Course index (mono) | SET | `#ABABAB` → `#D90D0F`, 120ms |
| Right-column content | LAY | Standard Course composite (§1.2) per service |
| Detail plate | LAY | A T5 detail crop (§5.4) LAYs into the drawing's void beside the active course, 420ms |

**Scrub configuration:** `scrub: 0.6` on the stroke-draw, `ease: none`. The stroke draw is a single tween across the whole pinned section, so it is **one** scrubbed ScrollTrigger, not six — keeping the page inside the budget of 2 (§6.7).

**Why `stroke-dashoffset` is permitted** despite not being `transform`/`opacity`/`clip-path` (§6.7): it is on an SVG path of a few hundred bytes, it does not trigger layout, and its paint area is a 1px stroke. It is added to the permitted-properties list **for SVG stroke geometry only** — recorded as an amendment (§19). It is not permitted on filled shapes, and it is not permitted outside this component.

### 12.3 Interaction

- **Hovering a course** in the drawing highlights it and dims the others to `ink-600` (the sibling-dimming law again, §6.5). The corresponding service title in the right column brightens simultaneously — the two columns are one control.
- **Clicking a course** scroll-jumps via `lenis.scrollTo()` with a 900ms `--ease-structural` — this is a navigation, so it gets the reveal duration rather than a snap.
- Courses are real `<button>`s in a real list, keyboard-navigable, with `aria-current` on the active one. The drawing is `role="img"` with an `aria-label` describing the wall section; the interactive courses sit above it as focusable controls.

### 12.4 Mobile (< 1024px)

The pin is removed entirely — pinned sections on touch are the most reliable source of scroll jank in this genre.

Instead, the elevation **collapses into the flow**: each service is preceded by its own single-course fragment of the drawing, 48px tall, full width, which DRAWs its stroke on entry (420ms, time-based, not scrubbed). The wall still builds as you descend; it is just distributed rather than sticky. The dimension line becomes a short 24px red rule.

**Nothing is lost conceptually and everything expensive is gone.** This is the correct shape for a mobile reduction: a simpler expression of the same idea, not a truncated version of the desktop one.

---

## 13. CONTACT — "The Work Order"

The form is a work order (§12.6 of the Home spec). Motion's job here is **confirmation and progress**, nothing else. Every animation below either acknowledges an input or reports state. There is not one decorative animation in this section, deliberately: a contact form is the one place on the site where the visitor has a task, and motion that entertains during a task is motion that interferes with it.

### 13.1 Field focus

**CSS. DRAW + SET.**

```
bottom rule:  1px ink-500 → 2px #D90D0F, scaleX(0→1) from the LEFT   240ms  --ease-set
label:        #ABABAB → #F3F3F3                                       120ms
field index:  #ABABAB → #D90D0F                                       120ms
```

The rule *draws* rather than recolors: the red overlay rule is a separate 2px element at `scaleX(0)` sitting on top of the resting hairline, so the transition is a `transform`, not a color change on a border (§6.7 forbids animating `filter`, and border-color changes cannot be directional).

**No floating labels.** Labels sit above the field permanently (§7.8). Floating-label animation is a solved-problem pattern that this system explicitly does not need, because the label was never inside the field to begin with.

### 13.2 Field completion

**CSS. SET.** On `blur` with a valid non-empty value: a red `+` (D5) SETs in at the field's right edge, `opacity` + `translateX(-4px → 0)`, 240ms. It persists.

This is the site's `+` mark doing what it does everywhere else — marking a registration point — and here it accumulates down the form as a visible record of progress. Small, cheap, and it makes a six-field form feel like it is being *completed* rather than endured.

### 13.3 Progress course

**CSS. DRAW.** A 1px rule above the form, segmented into one cell per required field, each cell filling `#D90D0F` `scaleX(0→1)` from the left as its field validates. 240ms per cell.

It is the same instrument as the scroll progress rule (§5.5), applied to a different axis of progress. Reusing the instrument rather than inventing a second one is what makes it read as a system.

`aria-hidden` — progress is also carried by a visually-hidden live region announcing "3 of 5 complete" politely, on blur only, never per keystroke.

### 13.4 Validation

**CSS. SET.**

- **Validation runs on blur, never on keystroke.** Live per-character validation that turns a field red while someone is still typing is hostile, and it means the motion fires against the user rather than for them.
- **Error:** the bottom rule turns `#D90D0F` (120ms, no draw — an error is a state, not an event) and the message LAYs in below, 240ms, in `#F3F3F3` mono preceded by a red apex glyph. **Never red text** (§2.4). The field is not shaken. A shake is a punishment animation and it has no place on a form where the visitor is trying to hire you.
- **Recovery:** on the field becoming valid, the message LAYs out upward in 144ms and the rule returns to `ink-500`. Fast, because the problem is over.
- `aria-invalid` and `aria-describedby` carry the state semantically; the message container is `role="alert"` only while an error is present.

### 13.5 Project-type chips

**CSS. DRAW.** Not a `<select>` — a keyboard-navigable radio group of hard-edged chips (§7.8).

```
rest:      transparent, 1px ink-500 border
hover:     border → #D90D0F                                  120ms
selected:  #BA0507 fill sweeps from the LEFT, scaleX(0→1)    240ms  --ease-set
           label #ABABAB → #F3F3F3                           120ms
deselect:  fill sweeps OUT to the right                      144ms
```

The same sweep as the button system (§10.3). One gesture, three contexts — button, chip, ledger row. That is the reuse the brief is asking for.

### 13.6 Submit states

**CSS for the fill · Framer Motion for the label swap. DRAW + LAY.**

```
IDLE      → primary button, #BA0507
SENDING   → the fill DRAINS left-to-right: a black plane scaleX(0→1) from the left
            over the red, at the request's actual pace where measurable, otherwise a
            1200ms indeterminate cycle. Label swaps to SENDING. Button disabled.
SENT      → the fill re-establishes in #BA0507 from the left (240ms); the label LAYs
            out upward and REQUEST RECEIVED LAYs in from below (both 200ms), preceded
            by a red apex mark that DRAWs its two strokes (240ms). Button locks.
ERROR     → the fill returns to #BA0507; the label returns to SEND REQUEST; a message
            LAYs in below per §13.4. The button is immediately usable again.
```

The drain is the only progress indicator on the site. **There is no spinner anywhere in this codebase** — a rotating element violates §6.1 (structures do not spin) and every state that would need one has a linear alternative here.

`aria-live="polite"` on the button's status, `aria-busy` while sending.

---

## 14. FOOTER — "The Foundation"

The last thing a visitor sees should be the thing that stays with them. This is the site's second authored moment, after the hero, and the only other place that gets `--dur-major`.

### 14.1 The composition

Per §9.8 of the design system: `BRIX` set in Archivo condensed at viewport width, sitting **on** a 2px red rule — the foundation line — with the apex above it at large scale.

### 14.2 The animation

**GSAP + ScrollTrigger. DRAW + LAY. Fires once, at `top 90%`.**

| t | Element | Verb | Motion | Duration |
|---|---|---|---|---|
| 0ms | Upper course (CTA · phone · email · nav) | LAY | Standard Course composite | 760ms |
| 240ms | **The foundation rule** | DRAW | 2px `#D90D0F`, `scaleX(0→1)` from the left, full bleed | **1000ms** |
| 560ms | `B` | LAY | Masked by the rule itself: `inset(0 0 100% 0) → 0`, rising from behind the line | 1000ms |
| 640ms | `R` | LAY | 80ms behind | 1000ms |
| 720ms | `I` | LAY | | 1000ms |
| 800ms | `X` | LAY | | 1000ms |
| 1200ms | Apex (D4), above | DRAW | Two 2px strokes drawing from the vertex outward, ±18° | 700ms |
| 1600ms | Legal strip, mono, `ink-600` | SET | opacity + 4px rise | 420ms |

**Complete at ~2.0s** — the longest sequence on the site, and the only one longer than the hero. It is justified because it is terminal: there is nothing after it competing for the frame, and the visitor has arrived rather than been interrupted.

### 14.3 Why this is the right final move

The wordmark does not fade in, does not scale up, and does not travel. **It rises from behind the foundation rule, one letter at a time, and comes to rest on it.** The rule is drawn first and is literally the mask boundary — so the letters are not revealed *next to* the foundation, they are revealed *by* it. The four letters are the site's only sanctioned character-level reveal besides index numerals (§8.4), and they earn it because each letter is a unit being laid onto a footing that was struck a moment earlier.

It is the four verbs in their construction order, at full scale, one time: **DRAW the line. LAY the units. SET the mark.** If a visitor understands the site's motion language at all, they understand it here.

### 14.4 Constraints

- The `BRIX` mask uses `clip-path` on four spans. **No `font-variation-settings` animation** — animating a variable-font width axis at 8rem forces a full glyph rasterisation every frame and is one of the most expensive things a browser can be asked to do. The width axis is set once, statically, at `--wdth-condensed`.
- Nothing in the footer CARRYs. It is the ground; ground does not parallax.
- No idle loop, no hover on the wordmark, no cursor interaction. It is a monument. Monuments are still.
- Under reduced motion the entire sequence resolves instantly to its final state, which is a complete and correct composition — as it must be, since it is the page's conclusion.
---

## 15. PERFORMANCE

### 15.1 Budgets

| Metric | Budget |
|---|---|
| Motion JS, gzipped (GSAP core + ScrollTrigger + Framer `domAnimation` + Lenis + splitter) | **≤ 62 KB** |
| Scrubbed ScrollTriggers active simultaneously | **2** |
| Total ScrollTrigger instances per page | **≤ 24** |
| Pinned sections per page | **1** (Services only; 0 elsewhere) |
| Simultaneously animating elements in a viewport | **1 primary** + unlimited SET |
| Elements carrying `will-change` at any instant | **≤ 6** |
| Sustained frame rate during scroll, mid-tier Android | **≥ 55 fps** |
| CLS, every page | **0** |
| Main-thread work per scroll frame | **≤ 4 ms** |

If a budget is breached, the fix is **removing an animation**, never optimising a frame. There is no animation in this system whose removal costs the site more than a dropped frame does.

### 15.2 Animatable properties

**Permitted:** `transform`, `opacity`, `clip-path`, and `stroke-dashoffset` on SVG stroke geometry only (§12.2, amendment).

**Forbidden, absolutely:** `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `filter`, `backdrop-filter`, `box-shadow`, `background-position`, `background-size`, `border-width`, `font-variation-settings`, `letter-spacing`.

Three of those deserve their reasons stated, because they are the ones developers reach for:

- **`filter`** — a grayscale or blur transition on a large image repaints the entire layer every frame. It is also unnecessary here: the grade is baked (§9.4).
- **`font-variation-settings`** — re-rasterises glyphs per frame. At `display-1` scale this is catastrophic. Width axes are static values, always.
- **`letter-spacing`** — triggers layout on every frame and reflows everything after it. The system's tracking values (§1.3) are fixed per size and never animated.

### 15.3 `will-change` discipline

Applied **only** for the duration of a known animation, and removed on completion:

```
onStart:     gsap.set(el, { willChange: "transform" })
onComplete:  gsap.set(el, { willChange: "auto" })
```

Never in a stylesheet on a class that persists. Never on more than six elements at once. A permanently-promoted layer is a permanent memory cost and, past a handful, actively slows compositing — the exact opposite of the intent.

Exception: the cursor follower and the scroll progress rule carry `will-change: transform` permanently, because they animate continuously by design. That is 2 of the 6.

### 15.4 Read/write discipline

- **Never read layout in a scroll or pointer handler.** All measurements happen in `ScrollTrigger`'s refresh phase or on resize, cached, and reused.
- One delegated `pointermove` listener on `document`, `rAF`-throttled, serving the cursor follower, all magnetic buttons and the ledger preview. Never one listener per component.
- No component runs its own `requestAnimationFrame` loop. **GSAP's ticker is the site's only animation clock**, and Lenis is bound to it (§4.3). Two independent RAF loops guarantee tearing between scroll and animation.
- `ScrollTrigger.refresh()` runs on: `document.fonts.ready`, image `load` for any non-`aspect-ratio`-reserved element (there should be none), and debounced width-only resize. **Never on height-only resize** — mobile URL-bar collapse fires that constantly and refreshing there causes visible jumps.

### 15.5 Load order

1. Critical CSS inlined, including the black ground and every entrance's initial `clip-path` state.
2. Fonts preloaded (`display: swap`, metric-compatible fallback). Motion never waits on fonts.
3. Motion bundle loaded with the page but **initialised in an effect after first paint**. The hero timeline starts on the frame after mount.
4. Below-the-fold images lazy; the Course 04 featured plate preloads at low priority once the hero timeline completes; Work preview images preload after the page entrance completes.
5. The video mounts last, after first paint, never on the critical path.

### 15.6 Degradation ladder

Applied in this order when a device or condition demands it. Each rung is complete and correct on its own.

| Rung | Condition | What is removed |
|---|---|---|
| 0 | Desktop, fine pointer, motion allowed | Full system |
| 1 | Coarse pointer | Magnetic buttons, cursor follower, ledger preview, hover states |
| 2 | < 1024px | Services pin, parallax, sibling dimming, menu preview panel |
| 3 | < 768px | Bond-offset choreography, reduced stagger, 3-course menu, no scroll-velocity strip |
| 4 | `prefers-reduced-motion` | All CARRY, all Lenis, all loops; LAY → 200ms opacity |
| 5 | `saveData` or `deviceMemory ≤ 4` | Everything in rung 4 plus the hero timeline (renders final) |
| 6 | JS fails entirely | Every page fully rendered, fully readable, fully navigable |

Rung 6 is the one that must be verified by actually disabling JS, not by reasoning about it.

---

## 16. Mobile animation reductions

Not "the desktop motion, smaller." A phone is a different instrument: a coarse pointer, a narrow column, a weaker GPU, a battery, and a visitor who is frequently standing in a driveway looking at a contractor's website.

### 16.1 Removed entirely below 1024px

- **All parallax.** On a 390px column an 8% differential is ~20px of drift that costs a composited scroll. Not worth it, ever.
- **The Services pin.** Replaced by the distributed elevation (§12.4).
- **Sibling dimming.** There is no hover.
- **The menu's adjacent preview panel.**
- **Magnetic buttons, cursor follower, ledger preview** — all pointer-fine only (rung 1).

### 16.2 Removed below 768px

- **The scroll-velocity spec strip** (§8.6). Horizontal motion in a narrow column reads as a layout error.
- **Bond-offset choreography.** Per §3.4 of the design system, bond offset is 0 on mobile, so the temporal offsets that mirror it collapse too: staggered courses become a single group. The one exception, matching the layout exception, is the hero headline, which keeps its 80ms two-line offset because that is the brand signature.

### 16.3 Reduced, not removed

| Motion | Desktop | Mobile |
|---|---|---|
| List stagger | 60 / 40ms | **30ms**, total capped at **240ms** |
| Reveal duration | 760ms | **520ms** |
| Image mask | 900ms | **600ms** |
| Menu overlay | 5 courses, 420ms, alternating | **3 courses, 320ms, all from left** |
| Hero timeline | ~1.6s | **~1.1s** (video plate and image panels collapse into one beat) |
| Footer monument | ~2.0s | **~1.3s**, letters at 60ms |
| Page transition | 420 + 420ms | **320 + 320ms** |

**The principle: on mobile, motion gets faster, not smaller.** A phone visitor is scrolling quickly with a thumb; a 760ms reveal they scroll past at 400ms is a half-drawn element, which is worse than no animation. Shortening durations keeps every reveal *complete* at thumb speed.

### 16.4 Touch-specific

- `syncTouch: false`; Lenis is not initialised on touch at all (§4.3). Native momentum only.
- Every `:hover` rule is inside `@media (hover: hover) and (pointer: fine)`. No sticky hover states.
- Tap feedback is the pressed state (§10.6) and it must appear within 120ms of `touchstart`, not on `click`. `touch-action: manipulation` to remove the 300ms delay.
- Minimum tap target 44px (`--tap-min`), enforced with padding, never by scaling an element up on touch.
- **Nothing animates on scroll-direction change.** No hiding headers, no reappearing bars. The mobile bottom bar appears once and stays (§6.7).

### 16.5 Implementation

All of the above lives in **`gsap.matchMedia()`**, not in scattered `window.innerWidth` checks:

```
mm.add("(min-width: 1024px) and (pointer: fine)",     () => { /* full */ })
mm.add("(max-width: 1023px)",                          () => { /* reduced */ })
mm.add("(prefers-reduced-motion: reduce)",             () => { /* §17 */ })
```

`matchMedia` handles teardown and re-setup on breakpoint crossing automatically, which is the difference between a system that works when a tablet rotates and one that does not.

---

## 17. Reduced-motion behavior

> **This is a first-class rendering path, not a degraded one.** Every page must be complete, correct, and beautiful with all motion removed.

That standard is not rhetorical. The test is: screenshot every page with `prefers-reduced-motion: reduce` and with it off, and the *final* frames must be identical. If they differ, motion was carrying information, and that is a design defect.

### 17.1 What happens

| System | Under reduced motion |
|---|---|
| Page entrance | No timeline. Everything renders final. The rail rule is present, not drawn. |
| Route transitions | **160ms crossfade**, no cover, no courses |
| Lenis | **Not initialised.** Native scroll. |
| Scroll progress rule | **Kept.** It is an instrument reporting position, not an animation. Updates without smoothing. |
| Course counter | **Kept**, swapping instantly rather than laying |
| Section reveals (LAY) | Collapse to `opacity 0→1`, **200ms**, no mask, no translate, no stagger |
| Image reveals | Same: 200ms opacity, no counter-scale |
| Parallax / all CARRY | **Disabled.** Elements sit at their neutral mid-position, never at an extreme. |
| Services elevation | Pin removed; the wall renders **fully drawn**; active state still tracks scroll and still highlights |
| Menu | Crossfades, 160ms. No course sweep. |
| Hero | No timeline. Video shows its **graded poster with a visible play control**; does not autoplay. |
| Scroll indicator loop | Removed; the static apex + stack remains |
| Spec strip (§8.6) | Static, showing its start position |
| Magnetic buttons | Disabled |
| Cursor follower | Disabled entirely |
| Button / link / field states | **All kept**, at `--dur-instant` or instant. Feedback is not decoration. |
| Focus rings | **Always kept, never reduced.** |
| Footer monument | Renders final instantly |

### 17.2 The distinction that governs it

**Feedback survives. Choreography does not.**

A hover color change, a focus ring, a pressed state, an error appearing, a progress rule advancing — these tell the user what happened, and removing them makes the interface *less* accessible, not more. Reveals, parallax, staggers, covers and sequences are authorship; they are the first thing to go.

Every state change under reduced motion still completes in ≤120ms; several become instant. Nothing becomes ambiguous.

### 17.3 Implementation

Two mechanisms, both required:

1. **Token overrides** (already in the design system's `@media (prefers-reduced-motion: reduce)` block): all durations collapse, `--stagger-*: 0`, `--parallax-max: 0`, `--magnet-max: 0`. This alone neutralises every CSS animation in the system without touching a single rule.
2. **`gsap.matchMedia("(prefers-reduced-motion: reduce)")`** branch that never creates the scrubbed triggers, the pin, or the timelines — and sets all LAY targets to their final values on init.

The token override is what makes rule 1 cheap: because every CSS animation reads `var(--dur-*)`, reduced motion is one block, not a hundred overrides.

**Test with the OS setting, in a real browser, on every page.** DevTools emulation misses `matchMedia` listener behavior on change.

---

## 18. When NOT to animate

The most important section in this document. Every rule here removes work.

### 18.1 Never animate

1. **Anything the visitor is reading.** Body copy never moves after it arrives. Never CARRY a paragraph, never stagger a sentence, never reveal a list of specs word by word.
2. **Anything the visitor needs *now*.** The phone number, the CTA, the address, the form. These are present at first paint, in final state. A visitor who came to call should never wait for a reveal to finish before they can see the number.
3. **Error messages and validation** beyond a 240ms arrival. Never a shake, never a pulse, never a color loop.
4. **Anything below the fold that is already scrolled past.** Entrances fire `once` at `top 82%`; an element already above the viewport on load renders final and never animates.
5. **Anything on the second visit within a session.** The hero timeline runs on first load only; client-side navigation back to Home renders it complete. `sessionStorage` flag.
6. **Anything offscreen or in a hidden tab.** Every loop stops on `visibilitychange` and on leaving the viewport.
7. **Anything that would be the second primary motion in a viewport** (§2.1).
8. **Numbers counting up.** No stat counters. There are no statistics on this site, and if there were, a number ticking up is a decorative pattern that makes a fact look like a slot machine.
9. **Logos, marks, or the apex, on hover.** Brand geometry is fixed. It draws once in the footer and is otherwise still.
10. **Anything in response to no user action**, other than the hero timeline, the footer monument, and the scroll cue's terminating loop. That is the complete list of unprompted motion on this site — three items.

### 18.2 Delete an animation if any of these is true

- Removing it loses nothing but the animation itself.
- It repeats an idea already stated elsewhere on the page.
- It exists because the section "looked static."
- It cannot be classified as DRAW, LAY, SET or CARRY.
- It needs a displacement not in §3.5.
- It requires a forbidden property (§15.2).
- It would make a keyboard or screen-reader path worse.
- You cannot state, in one sentence, what the visitor learns from it.

That last test is the one to apply first. It fails most animations, which is the point.

### 18.3 The counting rule

**Per page, count the primary motions** (DRAW/LAY/CARRY above 240ms). Home has eight courses and therefore eight section entrances plus the hero and the footer: **10 primary sequences across 8.4 viewport heights**, roughly one per 100vh. That density is the target for every page.

If a page has more than one primary sequence per viewport height, it is over-animated regardless of how good each one is.

---

## 19. Amendments and new tokens

### 19.1 Amendments to the visual design system

| # | Section | Amendment |
|---|---|---|
| A1 | §6.7 | `stroke-dashoffset` is added to the permitted animated properties, **for SVG stroke geometry only** (Services elevation, §12.2). Not permitted on filled shapes; not permitted elsewhere. |
| A2 | §7.9 | The expanded cursor follower is a **96px square**, not a disc — `border-radius: 0` is absolute (§4.1) and the original wording contradicted it. |
| A3 | §6.4 | The vertical nav list in the menu overlay is a sanctioned exception to position-derived mask direction: all five items open **from the left**. |
| A4 | §6.5 | The hero timeline gains a video-plate beat at 340ms (LAY upward, 1000ms) between the headline and the image panels. |
| A5 | §6.6 | The single sanctioned pin is confirmed as the Services elevation, and is **removed below 1024px** in favor of the distributed elevation (§12.4). |

### 19.2 New tokens

```css
:root {
  /* Motion grammar */
  --beat:              80ms;   /* the choreographic offset unit (bond offset in time) */
  --dur-exit-factor:   0.6;    /* exit = entrance x this, floor 120ms */
  --scrub:             0.6;    /* the only permitted scrub value */
  --trigger-start:     82%;    /* the sitewide trigger line */
  --trigger-start-tall: 92%;   /* elements > 90vh */

  /* Displacement (§3.5) — the exhaustive set */
  --move-settle:       0.35em; /* text inside a LAY */
  --move-meta:         4px;    /* metadata rise */
  --move-shift:        12px;   /* ledger row / nav item */
  --move-icon:         8px;    /* button chevron */
  --move-label:        4px;    /* button label */
  --scale-hover:       1.04;   /* image inside a fixed mask */
  --scale-enter:       1.06;   /* image counter-scale */

  /* Mask geometry — negative top inset protects descenders (§8.1) */
  --mask-hidden-b:  inset(-0.15em 0 100% 0);
  --mask-hidden-t:  inset(100% 0 -0.15em 0);
  --mask-hidden-l:  inset(-0.15em 100% -0.15em 0);
  --mask-hidden-r:  inset(-0.15em 0 -0.15em 100%);
  --mask-open:      inset(-0.15em 0 -0.15em 0);
}

@media (max-width: 1023px) {
  :root {
    --dur-reveal: 520ms;
    --dur-major:  600ms;
    --stagger-sm: 30ms;
    --stagger-lg: 30ms;
    --stagger-max: 240ms;
    --parallax-max: 0;
    --magnet-max: 0px;
  }
}
```

### 19.3 The four reusable primitives

The entire system ships as four functions and four CSS classes. Nothing else.

| Primitive | Type | Used by |
|---|---|---|
| `revealCourse(section)` | GSAP | Every section header on every page (§5.6) |
| `layIn(el, dir)` | GSAP | Every text and image reveal (§8.2, §9.1) |
| `carry(el, pct)` | ScrollTrigger | Every parallax and large-type drift (§8.7, §9.3) |
| `magnet(el)` | GSAP `quickTo` | Primary buttons (§10.2) |
| `.u-draw` | CSS | Every rule, underline, sweep and fill (§10.3, §11.1, §13.1) |
| `.u-lay` | CSS | Every CSS-driven mask reveal (menu, form messages) |
| `.u-set` | CSS | Every hover/focus/press state |
| `.u-dim` | CSS | Sibling dimming, everywhere (§6.5, §11.1, §12.3) |

**If a new animation cannot be built from these, it is a system amendment, not a feature.**

---

## 20. Review checklist

Run against every page before it ships. Every item is a pass/fail, not a judgment.

**Grammar**
- [ ] Every animation is classifiable as DRAW, LAY, SET or CARRY
- [ ] No element runs two verbs simultaneously
- [ ] Every composite runs DRAW → LAY → SET in that order
- [ ] No entrance uses `translateY(>0.35em)` + fade
- [ ] No masked text also animates `opacity`

**Orchestration**
- [ ] One primary motion per viewport, counted section by section
- [ ] All entrance triggers are `once: true`
- [ ] All triggers start at `top 82%` (or 92% for tall elements)
- [ ] Fast scrolling never leaves a half-revealed element
- [ ] Primary sequences ≤ 1 per 100vh

**Timing**
- [ ] No curve overshoots; no springs; every Framer transition declares explicit easing
- [ ] Every scrub uses `ease: none`
- [ ] Nothing time-based exceeds 1000ms
- [ ] Every exit is 0.6× its entrance
- [ ] Stagger is clamped by formula, direction `from: "start"`

**Libraries**
- [ ] No element animated by two libraries
- [ ] Framer Motion imported in exactly four files, via `LazyMotion` + `m.*`
- [ ] GSAP loads core + ScrollTrigger only
- [ ] One `pointermove` listener; one animation ticker

**Performance**
- [ ] Only `transform`, `opacity`, `clip-path` (+ SVG `stroke-dashoffset`)
- [ ] `will-change` applied only during animation, ≤6 elements at once
- [ ] ≤2 scrubbed triggers, ≤1 pin, ≤24 triggers per page
- [ ] CLS = 0; every image box reserved
- [ ] ≥55fps sustained scroll on a mid-tier Android
- [ ] Motion JS ≤ 62KB gz

**Adaptation**
- [ ] No parallax, no pin, no hover effects below 1024px
- [ ] Durations shortened, not just staggers, on mobile
- [ ] Every `:hover` is inside `@media (hover: hover) and (pointer: fine)`
- [ ] Nothing animates on scroll-direction change

**Accessibility**
- [ ] Final frames identical with and without `prefers-reduced-motion`
- [ ] Feedback states survive reduced motion; choreography does not
- [ ] Focus rings never reduced, never delayed
- [ ] Split text preserves `aria-label`; fragments are `aria-hidden`
- [ ] Menu: focus trap, `Escape`, focus return, `aria-expanded`
- [ ] Page renders complete and navigable with JS disabled

**The final test**
- [ ] For every animation on the page, one sentence stating what the visitor learns from it. Any animation without one is deleted before ship.
