# BRIX — Visual Design System

**Version** 1.0 · **Status** Specification, pre-implementation · **Scope** Brand-level visual system for the BRIX Masonry & Concrete website

---

## 0. How to use this document

This is the rulebook. It is deliberately prescriptive: every value here is a decision already made, so implementation becomes execution rather than re-litigation.

Three reading modes:

- **Designing a new screen** → §1–§5 (typography, color, grid, shape, image)
- **Building a component** → §7–§9 (interaction, tokens, component rules)
- **Reviewing work** → §10 (anti-patterns) and §11 (smell test)

**When two rules conflict**, resolve in this order:

1. Accessibility (§2.4 contrast, §6.8 reduced motion) — never overridden
2. Performance budget (§6.7)
3. The grid (§3)
4. The shape language (§4)
5. Aesthetic preference

If a design requires breaking a rule, break it **once per page** and make it obviously deliberate. A rule broken twice is not an exception — it is a new rule. Update this document.

---

## 1. Typography

### 1.1 The pairing

Three families. All variable, all OFL-licensed, all self-hosted via `next/font`. Total webfont payload target: **< 95 KB** subset to `latin`.

| Role | Family | Axes used | Why this one |
|---|---|---|---|
| **Display** | **Archivo** (Variable) | `wght` 100–900, `wdth` 62–125 | A grotesque with engineered, flat-terminal letterforms that echo the logo's slab geometry. **The width axis is the reason**: one family delivers condensed hero type *and* expanded micro-labels, so hierarchy comes from width rather than from a second typeface. Not Anton or Bebas Neue — every contractor site already uses those. |
| **Body / UI** | **Geist Sans** (Variable) | `wght` 300–700 | Neutral, modern, engineered for screen at small sizes. It recedes so Archivo can speak. More current than Inter without being mannered. |
| **Technical** | **Geist Mono** (Variable) | `wght` 400–500 | The annotation voice — the numbers and notes on an architect's drawing. Carries all metadata, indices, labels, spec lines. |

**The three voices, plainly:** Archivo *declares*. Geist Sans *explains*. Geist Mono *records*.

Never introduce a fourth family. Never set Archivo below 20px. Never set Geist Mono above 14px, except large index numerals (§1.5).

### 1.2 Scale

Fluid, `clamp()`-based. The gap between `h1` and `display-3` is intentional and must be preserved — it produces the editorial two-register effect of quiet content punctuated by loud statements. **Nothing is designed to sit in that gap.**

| Token | Value | Family / setting | Use |
|---|---|---|---|
| `display-1` | `clamp(3.5rem, 13vw, 15rem)` | Archivo · wdth 68 · wght 800 | Hero headline. One instance per site. |
| `display-2` | `clamp(2.75rem, 8vw, 8rem)` | Archivo · wdth 72 · wght 800 | Page titles, footer monument, CTA statements |
| `display-3` | `clamp(2.25rem, 5.5vw, 5rem)` | Archivo · wdth 85 · wght 700 | Section statements, pull-quotes |
| `h1` | `clamp(2rem, 4vw, 3.5rem)` | Archivo · wdth 100 · wght 700 | Sub-page section headers |
| `h2` | `clamp(1.625rem, 3vw, 2.5rem)` | Archivo · wdth 100 · wght 600 | Sub-headers, service names |
| `h3` | `clamp(1.25rem, 2vw, 1.75rem)` | Geist Sans · wght 600 | Card titles, form section heads |
| `body-lg` | `clamp(1.0625rem, 1.2vw, 1.25rem)` | Geist Sans · wght 400 | Lead paragraphs, statement copy |
| `body` | `1rem` | Geist Sans · wght 400 | Default |
| `body-sm` | `0.875rem` | Geist Sans · wght 400 | Captions, helper text |
| `label` | `0.6875rem` (11px) | Geist Mono · wght 500 | Eyebrows, categories, metadata |
| `button` | `0.8125rem` (13px) | Geist Sans · wght 600 | All button labels |

### 1.3 Tracking and leading

**The single most important typographic rule here: tracking is inversely proportional to size.** This is what separates premium setting from amateur. Large type at default tracking reads loose and cheap; small caps set tight read muddy.

| Token | Tracking | Leading |
|---|---|---|
| `display-1` | `-0.045em` | `0.86` |
| `display-2` | `-0.035em` | `0.88` |
| `display-3` | `-0.025em` | `0.92` |
| `h1` / `h2` | `-0.015em` | `1.05` |
| `h3` | `-0.01em` | `1.2` |
| `body-lg` | `-0.005em` | `1.55` |
| `body` | `0` | `1.62` |
| `body-sm` | `+0.005em` | `1.5` |
| `label` | `+0.12em` | `1.3` |
| `button` | `+0.08em` | `1` |

**Measure:** body copy never exceeds **68 characters**; lead paragraphs never exceed **58**. Enforce with `max-width` in `ch` units, not with column spans.

### 1.4 Casing

- **UPPERCASE**: `display-1`, `display-2`, every `label`, every `button`, nav items, category tags.
- **Sentence case**: all body copy, `h3`, helper text, captions.
- `display-3`, `h1`, `h2` may be either — decide **per page**, then hold it for that whole page. Never mix within one page.
- Never uppercase a sentence longer than five words. Never uppercase body copy.

### 1.5 Project metadata

Metadata is a *system*, not decoration. Every project reference anywhere on the site carries the same three-part stamp:

```
001                          index  →  Archivo · wdth 62 · wght 800 · display-2 scale
                                       #ABABAB at rest, #D90D0F when active
BRICK MAILBOX & PLANTER      label  →  Archivo · wdth 100 · wght 700 · h2
RUNNING BOND / ARCH DETAIL   spec   →  Geist Mono · label · #ABABAB
```

**Large index numerals are display type** (Archivo condensed), never mono. **Small spec lines are mono.** The spec line names the *bond pattern and the detail* — this is the line that converts a phone snapshot into documentation and demonstrates craft knowledge. It is mandatory on every image.

### 1.6 Optical corrections

- `display-*` headings sit **optically** flush-left: apply `margin-left: -0.045em` to compensate for Archivo's cap sidebearing. Mathematically flush-left large type reads as indented.
- Hanging punctuation on pull-quotes.
- `font-variant-numeric: tabular-nums` on all metadata, indices, and phone numbers so digits do not jitter during animation.
- `font-variant-ligatures: none` on `label` (mono at wide tracking).

---

## 2. Color

### 2.1 The proportion

Five brand colors. Their power comes entirely from **discipline of ratio**. This is a black site with a red instrument — not a red site.

| Color | Hex | Share of pixel area | Role |
|---|---|---|---|
| Black | `#000000` | **~72%** | The environment. Page ground, overlays, footer, negative space. |
| Off-white | `#F3F3F3` | **~18%** | Primary type, rules, image highlights, inverted panels |
| Concrete gray | `#ABABAB` | **~6%** | Secondary copy, metadata, inactive states |
| Bright red | `#D90D0F` | **~3%** | Live state: hover, active, focus, animated strokes, `+` marks |
| Deep red | `#BA0507` | **~1%** | Committed mass: button fills, solid panels, pressed states |

**If red exceeds ~5% of any viewport, the composition is wrong.** Red is a highlighter, not a paint.

### 2.2 The two reds — the governing distinction

This is the rule that removes all guesswork:

> **`#D90D0F` bright red is LIGHT. `#BA0507` deep red is MASS.**
>
> Bright red is a **line** — 1px rules, underlines, focus rings, borders, the `+` mark, scroll progress, active indicators, anything animating or reacting.
>
> Deep red is a **plane** — filled buttons, solid panels, any area larger than ~4px in both dimensions.

Corollary: **a filled shape is never bright red at rest.** Bright red fills appear only as a *hover destination* — the button lightens from deep to bright, energy arriving — never as a resting state.

### 2.3 Derived neutrals

These are **tints of black, not new hues.** No new colors are introduced anywhere in the system.

| Token | Hex | Contrast on `#000` | Use |
|---|---|---|---|
| `ink-000` | `#000000` | — | Page ground |
| `ink-050` | `#070707` | — | Barely-perceptible band separation |
| `ink-100` | `#0D0D0D` | — | Elevated surface, ledger-row hover fill |
| `ink-200` | `#141414` | — | Input wells, insets |
| `ink-300` | `#1F1F1F` | — | Raised hover surface |
| `ink-400` | `#2A2A2A` | 1.46:1 | **Mortar joint** — whisper hairline, default panel separation |
| `ink-500` | `#3D3D3D` | 1.93:1 | Structural hairline — visible borders, form rules, frames |
| `ink-600` | `#5C5C5C` | 3.3:1 | Disabled text, dimmed non-hovered rows (**decorative/disabled only**) |
| `red-900` | `#8F0405` | — | Pressed state on primary button (deep red at 78% over black) |

### 2.4 Contrast rules — non-negotiable

Measured, not estimated:

| Pair | Ratio | Verdict |
|---|---|---|
| `#F3F3F3` on `#000000` | **18.8 : 1** | ✅ Any size. Primary type. |
| `#ABABAB` on `#000000` | **9.1 : 1** | ✅ Any size. Secondary type. |
| `#D90D0F` on `#000000` | **4.0 : 1** | ⚠️ **Large text only** (≥24px, or ≥19px at wght 700). Passes 3:1 for non-text UI. |
| `#F3F3F3` on `#BA0507` | **6.2 : 1** | ✅ Any size. **This is the primary CTA.** |
| `#F3F3F3` on `#D90D0F` | **4.7 : 1** | ✅ Normal text. Button hover state. |
| `#ABABAB` on `#0D0D0D` | **8.4 : 1** | ✅ Metadata on elevated surfaces |
| `#5C5C5C` on `#000000` | 3.3 : 1 | ❌ **Never** for readable content. Disabled / dimmed only. |

**Hard prohibitions:**

- Bright red is **never** used for body copy, form labels, error message text, captions, or any type below 24px.
- Error states are signalled by **rule color + apex glyph + `#F3F3F3` message text** — never by red text alone. Color is never the sole carrier of meaning.
- Never place `#BA0507` directly adjacent to `#D90D0F`; they are close enough to read as a rendering fault.

### 2.5 Focus ring

| Element background | Ring color | Spec |
|---|---|---|
| Black / dark surface | `#D90D0F` | 2px solid, 2px offset |
| Red-filled (button) | `#F3F3F3` | 2px solid, 2px offset |

Focus is **always visible** under keyboard navigation. Use `:focus-visible` only, and never `outline: none` without an immediate replacement in the same rule.

### 2.6 Color on photography

- **Never** overlay red on a photograph at any opacity. Red over brick produces mud and destroys the material color the customer is shopping for.
- Scrims are **pure black gradients only**: `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%)`.
- Red touches an image only as an **adjacent line** or a small `+` at a corner — at the image's edge or outside its bounds, never across it.
- Where sky survives a crop, apply a top-down black scrim to ~40% so blue never sits at full saturation beside red.

---

## 3. Grid, margins and space

### 3.1 Base unit

`--u: 4px`. Every spatial value in the system is a multiple of 4. The working rhythm is 8.

```
 4   8   12   16   20   24   32   40   48   64   80   96   128   160   192   224
```

### 3.2 Column grid

| Breakpoint | Range | Columns | Margin | Gutter |
|---|---|---|---|---|
| `xs` | 360–599 | **4** | 20px | 12px |
| `sm` | 600–767 | **6** | 28px | 16px |
| `md` | 768–1023 | **8** | 40px | 20px |
| `lg` | 1024–1279 | **12** | 56px | 24px |
| `xl` | 1280–1439 | **12** | 64px | 24px |
| `2xl` | 1440–1919 | **12** | 80px | 24px |
| `3xl` | ≥1920 | **12** | 96px | 24px |

**Max content width: 1440px.** Above 1920px the content block centers and the margins grow — the layout never stretches to fill an ultrawide monitor. At 360px: 20 + 20 margins leave 320px; 4 columns × 71px + 3 gutters × 12px = 320. Exact.

### 3.3 The breakout grid

One CSS grid provides both contained and full-bleed placement, so no section needs to escape its parent with negative margins:

```css
.page-grid {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--margin), 1fr)
    [content-start] repeat(12, minmax(0, calc(1440px / 12)))
    [content-end] minmax(var(--margin), 1fr)
    [full-end];
}
```

Children opt into `grid-column: content` or `grid-column: full`. Nothing else.

### 3.4 The running-bond offset

The signature spatial move. Adjacent content "courses" are offset by half a column, exactly as brick courses are offset by half a brick.

```css
--bond-offset: calc((100% + var(--gutter)) / 24);  /* half of one 12-col track */
```

- **Desktop / tablet**: alternating courses shift by `--bond-offset`. Applies to hero panel rows, statement blocks, selected-work previews, and process steps.
- **Mobile (`xs`/`sm`)**: bond offset is **0**. Stacking legibility beats stagger. The single exception is the hero headline, which keeps a fixed 12px line offset because that is the brand signature.

### 3.5 The mortar joint

Panels in a group **never** touch at zero and never separate by more than 16px. This is the tactile signature of the system.

| Token | Value | Use |
|---|---|---|
| `joint-hair` | `1px` | Default separation between adjacent panels, drawn in `ink-400` |
| `joint-sm` | `8px` | Tight panel groups |
| `joint-md` | `16px` | Standard panel groups, hero image courses |

### 3.6 Section spacing

```
--space-section-sm: clamp(64px,  8vw,  96px)
--space-section:    clamp(96px, 12vw, 160px)
--space-section-lg: clamp(128px, 16vw, 224px)
```

**Rule:** full-bleed image sections get **zero** vertical padding — they butt directly against their neighbours, because that is what stacking courses do. Text sections get `--space-section`. Only the hero and the footer get `--space-section-lg`.

---

## 4. Shape language

### 4.1 The absolute

**`border-radius: 0` everywhere. No exceptions, no components, no states.** Set it globally in the reset and never override. A single rounded corner anywhere on this site breaks the entire premise.

### 4.2 The eight devices

Named so they can be built as real components and referenced in review.

| # | Device | Description | Where |
|---|---|---|---|
| **D1** | **The Course** | A horizontal band of unequal-width panels, offset from the band above by `--bond-offset` | Hero, selected work, statement sections |
| **D2** | **The Joint** | The hairline gap between adjacent panels. Always present. | Everywhere panels meet |
| **D3** | **The Rule** | 1px `#D90D0F` line, drawn `scaleX(0→1)` from `transform-origin: left` | Section starts, active states, dividers |
| **D4** | **The Apex** | The logo chevron as pure geometry: two 2px strokes meeting at a point | Scroll cue, button arrows, list markers, footer monument |
| **D5** | **The Cross** | 1px red `+`, 12×12px, at grid intersections and panel corners | Registration marks. **Max 4 per viewport.** |
| **D6** | **The Frame** | 1px `ink-500` outline offset **12px outside** an image, drawn on scroll | Work index plates. Architectural dimension-line convention. |
| **D7** | **The Bracket** | L-shaped 1px marks at two opposite corners only — never a closed frame | Form fields, ledger rows on hover |
| **D8** | **The Stack** | 3–5 short horizontal bars of decreasing width | Scroll cue, list markers, menu trigger |

### 4.3 Angle

**The only non-90° angle in the system is the brand rake, derived from the logo's roofline: `--angle-apex: 18deg`.**

- Large-scale diagonals (footer monument, section clip transitions) use exactly 18°.
- Small chevron icons (≤24px) render at **30°** — a deliberate optical correction, because 18° is illegible at icon scale. This is the only sanctioned deviation.
- Every other edge in the system is horizontal or vertical. No arbitrary diagonals, no rotated cards, no skewed sections.

### 4.4 Asymmetry rules

Asymmetry here is *systematic*, never arbitrary — that distinction is the whole difference between architectural and messy.

1. **Never center a section's content**, except a single CTA moment. Maximum **two** centered moments per page.
2. **Headings sit at column 1. Supporting copy sits at columns 7–11.** The gap between them is the composition, and it is doing work.
3. **Images alternate their leading edge**: odd-numbered sections bleed left, even-numbered sections bleed right.
4. **Exactly one element per section may break the container.** One. That single break is what makes it read as deliberate; two make it read as broken.

### 4.5 Depth

**No shadows. Ever.** `box-shadow` and `filter: drop-shadow` do not appear in this codebase.

Depth is produced by exactly three means:

1. **Surface tint steps** — `ink-000` → `ink-100` → `ink-200`
2. **Overlap** — panels crossing panels, type crossing images
3. **The hairline joint** — `ink-400` / `ink-500` edges

If a developer reaches for `box-shadow`, the layout has failed and needs one of the three above instead.

### 4.6 Gradients

Permitted, exhaustively:

- Pure black scrims on images: `linear-gradient(to top, #000, transparent 60%)`
- One optional black radial vignette on the video band

**No color gradients anywhere. No red-to-anything. No two-stop brand-color blends.** A gradient between `#BA0507` and `#D90D0F` is specifically forbidden.

---

## 5. Image language

### 5.1 The premise

These are real project photographs taken on phones on job sites — not commissioned architectural photography. **The correct response is not to disguise that. It is to reframe it.**

> Treat them the way an architectural monograph treats *documentation* photography: cropped precisely, indexed, captioned with technical specificity, and presented as record rather than advertisement.

Honesty is the premium signal here. Every visitor can spot stock photography on a contractor site, and it reads as concealment. Real work, presented with authority, reads as confidence. **The captions carry the credibility that the image resolution cannot.**

### 5.2 What we do

**Crop hard, to the work.** Every image gets a defined focal crop that maximizes masonry and minimizes sky, lawn and driveway. Portrait sources become tall panels (2:3, 3:4). Landscape sources become bands (16:9, 3:2). **A portrait photo is never forced into a wide box** — it gets a narrow panel and the layout adapts.

**One unified grade, applied at build time** to the source files (not via runtime CSS filters — consistency and performance both demand it):

| Adjustment | Value | Purpose |
|---|---|---|
| Black point | Pulled to near-zero | Shadows melt into the page ground; images lose their rectangle |
| Contrast | +8–12% | Recovers the flatness of phone HDR processing |
| Green/blue saturation | **−35 to −45%** | Kills lawn and sky fighting the palette |
| Red/orange saturation | Hold at ~95% | **Brick stays brick.** Non-negotiable. |
| Midtone temperature | +3 toward orange | Unifies photos shot at different times of day |
| **Grain** | **2–4%** at 100% | **The key move.** Grain reframes phone-sensor noise as a deliberate film treatment and unifies all eleven images into one body of work. |

**Captions are mandatory**, set in Geist Mono, following §1.5. The spec line naming bond pattern and detail is what turns a snapshot into documentation.

**The watermark** on images 09–11 is cropped out at source.

### 5.3 What we never do

Fake bokeh · HDR tone-mapping · drop shadows · rounded corners · color overlays · duotone · fake before/after sliders · stock photography of hard hats, blueprints, or handshakes · any composite or generated imagery presented as project work.

### 5.4 The eight treatments

| # | Treatment | Ratio | Where |
|---|---|---|---|
| **T1** | **Course Panel** — tall hard-edged panel within a bond arrangement | 2:3 / 3:4 | Hero |
| **T2** | **Full Bleed** — edge to edge, no padding, type overlaid bottom-left | 16:9 | Featured project |
| **T3** | **Framed Plate** — image inset with D6 offset frame, caption below | 4:5 | Work index |
| **T4** | **Split Bond** — image cols 1–6, text cols 8–12, bond offset applied | 3:4 | Services |
| **T5** | **Detail Crop** — extreme crop (≥2× into a texture region), used small | 1:1 | About, texture moments |
| **T6** | **Overlap Pair** — two panels, one overlapping the other by 1 column + joint | mixed | Statement sections |
| **T7** | **Cursor Preview** — small panel following the cursor | 4:5 | Work index hover |
| **T8** | **Letterbox Band** — the video | 2.4:1 | "On Site" section |

### 5.5 Reveal

**Every image reveals by mask, never by fade.**

```
clip-path: inset(0 0 100% 0) → inset(0 0 0 0)     900ms, --ease-structural
inner <img> scale 1.06 → 1.0                       900ms, same ease
```

The counter-motion is the point: the mask opens one way while the image settles the other. That opposition is what produces the *structural* feel instead of the generic fade-up. Mask direction follows §6.3.

### 5.6 Distribution map

Eleven images across five pages. This map guarantees no image repeats **within a single viewport** and that each page's strongest asset leads.

| Image | Subject | Home | Work | Services | About | Contact |
|---|---|---|---|---|---|---|
| 01 | Stone column porch entry | Hero T1 | T3 | | | |
| 02 | Brick mailbox + planter | Selected work | T3 | | | |
| 03 | Arched mailbox, herringbone | Statement T5 | T3 | Custom T5 | Detail T5 | |
| 04 | Red brick mailbox column | Hero T1 | T3 | Brick T4 | | |
| 05 | Block fire pit / raised beds | | T3 | Block T4 | | |
| 06 | Stone pillar, address plaque | Selected work | T3 | | | Single, muted |
| 07 | Arched brick mailbox + rubble | | T3 | | **Jobsite honesty T2** | |
| 08 | Limewashed arched mailbox | Selected work | T3 | | | |
| 09 | Brick veneer elevation | **Hero T1** | T3 | Brick T4 | | |
| 10 | Covered porch, brick knee wall | Hero T1 | T3 | | T4 | |
| 11 | Covered patio, brick + slab | Featured T2 | T3 | Concrete T4 | | |
| — | **Video** | On Site T8 | | | | |

Image **07** — the arched mailbox with the rubble pile beside it — is deliberately given the About page's hero treatment. It is the most honest frame in the set, and on a page about craft it does more work than a clean shot would.

The **footer carries no imagery**. It is type and rule only.

---

## 6. Motion language

### 6.1 The governing principle

> **Structures do not bounce.**

Every motion decision follows from that. Motion here communicates *assembly* — things are laid, revealed, drawn, and set. Nothing floats, wobbles, springs, or overshoots.

### 6.2 Easing

| Token | Curve | Character | Use |
|---|---|---|---|
| `--ease-structural` | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast departure, long settle | **The signature.** All reveals, all masks. |
| `--ease-mechanical` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric in-out | State swaps, page transition covers |
| `--ease-set` | `cubic-bezier(0.33, 1, 0.68, 1)` | Gentle out | Small UI, hover fills |
| `--ease-lift` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard | Translate-only micro-motion |

**Hard rule: no easing curve in this system may overshoot its target.** All four are monotonic. No `back`, no `elastic`, no `bounce`, no spring configs with overshoot. This single constraint is what makes the motion read as structural rather than playful, and it is mechanically checkable in review.

### 6.3 Duration

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | `120ms` | Hover color, focus ring |
| `--dur-quick` | `240ms` | Button fill sweep, small state change |
| `--dur-base` | `420ms` | Menu items, card transitions, page-transition cover |
| `--dur-reveal` | `760ms` | Text and image reveals |
| `--dur-major` | `1000ms` | Hero entrance beats, full-bleed masks |

### 6.4 Entrance and reveal direction

**Everything enters from a mask, not from a distance.**

```
Text:   clip-path: inset(0 0 100% 0) → inset(0 0 0 0)
        + translateY(0.35em → 0)          760ms  --ease-structural
```

Never `translateY(60px)` + fade. That is the template look, and it is the single most common way this genre of site gives itself away.

**Reveal direction is never random. It is derived from position:**

| Element position | Mask origin |
|---|---|
| Left half of viewport | From the **left** |
| Right half of viewport | From the **right** |
| Full-width element | From the **bottom** (a wall rising) |
| Vertical stack | **Top to bottom**, staggered |
| Image | From the edge **nearest the margin it bleeds toward** |

One rule, applied everywhere, makes the entire site feel authored by one hand — and it is trivial to implement.

**Stagger:** 60ms for lists of ≤6 items, 40ms for >6. **Total stagger time never exceeds 480ms** regardless of item count.

### 6.5 The hero entrance

The one fully choreographed sequence on the site:

| t | Event | Duration |
|---|---|---|
| 0ms | Page ground already black — no white flash, ever | — |
| 0ms | Top rule draws left→right | 700ms |
| 120ms | Headline line 1 mask-reveals | 760ms |
| 200ms | Headline line 2 mask-reveals — *the 80ms delay mirrors the bond offset in space* | 760ms |
| 340ms | Image panels reveal, staggered 90ms, clipping from their outer edges | 900ms |
| 700ms | Sub-line and technical strip rise in | 420ms |
| 1000ms | Apex scroll cue fades in, begins a 2.4s idle loop | 420ms |

Visually complete at **~1.6s**. The LCP element — the headline — is painted by **~880ms**.

### 6.6 Scroll

**Lenis:** `lerp: 0.09`, `duration: 1.1`, `wheelMultiplier: 1`, `syncTouch: false` (native momentum is better on touch).

Do not slow this further. **A site that feels heavy to scroll is the defining failure of this genre** — smoothness must never become lag.

| Behavior | Limit |
|---|---|
| Parallax displacement | **Max 8% of element height.** More reads as gimmick. |
| Sticky sections | Max **2 per page**, max 200vh of scroll distance each |
| Scrubbed triggers | `scrub: 0.6`. Never more than **2 active simultaneously**. |
| Pinning | **Only** the Services capability stack. Nothing else pins. |
| Entrance triggers | `once: true` — entrances fire once and never replay |

### 6.7 The motion budget

**One primary motion per viewport.** If two elements would animate simultaneously within view, one demotes to static or hover-only. This is the rule that prevents animation from becoming noise, and it is countable in review.

Per-page ceilings:

| Metric | Limit |
|---|---|
| Scrubbed ScrollTriggers active at once | 2 |
| Pinned sections per page | 1 |
| Simultaneously animating elements in a viewport | 1 primary + unlimited T0 hover |
| Animated properties | `transform`, `opacity`, `clip-path` **only** |
| Forbidden to animate | `width`, `height`, `top`, `left`, `margin`, `filter`, `box-shadow`, `background-position` |

### 6.8 Page transitions

- **Out:** a black cover wipes up from the bottom in **3 offset courses**, staggered 60ms — 420ms total, `--ease-mechanical`
- Route commits behind the cover; scroll resets to 0 while covered
- **In:** courses wipe up and off the top — 420ms, staggered
- **Total ≤ 900ms.** If the route resolves faster, the cover holds a **260ms minimum** so it never flickers
- **Hard 1200ms failsafe** force-completes the transition if a route hangs. Browser back/forward is never blocked, and the page is never left covered.

### 6.9 Reduced motion

Under `prefers-reduced-motion: reduce`:

- All T1 reveals collapse to `opacity 0→1` at 200ms, or resolve instantly
- All T2 scrubbed motion, parallax and pinning are **disabled** — sections render in their final state
- Lenis is **not initialized**; native scroll is used
- The video does not autoplay; the poster frame shows with a visible play control
- The menu overlay crossfades rather than laying in courses
- Page transitions become a 160ms crossfade
- Magnetic buttons and the cursor follower are disabled entirely

This is a first-class rendering path, not a degraded one. Every page must be fully usable and visually complete with all motion removed.

---

## 7. Interactive language

### 7.1 The governing principle

> **Hover moves a line, not the element.**

Buttons and links do not scale, lift, or float. A red rule sweeps under them, or a red fill wipes in from an edge. **The structure stays put; the content and the light move.**

Two sanctioned exceptions, both consistent with the principle:

- **Magnetic buttons** translate a maximum of **6px** — the element leans, it does not leap
- **Image panels** scale their inner `<img>` to 1.04 inside a **fixed mask** — the frame is static, the content moves within it

### 7.2 Buttons

Three tiers. Only three. Height 56px desktop / 52px mobile, padding `0 32px`, radius 0.

| Tier | Rest | Hover | Active | Focus |
|---|---|---|---|---|
| **Primary** | `#BA0507` fill, `#F3F3F3` text | Fill wipes to `#D90D0F` **from the left** (240ms `--ease-set`); apex chevron slides in 8px from the right | `#8F0405`, `translateY(1px)` | 2px `#F3F3F3` ring, 2px offset |
| **Secondary** | Transparent, 1px `ink-500` border, `#F3F3F3` text | Border → `#D90D0F`; red fill wipes from left; text stays `#F3F3F3` | `#8F0405` fill | 2px `#D90D0F` ring, 2px offset |
| **Ghost / text link** | `#F3F3F3` text, 1px `ink-500` underline at 6px offset | Existing underline sweeps out right; red underline sweeps in from left (240ms) | Underline `#8F0405` | 2px `#D90D0F` ring |

**Magnetic behavior** applies to primary buttons only: 80px radius of influence, `lerp 0.15` toward cursor, 400ms ease-out on leave, max 6px displacement. Disabled on touch devices and under reduced motion.

### 7.3 Links and navigation

- Text remains `#F3F3F3`. A 1px red rule draws under it from the left, 240ms.
- **Current page**: rule permanently present in `#D90D0F`, plus a red `+` preceding the label.
- Inline links inside body copy: `ink-500` underline at rest, red on hover. Never colored red at rest — that would fail contrast at body size (§2.4).

### 7.4 The menu

- **Trigger** is a running-bond mark (D8): two short 2px bars over one offset long bar, `#F3F3F3`. On hover the courses **slide into alignment**. On open they rotate into the **X from the logo**.
- Adjacent label in Geist Mono 11px reads `MENU`, crossfading with a 4px rise to `CLOSE` on open (200ms).
- **Overlay lays in as five horizontal courses** sweeping from alternating sides, ~450ms, then the seams close. Reverses on close.
- Items are numbered at massive scale (`01 HOME` … `05 CONTACT`). Hovering one crossfades a project thumbnail into an adjacent panel and dims the rest to `ink-600`.
- **Usability is non-negotiable:** focus trap, `Escape` closes, focus returns to the trigger, `aria-expanded` and `aria-modal`, real `<nav>` and `<a>` elements, logical tab order, body scroll locked via `lenis.stop()`.

### 7.5 Images

Fixed mask; inner image scales 1.0 → 1.04 over 700ms `--ease-structural`. A red `+` fades in at the top-left corner. Over a clickable project image, the cursor follower expands to a labeled disc reading `VIEW`.

### 7.6 Project items — ledger rows, not cards

**There are no project cards on this site.** Projects are **ledger rows**: `[index] [title] [category] [apex]` on a hairline rule.

| State | Behavior |
|---|---|
| Rest | Title `#F3F3F3`, index and category `#ABABAB`, 1px `ink-400` bottom rule |
| Hover | Row background fills `ink-100` **from the left** (240ms); index turns `#D90D0F`; title shifts right 12px; cursor preview panel (T7) fades in |
| Siblings | Non-hovered rows dim to `ink-600` |
| Focus | 2px `#D90D0F` ring; the cursor preview does **not** fire on keyboard focus (it is pointer-only enhancement) |

This is the highest-value interaction on the site and it costs almost nothing to render.

### 7.7 Service sections

Sticky left index (`01`–`08`); active item `#F3F3F3` with a red rule, inactive `ink-600`. The right column scrolls. Clicking an index entry scroll-jumps via Lenis. **Active state is driven by ScrollTrigger, never by a raw scroll listener.**

### 7.8 Form inputs

**No boxes.** Each field is a baseline rule:

- Label above in Geist Mono 11px uppercase, prefixed with its field number (`01 NAME`, `02 EMAIL`) — the work-order convention
- Input transparent, **bottom rule only**, 1px `ink-500`, text `#F3F3F3` at 18px, 56px tall
- **Focus:** bottom rule animates to 2px `#D90D0F`, scaling from the left, 240ms; label brightens to `#F3F3F3`
- **Error:** rule turns `#D90D0F`; message below in `#F3F3F3` Geist Mono 11px preceded by a red apex glyph. **Never red text** — see §2.4
- **Project Type** is not a `<select>`. It is a row of hard-edged toggle chips (Brick / Block / Concrete / Custom / Repair / Other) implemented as a keyboard-navigable radio group; selected = `#BA0507` fill, `#F3F3F3` text
- **Submit states:** idle → sending (the button fill drains left-to-right as a progress rule) → sent (label becomes `REQUEST RECEIVED` with an apex mark; the button locks)

### 7.9 Cursor

**The native cursor is never hidden.** A 10px red-outlined square trails it at `lerp 0.18`, expanding to a 96px labeled disc only over project images and the menu trigger. Purely additive: if it fails to initialize, nothing breaks. Disabled entirely on touch and under reduced motion.

---

## 8. Design tokens

Ready to become CSS custom properties, and to map directly into a Tailwind v4 `@theme` block.

```css
:root {
  /* ─── Color: brand ─────────────────────────────── */
  --brix-black:      #000000;
  --brix-red-deep:   #BA0507;   /* MASS  — fills, planes */
  --brix-red:        #D90D0F;   /* LIGHT — lines, states */
  --brix-white:      #F3F3F3;
  --brix-gray:       #ABABAB;

  /* ─── Color: derived neutrals (tints of black) ─── */
  --ink-000: #000000;
  --ink-050: #070707;
  --ink-100: #0D0D0D;
  --ink-200: #141414;
  --ink-300: #1F1F1F;
  --ink-400: #2A2A2A;   /* mortar joint  */
  --ink-500: #3D3D3D;   /* structural hairline */
  --ink-600: #5C5C5C;   /* disabled only */
  --red-900: #8F0405;   /* pressed */

  /* ─── Color: semantic ──────────────────────────── */
  --bg-page:        var(--ink-000);
  --bg-elevated:    var(--ink-100);
  --bg-well:        var(--ink-200);
  --text-primary:   var(--brix-white);
  --text-secondary: var(--brix-gray);
  --text-disabled:  var(--ink-600);
  --border-hair:    var(--ink-400);
  --border-struct:  var(--ink-500);
  --accent-line:    var(--brix-red);
  --accent-fill:    var(--brix-red-deep);
  --focus-ring:     var(--brix-red);
  --focus-ring-on-red: var(--brix-white);

  /* ─── Typography: families ─────────────────────── */
  --font-display: "Archivo Variable", "Archivo", system-ui, sans-serif;
  --font-body:    "Geist Sans", system-ui, -apple-system, sans-serif;
  --font-mono:    "Geist Mono", ui-monospace, "SFMono-Regular", monospace;

  /* ─── Typography: size ─────────────────────────── */
  --fs-display-1: clamp(3.5rem, 13vw, 15rem);
  --fs-display-2: clamp(2.75rem, 8vw, 8rem);
  --fs-display-3: clamp(2.25rem, 5.5vw, 5rem);
  --fs-h1:        clamp(2rem, 4vw, 3.5rem);
  --fs-h2:        clamp(1.625rem, 3vw, 2.5rem);
  --fs-h3:        clamp(1.25rem, 2vw, 1.75rem);
  --fs-body-lg:   clamp(1.0625rem, 1.2vw, 1.25rem);
  --fs-body:      1rem;
  --fs-body-sm:   0.875rem;
  --fs-label:     0.6875rem;
  --fs-button:    0.8125rem;

  /* ─── Typography: axes / tracking / leading ────── */
  --wdth-condensed: 62;
  --wdth-narrow:    72;
  --wdth-mid:       85;
  --wdth-normal:    100;

  --tr-display-1: -0.045em;
  --tr-display-2: -0.035em;
  --tr-display-3: -0.025em;
  --tr-heading:   -0.015em;
  --tr-body:       0em;
  --tr-label:      0.12em;
  --tr-button:     0.08em;

  --lh-display: 0.86;
  --lh-heading: 1.05;
  --lh-body:    1.62;
  --lh-label:   1.3;

  --measure-body: 68ch;
  --measure-lead: 58ch;

  /* ─── Space ────────────────────────────────────── */
  --u: 4px;
  --space-1:  4px;   --space-2:  8px;   --space-3:  12px;
  --space-4:  16px;  --space-5:  20px;  --space-6:  24px;
  --space-8:  32px;  --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;  --space-24: 96px;
  --space-32: 128px; --space-40: 160px; --space-48: 192px;

  --space-section-sm: clamp(64px, 8vw, 96px);
  --space-section:    clamp(96px, 12vw, 160px);
  --space-section-lg: clamp(128px, 16vw, 224px);

  /* ─── Grid ─────────────────────────────────────── */
  --grid-max:   1440px;
  --margin:     20px;   /* overridden per breakpoint */
  --gutter:     12px;   /* overridden per breakpoint */
  --columns:    4;      /* overridden per breakpoint */
  --bond-offset: calc((100% + var(--gutter)) / 24);

  --joint-hair: 1px;
  --joint-sm:   8px;
  --joint-md:   16px;

  /* ─── Shape ────────────────────────────────────── */
  --radius:      0;
  --angle-apex:  18deg;
  --angle-icon:  30deg;
  --stroke-hair: 1px;
  --stroke-mark: 2px;
  --frame-offset: 12px;

  /* ─── Motion ───────────────────────────────────── */
  --ease-structural: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-mechanical: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-set:        cubic-bezier(0.33, 1, 0.68, 1);
  --ease-lift:       cubic-bezier(0.4, 0, 0.2, 1);

  --dur-instant: 120ms;
  --dur-quick:   240ms;
  --dur-base:    420ms;
  --dur-reveal:  760ms;
  --dur-major:   1000ms;

  --stagger-sm:  60ms;
  --stagger-lg:  40ms;
  --stagger-max: 480ms;

  --parallax-max: 0.08;
  --magnet-max:   6px;

  /* ─── Component sizing ─────────────────────────── */
  --control-h:    56px;
  --control-h-sm: 52px;
  --control-px:   32px;
  --tap-min:      44px;
}

@media (min-width: 600px)  { :root { --margin: 28px; --gutter: 16px; --columns: 6;  } }
@media (min-width: 768px)  { :root { --margin: 40px; --gutter: 20px; --columns: 8;  } }
@media (min-width: 1024px) { :root { --margin: 56px; --gutter: 24px; --columns: 12; } }
@media (min-width: 1280px) { :root { --margin: 64px; } }
@media (min-width: 1440px) { :root { --margin: 80px; } }
@media (min-width: 1920px) { :root { --margin: 96px; } }

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-instant: 0ms;  --dur-quick: 120ms; --dur-base: 160ms;
    --dur-reveal: 200ms; --dur-major: 200ms;
    --stagger-sm: 0ms;   --stagger-lg: 0ms;
    --parallax-max: 0;   --magnet-max: 0px;
  }
}
```

---

## 9. Component visual rules

### 9.1 Buttons

| Property | Value |
|---|---|
| Height | 56px desktop / 52px mobile · min tap target 44px |
| Padding | `0 32px` |
| Radius | **0** |
| Type | Geist Sans 600 · 13px · uppercase · `+0.08em` |
| Icon | Apex (D4), 12px, 8px gap, slides 8px on hover |
| Full width | Mobile only, and only for the primary form submit |
| Max per viewport | **1 primary.** Multiple primaries mean no primary. |

### 9.2 Labels

Geist Mono · 11px · wght 500 · uppercase · `+0.12em` · `#ABABAB`. Optionally prefixed with a red `+` (D5) or an index (`001`). Never bold, never colored red, never larger than 12px.

### 9.3 Surfaces (not cards)

The word "card" is avoided deliberately. Surfaces are **panels**.

- Background `ink-100`, border 1px `ink-400`, radius 0, **no shadow**
- Padding: `--space-8` (32px) desktop, `--space-6` (24px) mobile
- Hover (if interactive): background → `ink-300`, border → `#D90D0F`, 240ms
- Panels in a group are separated by a joint (§3.5) and offset by `--bond-offset` on alternating rows

### 9.4 Section headers

Fixed three-part structure, used identically on every page:

```
+ 03 / CAPABILITIES        ← eyebrow: mono label, red + prefix, red rule draws L→R above
BRICK LEADS                ← header:  Archivo, h1, uppercase, cols 1–6
Short supporting sentence  ← support: Geist Sans body-lg, #ABABAB, cols 8–12, max 58ch
```

The eyebrow rule (D3) draws on scroll entry. The header and support reveal by mask per §6.4.

### 9.5 Project items

Per §7.6 — ledger rows. Row height 96px desktop / 72px mobile. Bottom rule 1px `ink-400`. First row also carries a top rule. Index at `display-3` scale in Archivo condensed; title at `h2`; category and spec in mono.

### 9.6 Forms

Per §7.8 — baseline rules, numbered mono labels, no boxes, no radius. Field vertical rhythm: 40px between fields, 64px before the submit. Required fields marked with a red `+`, never an asterisk. Helper text sits below the label, above the input, in `#ABABAB` at `body-sm`.

### 9.7 Navigation

Per §7.4. Trigger is fixed top-right at `--margin` inset, 44×44px hit area minimum. Logo fixed top-left, height 28px desktop / 24px mobile. A 1px `ink-500` rule spans the full viewport width beneath both. Nothing else is fixed to the viewport — no sticky sub-navs, no floating call buttons on desktop.

**Mobile exception:** a single fixed bottom bar carrying `CALL` and `FREE ESTIMATE` may appear below 768px, 56px tall, `ink-100` background with a top rule. It is the one permitted departure, because phone-first customers converting on a contractor site justify it.

### 9.8 Footer — "The Foundation"

- `BRIX` set in Archivo condensed at viewport width (`display-2` scaling to fill), sitting **on** a 2px red rule — the foundation line
- The apex (D4) above it at large scale, echoing the logo lockup without reproducing it
- Above that, a single course: CTA · phone · email · minimal nav
- Bottom strip: mono legal line, `ink-600`
- **No imagery. No four-column grid. No social icon row** — the Instagram link is a text link with a `+`.

---

## 10. Anti-patterns — what must NOT be done

Explicit prohibitions. Each of these is a review-failing defect, not a matter of taste.

### Layout
1. ❌ Generic contractor layout: hero → 3 icon cards → "Why Choose Us" with checkmarks → testimonial slider → contact strip
2. ❌ Rounded corners **anywhere**, at any radius, on any element or state
3. ❌ A grid of equal-sized cards. Projects are ledger rows (§7.6)
4. ❌ Centered-everything sections. Max two centered moments per page (§4.4)
5. ❌ More than one container break per section
6. ❌ Sticky sub-navigation, floating chat widgets, or cookie bars that cover content
7. ❌ Full-viewport-height sections used by default. Height comes from content.

### Color
8. ❌ Any blue, orange, yellow, or safety-vest green. The construction-industry palette is exactly what we are escaping
9. ❌ Color gradients of any kind, especially `#BA0507` → `#D90D0F`
10. ❌ Bright red as body copy, form labels, error text, or any type under 24px (§2.4)
11. ❌ Red overlays or duotones on photographs (§2.6)
12. ❌ Red exceeding ~5% of any viewport
13. ❌ Introducing a sixth color, including "just a slightly different gray." Use the `ink-*` scale.

### Depth and effects
14. ❌ `box-shadow` or `drop-shadow`, at any opacity, on any element
15. ❌ Glassmorphism, backdrop blur, frosted panels
16. ❌ Neon glows, outer glows, text shadows
17. ❌ Noise or texture overlays as CSS layers — grain is baked into images only (§5.2)
18. ❌ Borders thicker than 2px

### Typography
19. ❌ A fourth typeface
20. ❌ Anton, Bebas Neue, Oswald, Montserrat, Poppins — the contractor-template canon
21. ❌ Display type at default tracking (§1.3)
22. ❌ Giant text used as decoration where it obscures content or forces horizontal scroll
23. ❌ Uppercase body copy or uppercase sentences over five words
24. ❌ Body measure exceeding 68 characters
25. ❌ Center-aligned paragraphs

### Motion
26. ❌ Any easing curve that overshoots — `back`, `elastic`, `bounce`, overshooting springs (§6.2)
27. ❌ `translateY(60px)` + fade as the default reveal. Use masks (§6.4)
28. ❌ Animating `width`, `height`, `top`, `left`, `margin`, `filter`, or `box-shadow`
29. ❌ More than 2 scrubbed ScrollTriggers active at once
30. ❌ More than 1 pinned section per page
31. ❌ Entrance animations that replay on scroll-back
32. ❌ Parallax exceeding 8% displacement
33. ❌ Scroll-jacking, or Lenis tuned so slow the page feels laggy
34. ❌ Page transitions over 900ms, or any transition that can leave the page covered
35. ❌ Hiding the native cursor
36. ❌ Animation that is not gated behind `prefers-reduced-motion`

### Imagery
37. ❌ Stock photography — hard hats, blueprints, handshakes, generic construction sites
38. ❌ AI-generated or composited imagery presented as project work
39. ❌ Forcing portrait photos into landscape crops
40. ❌ Fake bokeh, HDR, or heavy retouching that makes real work look synthetic
41. ❌ Publishing an image without its mono spec caption (§1.5)
42. ❌ All eleven images in a single gallery

### Content
43. ❌ Inventing years in business, project counts, certifications, licenses, awards, guarantees, service areas, or customer numbers
44. ❌ Invented project names, client names, locations, or dates
45. ❌ Fabricated testimonials or review scores
46. ❌ Walls of text. Headline → short statement → visual → supporting line → CTA

### Engineering
47. ❌ Three.js or any WebGL layer
48. ❌ A component library that ships its own visual opinions (Bootstrap, MUI, DaisyUI)
49. ❌ GSAP timelines without `gsap.context()` / `useGSAP` cleanup — guaranteed memory leaks
50. ❌ Framer Motion and GSAP animating the same element
51. ❌ Raw `scroll` event listeners. Use ScrollTrigger or IntersectionObserver
52. ❌ Loading the video anywhere near the critical path
53. ❌ `outline: none` without an immediate `:focus-visible` replacement
54. ❌ `<div onClick>` where a `<button>` or `<a>` belongs

---

## 11. The smell test

Run this on any screen before calling it done. A "no" on any line is a defect.

1. Could I remove every animation and would this still be a beautiful, complete page?
2. Is red under 5% of this viewport?
3. Is there exactly one primary button in view?
4. Does every image carry a mono spec caption?
5. Is there a single container break in this section — not zero, not two?
6. Is exactly one thing the primary motion here?
7. Would this look wrong on a competitor's site — i.e. is it specific to BRIX?
8. Can I tab through every interactive element and always see where I am?
9. Is there a single rounded corner or shadow anywhere? (There must not be.)
10. Does the mobile composition look *designed*, or does it look shrunk?

---

## 12. The BRIX visual design manifesto

> **We build in courses.**
> Content is laid, not placed. Every element sits on the one below it, offset by half, separated by a joint.
>
> **Black is the site. Red is the instrument.**
> Black is where everything happens. Bright red is light — a line, a state, a moment of attention. Deep red is mass — a fill, a commitment. Neither is ever decoration.
>
> **Nothing is round. Nothing casts a shadow.**
> Depth comes from overlap, surface, and the hairline joint. If it needs a shadow, the layout is wrong.
>
> **Structures do not bounce.**
> No curve overshoots. Nothing floats, springs, or wobbles. Motion communicates assembly: things are drawn, revealed, and set. Hover moves a line, not the element.
>
> **One motion per view.**
> If two things move at once, one of them is noise. Animation earns its place or it is deleted.
>
> **The work is real, so we show it as record.**
> These are phone photographs from job sites. We crop them hard, grade them as one body, and caption them with the bond pattern and the detail. Precision of description is what makes modest photographs read as expertise. We never dress real work up as stock.
>
> **Type has three voices.**
> Archivo declares. Geist Sans explains. Geist Mono records. Nothing sits between a heading and a statement — quiet content, loud statements, no mush in the middle.
>
> **We claim nothing we cannot prove.**
> No invented years, counts, certifications, or awards. The brickwork is the argument.
>
> **Every rule here exists to be usable at 360px, on a phone, in daylight, by someone who needs a mason.**
> If a decision makes the site more impressive but harder to use, the decision is wrong.

---

*End of specification v1.0. Changes to this document require a version bump and a note of what changed and why.*
