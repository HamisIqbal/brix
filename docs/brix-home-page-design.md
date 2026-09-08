# BRIX — Home Page Design Specification

**Version** 1.0 · **Status** Design specification, pre-implementation
**Governed by** `docs/brix-visual-design-system.md` v1.0 — every token, easing curve, contrast ratio and anti-pattern in that document applies here and is not restated. Where this document overrides or amends the system, it is marked **[AMENDMENT]** and listed in §12.

---

## 0. Before anything else — three facts that shaped this design

### 0.1 The hero video is portrait

The MP4 stores 1024×576 but its track header carries a rotation matrix of `[0, 1, -1, 0]` — a 90° rotation. **It displays as 576×1024, a 9:16 vertical phone clip.** 19.57s, H.264/AAC, 2.31 MB.

Content: a covered porch on a rural property — wood posts and rafters, dark brick veneer behind, a brick knee wall with a rowlock cap, a poured concrete slab, grass and open sky. Same property family as stills 10 and 11. Slight handheld motion.

This has consequences that are not negotiable:

- **A full-bleed 16:9 hero video is impossible.** Cropping 9:16 to 16:9 discards 68% of the frame and leaves a 576px-wide source stretched across a 1920px viewport — a 3.3× upscale. Every mortar joint turns to mush. The site's entire premise is crispness; that one decision would destroy it.
- Therefore **the video is a vertical plate, never a background.** It is a panel inside a composed hero, sized so it is never scaled beyond ~1.25× of its native 576px width.
- **On mobile this inverts and becomes an advantage.** A 9:16 source on a 9:19.5 phone is nearly native. Mobile gets the atmospheric video-ground hero that desktop cannot have. The composition genuinely changes between breakpoints rather than reflowing — which is exactly what this page needs.

The design system's treatment **T8 "Letterbox Band" (2.4:1)** for the video is invalid. See §12 for the replacement.

### 0.2 The photographs describe a specific business

Ten stills, read honestly:

| # | Orientation | Subject | Value |
|---|---|---|---|
| 01 | Portrait | Limestone/chopped-stone porch entry, columns, gable, black lanterns | Strongest architecture in the set. Introduces STONE. |
| 02 | Portrait | Brick outdoor fireplace + seat wall, gabled chimney, rowlock cap | Outdoor living. Tumbled brick. |
| 03 | Portrait | Gothic-arch brick mailbox, **herringbone infill panel**, planter | Highest craft-content frame in the set. |
| 04 | Portrait | Red brick mailbox column, running bond, white mortar | The reddest, most literally "brick" frame. |
| 05 | Landscape | Two CMU raised beds / fire pit on a lawn | Weakest. Block work. Belongs on Services. |
| 06 | Portrait | Stone + brick banded pillar, cast-stone cap, address plaque | Mixed-material craft. |
| 07 | Portrait | Buff arched mailbox with **rubble pile beside it** | The honest one. Reserved for About. |
| 08 | Portrait | Limewashed barrel-arch mailbox, active jobsite | Process. |
| 09 | Landscape | Full brick veneer elevation, corner, rowlock sills | Scale and scope. *Watermark top-left.* |
| 10 | Landscape | Covered porch, brick knee wall, wood posts, dusk | Best landscape frame. *Watermark top-left.* |
| 11 | Portrait | Covered patio, brick columns, wet slab, big sky | Most atmospheric. *Watermark top-left.* |

**Five of eleven are brick mailbox columns.** That is not a gap in the portfolio — it is the portfolio telling you what this business is known for. A brick mailbox is the most-looked-at piece of masonry in American residential life and the first thing anyone sees of a house. The site should not hide that behind aspirational language about "commercial masonry solutions." The copy in this specification leans into it.

**Every image needs the same build-time grade** (system §5.2) and images 09/10/11 need their **top-left watermark disc cropped out at source**. Crops in §8 are written to do that.

### 0.3 There are no verified business facts yet

No years in business, no project count, no license number, no city, no phone number, no client names, no dates. System anti-patterns §43–45 forbid inventing any of them.

Every such string in this document is written as **`[[CLIENT: …]]`**. There are 11 of them, collected in §11. **The page ships with those filled in or those elements are removed** — never guessed. The design is built so that removing them degrades gracefully; nothing in the composition depends on a number we do not have.

---

## 1. The page's job, in one paragraph

A homeowner has decided they want brick or concrete work done. They are looking at four contractors' websites, three of which are a hero, three icon cards, and a stock photo of a handshake. This page has about four seconds to establish that BRIX is a different order of operation — that the people who built this website are the people who will strike the joints on their mailbox — and then about ninety seconds to prove it with real work and real vocabulary, and hand them an estimate request that costs them almost nothing to start.

**Primary conversion:** free estimate request.
**Secondary conversion:** phone call (dominant on mobile).
**Tertiary:** deeper browse into `/work`.

---

## 2. The spine: the page is a wall

Everything on this page is organised by one idea, taken from the trade and from the design system's own manifesto — *we build in courses.*

A brick wall is laid one course at a time, each course offset half a brick from the one below, each separated by a mortar joint. **This page is laid the same way.** Sections are called courses. They are numbered `COURSE 01` … `COURSE 08` in the eyebrow. Adjacent courses alternate their bond offset. Sections never fade into each other — they butt against a hairline joint, exactly as courses do.

This matters for three reasons:

1. **The numbering is honest.** The frontend rule is that `01 / 02 / 03` markers are only legitimate when the content genuinely is a sequence. Here it is: a wall has numbered courses, and this page is literally assembled as one. The numbering encodes the structure rather than decorating it.
2. **It solves the "generic" problem structurally, not stylistically.** A generic page is a stack of unrelated blocks with a section heading each. A course is a *continuous* thing — one long line of the page runs from the hero's video edge down through the thesis image, and the red rule that leaves the last work row is the same red rule that starts the method section. The reader feels one object, not six.
3. **It gives every transition a rule.** §9 defines every hand-off. No section "just ends."

### 2.1 The signal ledger

The brief requires six things to be communicated immediately. None of them is communicated by writing the word down. Here is where each one actually lands:

| Signal | Where it lands | By what device |
|---|---|---|
| **BRIX** | Rail (logo, 0ms) → hero micro-lockup → footer monument at viewport width | The wordmark is never repeated as body text. It appears twice: small and structural at the top, enormous and terminal at the bottom. |
| **MASONRY** | Hero eyebrow, hero sub-line, Course 03 capability band | Named in the technical voice (Geist Mono), never in a marketing sentence. |
| **CRAFTSMANSHIP** | Headline word "TRADE" → every mono spec caption → Course 05 method vocabulary (*dry bond, striking, thumbprint-hard*) | Craft is proven by vocabulary a layperson cannot fake, not asserted with the word "craftsmanship." That word never appears on the page. |
| **BRICK** | The video (brick knee wall, first frame) → Course 04 featured → Course 06 material plate, at 2× magnification | Shown at three scales: environmental, architectural, tactile. |
| **STRENGTH** | Headline word "PERMANENT" → Course 02 thesis → the black-and-hairline visual weight of the whole page | The word "strong" never appears. Permanence is the more expensive claim and the more accurate one. |
| **MODERNITY** | Type system, the 0-radius/0-shadow discipline, the mask-based motion, the restraint of the red | Modernity is carried entirely by execution. Any attempt to *say* modern would undo it. |

---

## 3. The scroll map

Heights are approximate at 1440×900 desktop. `svh` used throughout so mobile browser chrome does not cause jumps.

```
 vh
  0 ┌──────────────────────────────────────────────────────────┐
    │ RAIL  logo ─────────────────────── menu       (fixed 88) │
    ├──────────────────────────────────────────┬───────────────┤
    │                                          │               │
  1 │  COURSE 01 · HERO — "THE FIRST COURSE"   │  VIDEO PLATE  │  100svh
    │  PERMANENT / BY TRADE                    │  9:16         │
    │  + CTA + technical strip                 │  112svh tall  │
  2 ├──────────────────────────────────────────┴──────┐        │  (plate
    │  COURSE 02 · THE ARGUMENT                       │◄───────┘   overhangs)
    │  [03 detail]   Paint fades. Framing moves…      │           ~95vh
  3 ├─────────────────────────────────────────────────┴──────────┤
    │  COURSE 03 · WHAT WE LAY — one band, six cells             │  ~22vh
    ├────────────────────────────────────────────────────────────┤
  4 │  COURSE 04 · SELECTED — featured full bleed [10]           │  ~88vh
    │                                                            │
  5 ├────────────────────────────────────────────────────────────┤
    │  ledger rows 002 · 003 · 004  (cursor previews 02/09/11)   │  ~62vh
  6 ├────────────────────────────────────────────────────────────┤
    │  COURSE 05 · METHOD — 4 steps, red string line     [11]    │ ~120vh
  7 │                                                            │
    ├────────────────────────────────────────────────────────────┤
  8 │  COURSE 06 · MATERIAL — brick [04] / stone [01] diptych    │  ~85vh
    ├────────────────────────────────────────────────────────────┤
  9 │  COURSE 07 · ESTIMATE — the footing                        │  ~90vh
    ├────────────────────────────────────────────────────────────┤
 10 │  COURSE 08 · THE FOUNDATION — footer monument              │  ~70vh
    └────────────────────────────────────────────────────────────┘
```

**Total ≈ 8.4 viewport heights desktop, ≈ 11 on mobile.** Long enough to be a considered document, short enough that a phone user reaches the estimate.

**Image budget on Home: 7 stills + 1 video.** Images 05, 06, 07, 08 do not appear on Home at all — they lead Services, Contact and About. No image appears twice on this page. See §8.

---

## 4. Type decisions held for this page

The system permits `display-3`, `h1` and `h2` to be either case, decided per page. **Decision for Home, held for the whole page:**

- `display-1` and `display-2` — **UPPERCASE**. These are names and declarations.
- `display-3`, `h1`, `h2` — **sentence case**. These are sentences and they should read as speech.

This produces the page's two registers: it *shouts nouns and speaks sentences*. Nothing sits in between, which is what the system's §1.2 gap is for.

**Hero headline override [AMENDMENT]:** `display-1` at its system maximum of 15rem (240px) makes the nine-character word `PERMANENT` measure ≈1120px at Archivo `wdth 68`, which will not fit the hero's type field. Hero H1 is therefore set at `clamp(3.25rem, 11vw, 10rem)` — 160px maximum, measuring ≈750px, inside a ~780px field at 1440 with 30px of air. **This must be measured in-browser at build time, not trusted from this document**; if Archivo's actual advance width differs, reduce the cap, never the field.

---

## 5. COURSE 00 — The Rail

Not a section. The persistent frame the courses are laid inside.

- **Composition:** logo left at 28px height (24px mobile), menu trigger right, 1px `ink-500` rule spanning the full viewport width at y=88px (72px mobile). Per system §9.7.
- **The rule is the page's datum line.** Every course's top edge is parallel to it. It never moves and never gains a background.
- **Behaviour on scroll:** the rail does not hide, shrink, blur or gain a backdrop. It is 88px of black with a hairline. On scroll past 60vh the logo's `+ CONCRETE` sub-line (if rendered) drops out; nothing else changes.
- **Mobile:** below 768px, a fixed bottom bar (56px, `ink-100`, top rule) carrying `CALL` and `FREE ESTIMATE` appears — **but not until the user has scrolled past the hero.** It slides up 56px over 240ms `--ease-set` when the hero's bottom edge leaves the viewport, and never retracts. This is deliberate: it preserves "one primary button per viewport" during the hero, then makes the phone number permanently reachable for the rest of the page.
- **Entrance:** logo and trigger mask-reveal at t=0; the datum rule draws left→right over 700ms, which is beat one of the hero timeline (§6.10).

---

## 6. COURSE 01 — HERO · "The First Course"

### 6.1 Purpose

Establish, before any scrolling, that this is a masonry company with a point of view and a camera on a real job site. Deliver PERMANENT (strength) and BY TRADE (craft) in the first fixation, brick in the second, and put one free-estimate button within reach without shouting.

This viewport does the majority of the work the brief asks of the first three. If it fails, nothing below rescues it.

### 6.2 Layout

Two fields divided by one vertical joint. **Not a grid split — a wall and a window.**

- **Type field:** `1fr`, starting at the left margin.
- **Video plate:** fixed width, anchored to the right viewport edge. **This is the hero's one permitted container break** (system §4.4.4), and it breaks right, which sets the alternation for the whole page (Course 02 breaks left, Course 04 breaks full, and so on).
- **The joint:** a 1px `ink-500` vertical line at the plate's left edge, running from the datum rule to the bottom of the video. It is the single most important line on the page — it is what makes the composition read as architecture instead of as two columns.

**Plate sizing rule (derived from the asset, not from taste):**

```
height : 112svh
width  : min(height × 0.5625, 720px)
top    : datum rule (88px)
right  : 0  (bleeds past the margin to the viewport edge)
object-fit: cover, position center
```

At 1440×900 → 1008 × 567px. The source is 576px wide: **a 0.98× scale — effectively pixel-native.** At 1920×1200 → 1344 × 720 (capped), a 1.25× upscale, the hard ceiling. Above that the type field grows and the plate does not. The plate is never allowed past 720px CSS width because beyond 1.25× the mortar joints in the knee wall go soft, and a masonry site whose mortar joints are soft has lost the argument.

The 112svh height means **the plate always overhangs the fold**, so the video is visibly a course that continues past the bottom of the screen rather than a box that ends at it.

### 6.3 Headline

```
PERMANENT
  BY TRADE
```

`display-1` override (§4), Archivo `wdth 68` `wght 800`, uppercase, tracking `-0.045em`, leading `0.86`, optically flush left (`margin-left: -0.045em`).

**Line 2 is offset right by `--bond-offset`** (half a column, ~54px at 1440). This is the brand signature and it is the one place the bond offset survives on mobile, at a fixed 12px.

*Why this headline:* "Permanent" is the only word that carries strength without saying strong, and it is the actual product — masonry is the part of a building that does not get redone. "By trade" does double duty: by profession, and by *the* trade. Together they are four syllables that a competitor cannot copy without sounding like they copied it. No claim in it requires a fact we do not have.

### 6.4 Supporting copy

**Eyebrow** (above the headline, Geist Mono 11px, `#ABABAB`, `+0.12em`, red `+` prefix):

```
+ BRICK · BLOCK · STONE · CONCRETE
```

**Sub-line** (Geist Sans `body-lg`, `#ABABAB`, max 58ch, sits below headline at 32px):

> Masonry and concrete for the parts of a house that never get redone. Laid by hand, on the level, jointed clean.

**Technical strip** (bottom of the type field, Geist Mono 11px `#ABABAB`, on a 1px `ink-500` rule spanning the type field width, `tabular-nums`):

```
ON SITE · COVERED PORCH — BRICK VENEER, KNEE WALL, SLAB ON GRADE     [[CLIENT: CITY, ST]]
```

This strip is simultaneously the video's mandatory spec caption (system §5.2) and the hero's proof-of-realness. It is the line that tells a reader the video is a job, not a stock loop.

### 6.5 CTA

- **Primary:** `REQUEST A FREE ESTIMATE` — deep red `#BA0507` fill, `#F3F3F3` text, 56px, radius 0, magnetic (6px max). Links to `/contact`. **The only primary button in this viewport.**
- **Secondary:** `SEE SELECTED WORK` — ghost/text link with apex (D4), 24px to the right of the primary, baseline-aligned. Anchors to Course 04.

### 6.6 Image / video usage

**Video only.** No stills in the hero. The plate carries `Brix-vid1.mp4`, muted, loop, `playsinline`, `autoplay`, `preload="metadata"`, with a **baked, graded poster frame** (frame 0, same treatment as the stills) so the plate is never empty and never white.

Treatment:
- Top-down black scrim to 40% over the top 22% — the frame opens on sky, and system §2.6 forbids full-saturation blue sitting beside red.
- Bottom-up black scrim `rgba(0,0,0,0.85) → transparent 40%` over the lower third, so the technical strip and the fold edge read.
- A red `+` (D5) 12×12px at the plate's top-left corner, sitting **outside** the plate on the joint line. One registration mark. There are two more permitted in this viewport; use zero of them.
- **No red is ever laid over the footage.**

**Loop selection [OPEN]:** the clip is 19.6s. Choose a 7–9 second segment with the least handheld drift and no hard exposure change, and loop that. This requires eyes on the footage at build time; it is not decidable from metadata.

### 6.7 Desktop composition (1440×900)

```
├─80─┬───────────── type field ~780 ──────────────┬── joint ──┬─ plate 567 ─┤
┌─────────────────────────────────────────────────┬─┬──────────────────────┐
│ ◤BRIX                                    ≡ MENU │ │                      │ 88
├─────────────────────────────────────────────────┼─┼──────────────────────┤ ← datum
│                                                 │+│ ▓▓▓▓ sky, scrimmed   │
│  + BRICK · BLOCK · STONE · CONCRETE             │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                                 │ │ ▓▓  wood rafters  ▓▓ │
│  PERMANENT                                      │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│    BY TRADE                                     │ │ ▓▓  dark brick     ▓ │
│  └ bond offset ~54px                            │ │ ▓▓  veneer         ▓ │
│                                                 │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  Masonry and concrete for the parts of a        │ │ ▓▓  slab           ▓ │
│  house that never get redone. Laid by hand,     │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  on the level, jointed clean.                   │ │ ▓▓  brick knee     ▓ │
│                                                 │ │ ▓▓  wall + rowlock ▓ │
│  ┌──────────────────────────┐                   │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  │ REQUEST A FREE ESTIMATE  │  SEE SELECTED ▶   │ │ ▓▓  grass, scrim   ▓ │
│  └──────────────────────────┘     WORK          │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                                 │ │                      │
│ ─────────────────────────────────────────────── │ │                      │
│ ON SITE · COVERED PORCH — BRICK VENEER, KNEE…   │ │                      │
│                                                 │ │                      │
│ ⌄ SCROLL                                        │ │ ░ continues below ░  │
└─────────────────────────────────────────────────┴─┴──────────────────────┘
                                                    ↑ 1px ink-500 joint,
                                                      full height
```

Whitespace discipline: the type field is ~780px wide and the sub-line is capped at 58ch (~520px). **The right 260px of the type field stays empty.** That gap, sitting immediately left of the joint, is what makes the composition feel expensive. Do not fill it.

### 6.8 Mobile composition (390×844)

The composition inverts: **the video becomes the ground, the type sits on black above it, and they meet at a hard horizontal joint.**

```
┌────────────────────────────────┐
│ ◤BRIX                   ≡ MENU │  72
├────────────────────────────────┤  ← datum
│                                │
│ + BRICK · BLOCK · STONE        │
│                                │
│ PERMANENT                      │  48px display
│   BY TRADE                     │  +12px fixed bond offset
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │  ← 1px #D90D0F rule, full bleed
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ▲
│▓▓▓ video, full bleed 9:16 ▓▓▓▓▓│  │  fills remaining
│▓▓▓ object-fit: cover      ▓▓▓▓▓│  │  ≈ 46% of 844
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │
│▓▓ ░░░ black scrim 85% ░░░░░ ▓▓▓│  │
│▓▓ Masonry and concrete for  ▓▓▓│  │
│▓▓ the parts of a house that ▓▓▓│  │
│▓▓ never get redone.         ▓▓▓│  │
│▓▓ ┌───────────────────────┐ ▓▓▓│  │
│▓▓ │ REQUEST A FREE ESTIM. │ ▓▓▓│  │
│▓▓ └───────────────────────┘ ▓▓▓│  ▼
└────────────────────────────────┘
   ON SITE · COVERED PORCH —…        ← mono strip, first thing below fold
```

Key mobile decisions:

- **The headline's second line overlaps the video's top edge by 0.28em.** Type crossing image is one of the system's three permitted depth devices (§4.5) and it stops the mobile layout reading as two stacked boxes.
- The red 1px rule at the black/video boundary is the mortar joint between the two materials of the page.
- Sub-line and CTA sit **on** the video's scrimmed lower third at 85% black — measured, not eyeballed: `#F3F3F3` on that scrim over the darkest region of the footage holds well above 4.5:1. Verify against the actual poster frame at build; if any frame of the loop breaks it, raise the scrim to 92% rather than moving the text.
- Technical strip drops below the fold. It is the first thing a scrolling thumb meets, which is the right place for proof.
- No secondary CTA on mobile — the bottom bar covers calling, and two CTAs in a 390px viewport is clutter.

### 6.9 Entrance animation

Follows system §6.5 exactly. Beats:

| t | Event | Duration |
|---|---|---|
| — | Ground is already `#000000`. **No white flash, ever.** | — |
| 0 | Datum rule draws left→right | 700ms |
| 0 | Video element begins playing **behind a closed mask** — so the reveal discloses footage already in motion, never a first-frame stutter | — |
| 120 | Headline line 1 mask-reveals: `inset(0 0 100% 0) → inset(0 0 0 0)` + `translateY(0.35em → 0)` | 760ms |
| 200 | Headline line 2, same — **the 80ms delay is the bond offset expressed in time** | 760ms |
| 340 | Video plate mask opens **from the right edge** (§6.4: from the margin it bleeds toward); inner video `scale 1.06 → 1.0` counter-moving | 900ms |
| 420 | Vertical joint line draws top→bottom | 600ms |
| 700 | Eyebrow, sub-line, technical strip rise in, 60ms stagger | 420ms |
| 760 | Primary CTA fill wipes in from the left | 420ms |
| 1000 | Apex scroll cue fades in, begins 2.4s idle loop (4px down, 4px back, `--ease-set`, no overshoot) | 420ms |

Visually complete at **~1.6s.** LCP element is the headline, painted by **~880ms.**

**Reduced motion:** all masks resolve instantly; the video does not autoplay — the graded poster shows with a visible 44px play control at the plate's lower-left, labelled `PLAY (NO SOUND)` in mono.

### 6.10 Scroll animation

**Almost none, deliberately.** The hero's job is done at 1.6s; adding scroll choreography would compete with Course 02.

- The type field translates up at **1.0×** scroll (i.e. it scrolls normally).
- The video plate translates up at **0.94×** — a 6% parallax, under the 8% ceiling. The plate appears to hold slightly as the type leaves.
- The joint line's `scaleY` shortens with the plate.
- **No pinning. No scrubbed opacity. No scale-on-scroll.**

### 6.11 Hover interactions

| Target | Behaviour |
|---|---|
| Primary CTA | Fill wipes `#BA0507 → #D90D0F` from the left, 240ms `--ease-set`; apex chevron slides in 8px from the right. Magnetic, 6px max, 80px radius. |
| Secondary link | `ink-500` underline sweeps out right; red 1px underline sweeps in from the left, 240ms. |
| Video plate | Cursor follower expands to a 96px disc reading `ON SITE`. **The plate is not clickable** — it does not scale, does not lift, does nothing else. It is a window, not a control. |
| Logo | Red 1px rule draws beneath it. |
| Menu trigger | Bond bars (D8) slide into alignment. |
| Scroll cue | Idle loop pauses on hover; clicking scrolls to Course 02 via Lenis. |

### 6.12 Transition into Course 02

**The hero does not end — it drains.**

The video plate is 112svh, so the last 12% of it is still on screen when Course 02's content begins entering from the left. The type field beside it empties to pure black. The result is that for roughly 15vh of scrolling, the page is *black on the left and moving image on the right, with the joint line between them* — a composition that exists only in the transition and belongs to neither section.

The joint line then **continues down past the plate's bottom edge and becomes the right edge of Course 02's detail image.** One line stitches the first two courses together. This is the single detail that will make people say the site feels designed.

---

## 7. COURSE 02 — THE ARGUMENT

### 7.1 Purpose

Convert atmosphere into a reason. State, in the plainest possible English, why masonry is worth paying properly for — and do it in a voice no competitor is using. This is where the page earns the right to show work.

It is emphatically **not** "About Us." Nobody is introduced, no history is claimed, no team is mentioned.

### 7.2 Layout

The exact inverse of the hero: **image left, type right.** Odd course bleeds right, even course bleeds left (system §4.4.3), and the reader registers the flip immediately.

- Detail image: **breaks the container to the left**, cols 1–4 plus the left margin, off the viewport edge. This is Course 02's one break.
- Statement type: cols 6–12.
- Vertical rhythm: `--space-section` (clamp 96–160px) top and bottom.

### 7.3 Headline

Set at `display-3` (clamp 2.25–5rem), Archivo `wdth 85` `wght 700`, **sentence case**, tracking `-0.025em`, leading `0.92`, max width 20ch so it breaks into four short lines:

> Paint fades.
> Framing moves.
> Roofs get replaced.
> **Masonry is the part nobody has to think about again.**

**Colour hierarchy inside the paragraph:** the first three sentences in `#ABABAB`, the fourth in `#F3F3F3`. One paragraph, two weights of attention, zero new colours. The reader's eye lands on the last line without any device pointing at it.

### 7.4 Supporting copy

Geist Sans `body`, `#ABABAB`, cols 6–9, max 58ch, 40px below the statement:

> Which is why it is worth doing once, by someone who lays it plumb, ties it into the structure properly, and strikes the joints before the mortar sets.

### 7.5 CTA

**None. Deliberately.**

A statement section that asks for something is an advertisement. A statement section that asks for nothing is a position. This is one of two sections on the page with no call to action (the other is Course 06), and that restraint is what makes the estimate moment in Course 07 land.

### 7.6 Image usage

**Image 03 — the arched brick mailbox with the herringbone infill panel — treatment T5, extreme detail crop.**

- **Crop:** into the herringbone panel only, roughly 2× magnification. The arch, the mailbox door and the surrounding lawn are all cropped out. What remains is a field of diagonal brick with its soldier-course border entering from one edge.
- **Ratio:** 1:1, rendered ~440px square at 1440.
- **Why this frame:** herringbone is a bond a bad mason will not attempt. Showing it at magnification, uncaptioned by any adjective, is the most efficient craftsmanship claim available. It says the thing the word "craftsmanship" cannot.

**Caption** (Geist Mono 11px, `#ABABAB`, below the image, on its own hairline):

```
HERRINGBONE INFILL · SOLDIER-COURSE SURROUND · DETAIL AT 2×
```

### 7.7 Desktop composition

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │  ← 160px
│ ░░░░░░░░░░░░░░░░                                              │
│ ░░╱╱╱╱╱╱╱╱╱╱╱╱░░     + COURSE 02 / WHY MASONRY                │
│ ░░╱ herring- ╱░░     ────────────────────                     │
│ ░░╱ bone at  ╱░░                                              │
│ ░░╱ 2×       ╱░░     Paint fades.                             │
│ ░░╱╱╱╱╱╱╱╱╱╱╱╱░░     Framing moves.                           │
│ ░░░░░░░░░░░░░░░░     Roofs get replaced.                      │
│ ────────────────     Masonry is the part nobody               │
│ HERRINGBONE INFILL…  has to think about again.                │
│                                                               │
│ ◄ bleeds off edge    Which is why it is worth doing once, by  │
│                      someone who lays it plumb, ties it into  │
│                      the structure properly, and strikes the  │
│                      joints before the mortar sets.           │
│                                                               │  ← 160px
└───────────────────────────────────────────────────────────────┘
                                              cols 6─12 ────────┘
```

The image sits **high** in the section and the supporting copy sits **low**, so the two elements do not align on any horizontal — the section has no visual "row." That is the asymmetry doing its job.

### 7.8 Mobile composition

```
┌────────────────────────────────┐
│ + COURSE 02 / WHY MASONRY      │
│ ──────────                     │
│                                │
│ Paint fades.                   │  display-3 @ 2.25rem
│ Framing moves.                 │
│ Roofs get replaced.            │
│ Masonry is the part nobody     │
│ has to think about again.      │
│                                │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← full-bleed 1:1, edge to edge
│░░╱╱╱╱ herringbone ╱╱╱╱╱╱╱╱╱░░░░│    (no margins — it is a wall)
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ HERRINGBONE INFILL · SOLDIER…  │
│                                │
│ Which is why it is worth doing │
│ once, by someone who lays it   │
│ plumb…                         │
└────────────────────────────────┘
```

Order changes on mobile — **statement first, image second, support third.** The statement is the payload and must not be pushed below an image on a phone. Bond offset is 0 here per system §3.4.

### 7.9 Entrance animation

Sequential, not simultaneous, so the section holds to one primary motion at a time:

1. Eyebrow rule (D3) draws left→right, 700ms, at 15% viewport entry.
2. Statement mask-reveals **line by line**, 60ms stagger, 760ms each — four lines, 180ms total stagger, well under the 480ms ceiling.
3. Image mask opens **from the left** (it bleeds left, per §6.4), 900ms, inner image `scale 1.06 → 1.0`.
4. Support copy rises in, 420ms.

### 7.10 Scroll animation

- Detail image parallax at **6%** (scrubbed trigger #1). It drifts up slightly slower than the type, which opens the gap between them as the section passes — the composition is subtly different at the top and bottom of the scroll.
- Nothing else moves.

### 7.11 Hover interactions

| Target | Behaviour |
|---|---|
| Detail image | Inner image scales to 1.04 inside its fixed mask, 700ms; red `+` fades in at top-left. Not clickable. |
| Nothing else | There are no other interactive targets in this section, and that is correct. |

### 7.12 Transition into Course 03

The section ends on a **full-bleed 1px `ink-500` rule.** Course 03 butts directly against it with zero padding, so that rule is simultaneously the argument's closing line and the capability band's top edge — one joint serving two courses, which is exactly what mortar does.

---

## 8. COURSE 03 — WHAT WE LAY

### 8.1 Purpose

Answer "do you do my thing?" in under two seconds without a services section, without cards, and without icons. It is a joint between two large courses, not a destination.

### 8.2 Layout

**One horizontal band, 200px tall, full bleed, containing six cells separated by 1px `ink-400` joints.**

It is literally a course of bricks: six units, laid end to end, mortar between them. That is the whole idea, and it is why this cannot be mistaken for three feature cards.

Each cell:

```
01                     ← Geist Mono 11px, #ABABAB (→ #D90D0F on hover)
BRICK                  ← Archivo wdth 100, wght 700, h2, uppercase
Veneer, columns,       ← Geist Mono 11px, #ABABAB, 2 lines max
mailboxes
```

### 8.3 Content

| # | Name | Spec line |
|---|---|---|
| 01 | BRICK | Veneer, columns, mailboxes |
| 02 | BLOCK | Footings, retaining, structural |
| 03 | STONE | Veneer, pillars, caps |
| 04 | CONCRETE | Slabs, drives, flatwork |
| 05 | OUTDOOR | Fireplaces, patios, knee walls |
| 06 | REPAIR | Tuckpointing, rebuilds, matching |

Every one of these is evidenced by a photograph in the set. Nothing here is aspirational.

### 8.4 Headline / supporting copy

**No section heading.** The band is preceded only by its eyebrow, set flush left immediately above the band on its own hairline:

```
+ COURSE 03 / WHAT WE LAY
```

Adding a heading like "Our Services" would convert this from a structural joint into a generic section. The band is self-evident.

### 8.5 CTA

One ghost link, right-aligned on the eyebrow's line, so it reads as an index entry rather than a button:

```
ALL CAPABILITIES ▸        → /services
```

### 8.6 Image usage

**None.** This band is type and rule only. It is the page's breath between the argument and the proof, and putting six thumbnails in it would be the exact thing the brief says to avoid.

### 8.7 Desktop composition

```
+ COURSE 03 / WHAT WE LAY                            ALL CAPABILITIES ▸
────────────────────────────────────────────────────────────────────────
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│01        │02        │03        │04        │05        │06        │
│          │          │          │          │          │          │  200px
│BRICK     │BLOCK     │STONE     │CONCRETE  │OUTDOOR   │REPAIR    │
│Veneer,   │Footings, │Veneer,   │Slabs,    │Fireplaces│Tuckpoint,│
│columns,  │retaining,│pillars,  │drives,   │patios,   │rebuilds, │
│mailboxes │structural│caps      │flatwork  │knee walls│matching  │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
   ▲ 1px ink-400 joints — cells never touch at zero, never gap over 16px
```

Cells are **unequal**: BRICK gets 1.4× the width of the others (system §4.2 D1 — a course is a band of *unequal* panels). Brick leads because it leads the business. Widths: `1.4fr 1fr 1fr 1.1fr 1fr 1fr`.

### 8.8 Mobile composition

Two columns × three rows, and **alternate rows shift by 12px** so the grid reads as a running bond rather than a table:

```
┌───────────┬───────────┐
│01 BRICK   │02 BLOCK   │
├───────────┴─┬─────────┴─┐   ← offset 12px
│03 STONE     │04 CONCRETE│
└─┬───────────┴───────────┤
  │05 OUTDOOR │06 REPAIR  │
  └───────────┴───────────┘
```

Cell height 132px, spec lines drop to one line on mobile. The offset is the one place the bond survives below 768px besides the hero headline — justified because here the bond *is* the content.

### 8.9 Entrance animation

Cells mask-reveal **left to right, 40ms stagger** (6 items → `--stagger-lg`), 240ms total, each opening from its left edge. It reads as a course being laid, one brick at a time, at the speed a mason actually works. Do not slow it down to make the effect more visible; the point is that it feels efficient.

### 8.10 Scroll animation

None. This band is static. It is a rest.

### 8.11 Hover interactions

| Target | Behaviour |
|---|---|
| Cell | Background fills `ink-100` **from the left**, 240ms `--ease-set`. The index number turns `#D90D0F`. The name does not move, does not scale, does not underline. |
| Sibling cells | Do **not** dim. Six cells dimming as a group would read as a menu; this is a wall. |
| `ALL CAPABILITIES` | Standard ghost-link underline sweep. |
| Whole cell | Is an `<a>` to the matching anchor on `/services` — a real link, keyboard-focusable, focus ring 2px `#D90D0F`. |

### 8.12 Transition into Course 04

The band's bottom joint is the featured image's top edge. **Zero padding** (system §3.6: full-bleed image sections butt against their neighbours). The band ends and 88vh of photograph begins at exactly the same pixel row. That abruptness is the point — it is the difference between courses of brick and paragraphs of a brochure.

---

## 9. COURSE 04 — SELECTED

### 9.1 Purpose

Prove the claim with real work, in a form that makes `/work` feel like a place with more in it rather than a duplicate of this section. This is where the brief's "strong selected-work experience that encourages exploration" lives.

Structure: **one featured project at full bleed, then three ledger rows, then one terminal link.** Four projects on Home. Not six, not nine — "selected" has to mean selected.

### 9.2 Layout

Three stacked parts, no padding between them.

**9.2a Featured plate** — full bleed, 88vh, landscape image, type overlaid bottom-left inside a black scrim.
**9.2b Ledger** — three rows, 112px each desktop / 88px mobile, on hairlines, per system §7.6.
**9.2c Terminal** — a single oversized link occupying its own 200px band.

### 9.3 Headline

The featured plate carries no section heading — **the eyebrow sits on top of the image, bottom-left, above the project title:**

```
+ COURSE 04 / SELECTED
```

The project title itself is the headline, set `display-3` (sentence case per §4):

> Covered porch and brick knee wall

with the index `001` in Archivo `wdth 62` at `display-2` scale, `#ABABAB`, sitting to the left of it, and the spec line beneath in mono.

### 9.4 Supporting copy

Featured overlay, mono, `#ABABAB`:

```
001    RUNNING BOND · ROWLOCK CAP · SLAB ON GRADE     [[CLIENT: CITY, ST]]
```

Ledger rows (system §9.5 — `[index] [title] [spec] [apex]`):

| Index | Title | Spec |
|---|---|---|
| 002 | Brick mailbox and planter | RUNNING BOND · SOLDIER COURSE · GABLE CAP |
| 003 | Full brick veneer, residence | RUNNING BOND · ROWLOCK SILLS · CORNER RETURNS |
| 004 | Covered patio and slab | BRICK COLUMNS · KNEE WALL · BROOM-FINISH SLAB |

Every spec line names a **bond pattern and a detail**. That is the format that turns phone photographs into documentation (system §1.5), and it is mandatory.

### 9.5 CTA

The terminal band, 200px tall, full bleed, containing one item set at `display-3`:

```
SEE ALL WORK  ▸
```

Right-aligned, with a 1px `ink-500` rule running from the left margin to meet it — the rule points at the link. On hover the rule turns `#D90D0F` and **extends 24px further right, pushing under the link**, while the apex slides 8px. The link does not move.

This is the page's strongest pull toward `/work`, and it works because it is the *only* thing in a 200px band. A button here would be smaller and weaker.

### 9.6 Image usage

| Slot | Image | Treatment | Crop direction |
|---|---|---|---|
| Featured | **10** — covered porch, brick knee wall, dusk | T2 full bleed, 16:9 | Crop **from the top-left** to remove the watermark disc; anchor the crop on the run of knee wall and the porch posts. Sky reduced to the top ~18% of frame. |
| Row 002 preview | **02** — brick fireplace + seat wall | T7 cursor preview, 4:5 | Crop to the chimney and seat wall; remove the house and most of the lawn. |
| Row 003 preview | **09** — brick veneer elevation | T7 cursor preview, 4:5 | Crop **from the top-left** (watermark); anchor on the corner return and two windows. Portrait crop out of a landscape source is fine here — the corner is vertical. |
| Row 004 preview | **11** — covered patio, wet slab | T7 cursor preview, 4:5 | Crop **from the top-left** (watermark); anchor on the brick columns and the reflective slab. |

Featured image gets a bottom-up scrim `rgba(0,0,0,0.88) → transparent 55%`. Nothing red touches it.

### 9.7 Desktop composition

```
┌──────────────────────────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓  image 10 — covered porch, dusk, full bleed  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ 88vh
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│░░░░░░░░░░░░░░░░░░░░░░░░ scrim ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│  + COURSE 04 / SELECTED                                              │
│      Covered porch and brick knee wall                               │
│ 001  ───────────────────────────────────────                         │
│      RUNNING BOND · ROWLOCK CAP · SLAB ON GRADE      [[CITY, ST]]    │
└──────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────┐
│ 002   Brick mailbox and planter    RUNNING BOND · SOLDIER…        ▸  │ 112
├──────────────────────────────────────────────────────────────────────┤
│ 003   Full brick veneer, residence RUNNING BOND · ROWLOCK…        ▸  │ 112
├──────────────────────────────────────────────────────────────────────┤
│ 004   Covered patio and slab       BRICK COLUMNS · KNEE WALL…     ▸  │ 112
├──────────────────────────────────────────────────────────────────────┤
│ ───────────────────────────────────────────────      SEE ALL WORK ▸  │ 200
└──────────────────────────────────────────────────────────────────────┘
```

The featured index `001` hangs **into the left margin**, outside the content column. That is Course 04's one container break.

### 9.8 Mobile composition

- Featured plate: 62vh (portrait crop of image 10 — anchor on the knee wall run, accept losing the right third). Overlay stacks: eyebrow → index+title → spec.
- Ledger rows: 88px tall, two lines each — title on line 1, spec in mono on line 2, apex right. Index moves **above** the title as a small mono number rather than sitting beside it at display scale, because a `display-2` numeral eats a third of a 390px row.
- **Cursor previews do not exist on touch.** Instead, each row's preview image renders as a 64×80px thumbnail at the row's right edge, before the apex. The interaction is replaced, not removed — a hover-only feature that silently vanishes on mobile is a design failure.
- Terminal link: full-width band, 140px, link left-aligned at `display-3`, rule beneath it.

### 9.9 Entrance animation

- **Featured plate:** mask opens **from the bottom** (full-width element → a wall rising, §6.4), 1000ms `--dur-major`, inner image `scale 1.06 → 1.0`. This is the page's largest single motion and it should be the only thing moving when it fires.
- **Overlay type:** rises in at +300ms, 60ms stagger.
- **Ledger rows:** each row's hairline draws left→right, 60ms stagger; the row's content mask-reveals behind it. Rows enter **top to bottom** (vertical stack rule, §6.4).
- **Terminal link:** the pointing rule draws left→right, 700ms, then the link mask-reveals.

### 9.10 Scroll animation

- Featured image parallax **7%** (scrubbed trigger — at most one other scrubbed trigger may be live simultaneously, and none is in this range).
- Ledger and terminal: static.

### 9.11 Hover interactions

**The ledger is the highest-value interaction on the page.** Per system §7.6:

| Target | Behaviour |
|---|---|
| Featured plate | Inner image scales 1.04 in a fixed mask; red `+` at top-left; cursor follower expands to a 96px disc reading `VIEW`. Whole plate is a link to the project on `/work`. |
| Ledger row | Row background fills `ink-100` **from the left**, 240ms. Index turns `#D90D0F`. Title shifts right 12px. Apex slides right 8px. |
| Ledger row, siblings | Non-hovered rows dim to `ink-600`. |
| Ledger row, cursor preview | A 4:5 panel (~200×250px) fades in at the cursor and follows at `lerp 0.18`, showing that project's photograph. It **lags** the cursor deliberately — it should feel like something being carried, not something attached. |
| Keyboard focus on a row | 2px `#D90D0F` ring, background fill, index reddens. **The cursor preview does not fire** — it is a pointer-only enhancement and firing it on focus would place a floating panel at an arbitrary screen position. |
| `SEE ALL WORK` | Rule reddens and extends 24px; apex slides 8px; link stays put. |

### 9.12 Transition into Course 05

The ledger's last row and the terminal band share a full-bleed hairline. **Course 05 begins with a red vertical rule that starts at exactly the x-position where the last ledger index `004` sat** — the red that was in the index becomes the red that draws down the method. Continuity of a single colour across a section boundary is cheap to build and does more for "premium" than any effect.

---

## 10. COURSE 05 — METHOD

### 10.1 Purpose

Prove craftsmanship with vocabulary. This is where a reader who is comparing three contractors discovers that one of them knows what a dry bond is.

It is **not** "Our Process" with icons and arrows. There are no icons. The four steps are the four things that actually happen, named the way they are named on a site.

### 10.2 Layout

Left: a vertical red "string line" and four numbered steps stacked down the page.
Right: one tall image plate, cols 9–12, held high in the section.

The steps are widely spaced — ~200px of vertical air between them — so the section reads as a slow descent rather than a list. This is the page's quietest, longest course, and it is placed here on purpose: after the visual peak of Course 04, the reader needs somewhere to slow down before being asked for anything.

### 10.3 Headline

`display-3`, sentence case, cols 1–7:

> Anyone can stack brick. The job is in what happens before and after.

### 10.4 Supporting copy — the four steps

Each step: mono index → Archivo `h2` name → Geist Sans `body` explanation, max 58ch.

**01 · FOOTING**
> Dig, form and pour below frost depth, on ground that has been checked. Nothing goes up on a bad base, and no amount of good bricklaying fixes one.

**02 · DRY BOND**
> Lay the first course out dry, without mortar, and adjust until the pattern lands whole at every corner and opening. Cut bricks are a decision, not an accident.

**03 · LAYING**
> Level, plumb and to the line, one course at a time, mixing from the same batch so the colour holds from the first course to the last.

**04 · STRIKING**
> Tool the joints while the mortar is thumbprint-hard, then wash the face down. This is the step that gets skipped, and it is the one you will look at every day.

*These are real practices described in real terms. Nothing here is invented, and nothing claims a standard we cannot demonstrate.*

### 10.5 CTA

One ghost link at the end of step 04, indented to align with the step text:

```
QUESTIONS ABOUT YOUR JOB? ▸        → /contact
```

Low-key by design. The section's job is authority; the estimate ask is two courses away and should not be pre-empted.

### 10.6 Image usage

**Image 11 — covered patio, brick columns, wet slab — as a tall plate**, 3:4, cols 9–12, top-aligned with step 01.

- Crop from the top-left to remove the watermark; anchor on the brick columns and the reflection in the wet slab.
- The wet slab is the reason this image is here: it is the only frame in the set where finished concrete reads as a *surface* rather than a floor. Since half the business is concrete, that matters.

**Caption:**
```
COVERED PATIO · BRICK COLUMNS + KNEE WALL · SLAB POURED AND FINISHED IN PLACE
```

### 10.7 Desktop composition

```
┌───────────────────────────────────────────────────────────────────────┐
│  + COURSE 05 / METHOD                                                 │
│  ──────────────                                                       │
│                                                                       │
│  Anyone can stack brick. The job is in                ░░░░░░░░░░░░░░  │
│  what happens before and after.                       ░░ image 11 ░░  │
│                                                       ░░ tall 3:4  ░░ │
│  │                                                    ░░ brick     ░░ │
│  │  01   FOOTING                                      ░░ columns,  ░░ │
│  │       Dig, form and pour below frost depth…        ░░ wet slab  ░░ │
│  │                                                    ░░░░░░░░░░░░░░  │
│  │  02   DRY BOND                                     ──────────────  │
│  │       Lay the first course out dry, without…       COVERED PATIO…  │
│  │                                                                    │
│  │  03   LAYING                                                       │
│  │       Level, plumb and to the line…                                │
│  │                                                                    │
│  │  04   STRIKING                                                     │
│  ▼       Tool the joints while the mortar is…                         │
│          QUESTIONS ABOUT YOUR JOB? ▸                                  │
└───────────────────────────────────────────────────────────────────────┘
   ▲ 1px #D90D0F string line, scaleY driven by scroll
```

The string line is 1px `#D90D0F` — bright red as **light**, correctly used as a line and not a fill (system §2.2). Its total area across a 1200px section is 1200px² out of ~1.6M — around 0.08% of the viewport. Well inside budget.

### 10.8 Mobile composition

```
┌────────────────────────────────┐
│ + COURSE 05 / METHOD           │
│                                │
│ Anyone can stack brick.        │
│ The job is in what happens     │
│ before and after.              │
│                                │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← image 11, full bleed 3:4
│░░░ brick columns, wet slab ░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ COVERED PATIO · BRICK COLUMNS… │
│                                │
│ │ 01  FOOTING                  │
│ │     Dig, form and pour…      │
│ │                              │
│ │ 02  DRY BOND                 │
│ │     Lay the first course…    │
│ │                              │
│ │ 03  LAYING                   │
│ │     Level, plumb and…        │
│ │                              │
│ ▼ 04  STRIKING                 │
│       Tool the joints…         │
│       QUESTIONS ABOUT… ▸       │
└────────────────────────────────┘
```

The image moves **above** the steps on mobile so the reader gets a visual before a 400-word read. The string line survives at 1px, inset 20px from the left margin, and still scrubs. Step spacing compresses from 200px to 72px.

### 10.9 Entrance animation

- Headline mask-reveals by line, 60ms stagger.
- Image plate mask opens **from the right** (it bleeds right), 900ms.
- Steps do **not** all enter at once. Each step mask-reveals as it individually crosses 70% viewport height, `once: true`. The reader assembles the method by scrolling, which is the correct metaphor.

### 10.10 Scroll animation

- **The string line's `scaleY` is scrubbed to section progress** (`scrub: 0.6`), drawing from 0 at the section top to 1 at step 04. This is scrubbed trigger #1 for this region.
- Each step's index numeral turns from `#ABABAB` to `#D90D0F` as its step becomes the active one (driven by ScrollTrigger, never a raw scroll listener) and returns to grey when the next becomes active. **One index is red at any moment.**
- Image plate parallax **6%** (scrubbed trigger #2). Exactly two scrubbed triggers, which is the ceiling — no third scrubbed effect may be added to this section.

### 10.11 Hover interactions

| Target | Behaviour |
|---|---|
| Step block | No hover state. These are not controls and giving them one would imply they are clickable. |
| Image plate | Inner scale 1.04; red `+` top-left. Not clickable. |
| `QUESTIONS ABOUT YOUR JOB?` | Ghost-link underline sweep. |

### 10.12 Transition into Course 06

The string line terminates in a **red `+` (D5)** at its base. That `+` is positioned at the top-left corner of Course 06's first plate. The line that measured the method becomes the registration mark on the material — the page's red hands off from one course to the next rather than restarting.

---

## 11. COURSE 06 — MATERIAL

### 11.1 Purpose

The tactile course. Two materials at magnification, named precisely, with a single sentence that demonstrates the kind of knowledge a customer will not get from a competitor's site. This is the page's last breath before the ask.

### 11.2 Layout

**A diptych, offset.** Two plates side by side, separated by a 16px `joint-md`, with the right plate dropped **80px lower** than the left — the bond offset applied vertically. One statement sits above and between them.

### 11.3 Headline

`display-3`, sentence case, cols 1–6, sitting above the left plate:

> Brick and stone do not behave the same way.

### 11.4 Supporting copy

Geist Sans `body`, `#ABABAB`, cols 8–12, max 58ch, top-aligned with the headline:

> Different mortar, different joints, different tolerances. Knowing which is which — and laying them so they still look right in ten years — is most of the job.

### 11.5 CTA

**None.** The second and last CTA-free course. The page has now made its argument, shown its work, and demonstrated its knowledge. The next thing it does is ask.

### 11.6 Image usage

| Plate | Image | Crop |
|---|---|---|
| Left (brick) | **04** — red brick mailbox column | Extreme crop into the running-bond face: red brick, white mortar, concave joints. No mailbox door, no trailer, no ground. Ratio 4:5. |
| Right (stone) | **01** — limestone porch entry | Extreme crop into the stone coursing on a column face: irregular ashlar, tight joints, varied stone sizes. No roofline, no lantern, no sky. Ratio 4:5. |

**Captions** (mono, on hairlines beneath each plate):

```
RED BRICK · RUNNING BOND · CONCAVE JOINT, WHITE MORTAR
LIMESTONE VENEER · RANDOM ASHLAR · TIGHT-FIT DRY-STACK APPEARANCE
```

*Why a pair rather than a triptych:* three plates would fill the row and make it a gallery. Two plates with the third position left empty is a composition. The empty right-hand third of this section is intentional and must be preserved.

### 11.7 Desktop composition

```
┌───────────────────────────────────────────────────────────────────────┐
│ + COURSE 06 / MATERIAL                                                │
│ ────────────                                                          │
│ Brick and stone do not              Different mortar, different       │
│ behave the same way.                joints, different tolerances.     │
│                                     Knowing which is which — and      │
│                                     laying them so they still look    │
│                                     right in ten years — is most      │
│ ┌──────────────┐                    of the job.                       │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ◄16px►┌──────────────┐                               │
│ │▓ red brick, ▓│       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← dropped 80px               │
│ │▓ running    ▓│       │▓ limestone, ▓│                               │
│ │▓ bond, at 2×▓│       │▓ random     ▓│         (this third of the    │
│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │▓ ashlar     ▓│          section stays empty)  │
│ └──────────────┘       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                               │
│ ──────────────         └──────────────┘                               │
│ RED BRICK · RUNNING…   ──────────────                                 │
│                        LIMESTONE VENEER · RANDOM…                     │
└───────────────────────────────────────────────────────────────────────┘
```

### 11.8 Mobile composition

The plates stack, and the offset becomes horizontal: the left plate is inset 20px from the left and bleeds off the **right** edge; the right plate is inset 20px from the right and bleeds off the **left**. They interlock like courses. Each is 4:5 and roughly 82% of viewport width.

```
┌────────────────────────────────┐
│ + COURSE 06 / MATERIAL         │
│ Brick and stone do not         │
│ behave the same way.           │
│                                │
│   ┌────────────────────────────│  ← bleeds right
│   │▓▓ red brick, running bond ▓│
│   └────────────────────────────│
│   RED BRICK · RUNNING BOND…    │
│                                │
│────────────────────────────┐   │  ← bleeds left
│▓▓ limestone, random ashlar▓│   │
│────────────────────────────┘   │
│ LIMESTONE VENEER · RANDOM…     │
│                                │
│ Different mortar, different    │
│ joints, different tolerances…  │
└────────────────────────────────┘
```

### 11.9 Entrance animation

- Headline and support mask-reveal, 60ms apart.
- **Left plate opens from the left; right plate opens from the right.** They open outward from the centre joint, 900ms, 90ms apart. This is the only symmetrical motion on the page and it is permitted because the section's subject is a comparison.

### 11.10 Scroll animation

Both plates parallax at **4%**, in opposite directions — the left drifts marginally slower, the right marginally faster, so the vertical offset between them grows by ~30px across the scroll. Almost subliminal. One scrubbed trigger driving both.

### 11.11 Hover interactions

| Target | Behaviour |
|---|---|
| Either plate | Inner image scales 1.04 in its fixed mask; red `+` fades in at the corner nearest the page edge. |
| Either caption | No state. Captions are records, not links. |

### 11.12 Transition into Course 07

Course 06 ends with `--space-section-lg` of pure black — **the largest single area of nothing on the page**, roughly 200px at desktop. Then the estimate section's red footing rule draws across the full viewport width.

That deliberate emptiness is the setup. Every other transition on this page is a butt joint; this one is a gap. It is the only place the page pauses, and it is placed immediately before the one thing the page actually wants.

---

## 12. COURSE 07 — THE ESTIMATE

### 12.1 Purpose

The conversion moment. It must feel like the natural end of the argument rather than a banner bolted to the bottom, and it must reduce the cost of starting to a single keystroke.

### 12.2 The idea: the footing

Everything in this section **sits on a 2px `#D90D0F` rule that spans the full viewport width** — the footing line. It is the only 2px red rule on the page and the only full-bleed red element in the site. Above it, the ask. Below it, the footer's monument sits on the same conceptual line. The wall has been laid; this is the ground it stands on.

Red budget check: 2px × 1440px = 2,880px² against a ~1.3M px² viewport = **0.22%**. Plus the primary button fill (≈340 × 56 = 19,000px² = 1.5%). Total red in this viewport ≈ **1.7%** — the highest concentration anywhere on the page and still comfortably under the 5% ceiling.

### 12.3 Layout

**The page's one centred moment** (system §4.4 permits a maximum of two; Home uses one). Everything else on this page is asymmetric, which is precisely what gives this section its weight — the composition stops leaning and squares up.

Stacked and centred above the footing rule: statement → work-order field → alternate contact line → mono conditions strip.

### 12.4 Headline

`display-2`, Archivo `wdth 72` `wght 800`, **UPPERCASE**, two lines, centred:

```
TELL US WHAT
YOU WANT BUILT
```

Line 2 is **not** bond-offset here. This is the one place the page squares up; offsetting it would soften the moment.

### 12.5 Supporting copy

Geist Sans `body-lg`, `#ABABAB`, centred, max 58ch:

> Free estimates. Send a photo of the spot and rough dimensions if you have them — it saves a visit and gets you a number faster.

### 12.6 CTA — the work order

Not a bare button. **A single field**, styled per system §7.8 (no box, baseline rule only):

```
01  WHAT ARE WE BUILDING?
────────────────────────────────────────────────────────────  ▸
Brick mailbox · 12 × 16 patio slab · chimney repair…
```

- Mono label, 11px, uppercase, numbered — the work-order convention used across the site's forms.
- Input transparent, bottom rule 1px `ink-500`, text `#F3F3F3` at 18px, 56px tall, ~520px wide desktop / full width mobile.
- Focus: the bottom rule animates to 2px `#D90D0F` scaling from the left, 240ms; label brightens to `#F3F3F3`.
- The apex submit at the right end of the rule.
- **On submit, the page routes to `/contact` with the entered value carried into that form's project-description field, pre-filled and visible.** The user sees their own words arrive on the next page. That continuity is worth more than any animation on this site.
- **Empty submit is valid** — it routes to `/contact` with the field blank. The field is an accelerator, never a gate.

**Below it, the primary button** — because the field alone is too quiet for a phone user scanning:

```
[ START THE ESTIMATE ]      ← #BA0507 fill, the viewport's only primary
```

### 12.7 Alternate contact

`display-3`, `tabular-nums`, centred, 48px below the button:

```
OR CALL  [[CLIENT: PHONE]]
```

`OR CALL` in `#ABABAB` at `h2` scale; the number in `#F3F3F3` at `display-3`, as a `tel:` link. On hover a red rule draws beneath the number only.

**If no phone number is supplied, this entire line is removed** — not replaced with a placeholder, not filled with an email.

### 12.8 Conditions strip

Geist Mono 11px, `#ABABAB`, centred, sitting directly on the footing rule:

```
NO CHARGE FOR THE ESTIMATE  ·  [[CLIENT: SERVICE AREA]]  ·  [[CLIENT: TYPICAL REPLY TIME]]
```

Each segment is independently removable. If only one is known, the strip carries one segment.

### 12.9 Image usage

**None.** No imagery, no texture, no background photograph at 20% opacity. This section is type, one rule, one field and one button on black. Its power comes from being the emptiest section on the page after the fullest.

### 12.10 Desktop composition

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                        + COURSE 07 / ESTIMATE                         │
│                                                                       │
│                          TELL US WHAT                                 │
│                         YOU WANT BUILT                                │
│                                                                       │
│              Free estimates. Send a photo of the spot and             │
│              rough dimensions if you have them — it saves             │
│              a visit and gets you a number faster.                    │
│                                                                       │
│              01  WHAT ARE WE BUILDING?                                │
│              ─────────────────────────────────────────  ▸             │
│              Brick mailbox · 12 × 16 patio slab…                      │
│                                                                       │
│                     ┌──────────────────────┐                          │
│                     │  START THE ESTIMATE  │                          │
│                     └──────────────────────┘                          │
│                                                                       │
│                     OR CALL  [[CLIENT: PHONE]]                        │
│                                                                       │
│   NO CHARGE FOR THE ESTIMATE · [[SERVICE AREA]] · [[REPLY TIME]]      │
│═══════════════════════════════════════════════════════════════════════│ ← 2px #D90D0F
└───────────────────────────────────────────────────────────────────────┘
```

### 12.11 Mobile composition

Identical structure, tightened:

- Headline drops to `display-2` minimum (2.75rem), still two lines.
- The field is full width with the apex submit stacked as a 52px full-width secondary beneath it — a 44px apex tap target at the end of a rule is too small on a phone.
- `START THE ESTIMATE` is **the one permitted full-width primary button** on the site (system §9.1).
- Phone line is large and thumb-reachable; on mobile it moves **above** the conditions strip and gets 56px of clearance.
- The persistent bottom bar is present here. To avoid two primaries in one viewport, **the bottom bar's `FREE ESTIMATE` half fades to a secondary treatment (transparent, `ink-500` border) while Course 07 is in view**, restoring when it leaves. `CALL` is unaffected.

### 12.12 Entrance animation

1. Footing rule draws **left→right across the full viewport**, 1000ms `--dur-major`. It is the page's last major motion and its longest single line.
2. Headline mask-reveals, two lines, 80ms apart — the same 80ms as the hero, closing the loop.
3. Support, field, button, phone line rise in, 60ms stagger.

### 12.13 Scroll animation

None. Nothing parallaxes here. The section is at rest because the reader is being asked to act.

### 12.14 Hover interactions

| Target | Behaviour |
|---|---|
| Work-order field | Bottom rule brightens from `ink-500` to `ink-400`→`#F3F3F3` on hover; on focus, 2px red scaling from left. |
| Apex submit | Slides 8px right, turns `#D90D0F`. |
| `START THE ESTIMATE` | Fill wipes deep→bright red from the left; apex slides in 8px. Magnetic 6px. |
| Phone number | Red 1px rule draws beneath the digits only, not beneath `OR CALL`. |

### 12.15 Submit states

Per system §7.8: idle → **sending** (button fill drains left-to-right as a progress rule) → **sent** (label becomes `REQUEST RECEIVED` with an apex mark, button locks). On this page the field routes rather than submits, so the state used here is a 240ms fill-drain before the page transition fires — the button visibly commits before the page leaves.

### 12.16 Transition into the footer

The footing rule **is** the boundary. The footer begins immediately below it with zero padding. There is no gap, no fade, no divider. The wall meets the ground and the ground is the footer.

---

## 13. COURSE 08 — THE FOUNDATION (footer)

Built exactly to system §9.8. Specified here only where Home differs.

### 13.1 Purpose

Close the page with the brand at maximum scale, and carry the three things a customer needs at the end: how to reach you, where to go next, and nothing else.

### 13.2 Layout

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  REQUEST A FREE ESTIMATE ▸      [[PHONE]]      [[EMAIL]]     INSTAGRAM│
│  ─────────────────────────────────────────────────────────────────────│
│                                                                       │
│  HOME   WORK   SERVICES   ABOUT   CONTACT                             │
│                                                                       │
│                              ◤                                        │
│                          (apex, 18°)                                  │
│                                                                       │
│  B R I X                                                              │
│  ═════════════════════════════════════════════════════════════════════│ ← 2px red
│  © [[YEAR]] BRIX MASONRY + CONCRETE      [[LICENCE / LEGAL LINE]]     │
└───────────────────────────────────────────────────────────────────────┘
```

- `BRIX` set in Archivo condensed, scaled to **fill the viewport width edge to edge**, sitting directly on the 2px red rule. The letterforms' baselines touch the rule — the monument stands on the footing.
- The apex (D4) above it at large scale in 2px `#F3F3F3`, echoing the logo's roofline without reproducing the logo.
- **No imagery. No four-column link farm. No social icon row** — Instagram is a text link with a `+`.
- The Instagram QR asset (`Brix-masonry-insta-follow-qr-code.jpeg`) does **not** belong here. It goes on `/contact`, where someone is already stationary with their phone out.

### 13.3 Entrance / scroll / hover

- `BRIX` mask-reveals **from the bottom** — a wall rising — 1000ms, triggered at 40% viewport entry, `once: true`.
- The 2px red rule draws left→right beneath it, 700ms, starting 200ms earlier so the rule exists before the word lands on it.
- No scroll animation. No parallax.
- Nav links and contact links: standard red underline sweep. The `BRIX` monument is **not** a link and has no hover state.

### 13.4 Mobile

`BRIX` still spans the full width (that is the whole point). The upper course collapses to a stack: estimate link → phone → email → Instagram, each 52px tall on hairlines. The bottom bar sits over the legal strip; add 56px of bottom padding so nothing is obscured.

---

## 14. Image and video distribution — Home vs. the rest of the site

**[AMENDMENT to system §5.6.]** The original map assigned image 11 to the featured full-bleed slot; 11 is portrait and cannot take a 16:9 treatment. It also assumed the video was landscape. Revised for Home:

| Asset | Home use | Treatment | Also appears |
|---|---|---|---|
| **Video** | Course 01 hero plate | **T8′ Vertical Plate**, 9:16, ≤720px CSS wide | Home only |
| **03** herringbone mailbox | Course 02 detail crop | T5, 1:1, 2× magnification | Work index; Services (custom) |
| **10** covered porch, dusk | Course 04 featured | T2 full bleed, 16:9 | Work index |
| **02** brick fireplace + seat wall | Course 04, row 002 preview | T7, 4:5 | Work index |
| **09** brick veneer elevation | Course 04, row 003 preview | T7, 4:5 | Work index; Services (brick) |
| **11** covered patio, wet slab | Course 05 image plate | T4-style tall plate, 3:4 | Work index; Services (concrete) |
| **04** red brick column | Course 06 left plate | T5, 4:5, 2× | Work index; Services (brick) |
| **01** limestone entry | Course 06 right plate | T5, 4:5, 2× | Work index (full frame, T3) |
| **05** CMU raised beds | — | — | Services (block) — leads that section |
| **06** stone + brick pillar | — | — | Contact (single muted image) |
| **07** arched mailbox + rubble | — | — | **About hero** — the honest frame |
| **08** limewashed arch mailbox | — | — | Work index; Services (repair) |

**Home uses 7 of 11 stills. Four images never appear on Home at all**, which is what makes `/work` and `/about` worth visiting. No image appears twice on Home; no two images share a viewport except the Course 06 diptych, which is a deliberate comparison.

**Every image on this page carries a mono spec caption naming a bond pattern and a detail.** There are eight captions on the page. If an image ships without one, the page fails review (system §11.4).

---

## 15. Motion budget audit for this page

| Constraint | Limit | Home |
|---|---|---|
| Scrubbed ScrollTriggers active simultaneously | 2 | **2** (Course 05 string line + image parallax; never overlaps Course 04's parallax) |
| Pinned sections | 1 | **0** — nothing pins on Home |
| Primary motions per viewport | 1 | 1 throughout; verified section by section in §6–§13 |
| Parallax displacement | 8% | Max **7%** (Course 04 featured) |
| Stagger total | 480ms | Max **240ms** (Course 03, six cells at 40ms) |
| Animated properties | `transform`, `opacity`, `clip-path` | Only these three |
| Page transition | ≤900ms | 420ms out + 420ms in, 260ms minimum hold |
| Entrance replay on scroll-back | Forbidden | All entrances `once: true` |

**Reduced motion:** the page renders complete and correct with every animation removed. The string line renders at full height; parallax elements sit at their neutral position; the video shows its graded poster with a labelled play control; all masks resolve instantly. Nothing on this page communicates through motion alone.

---

## 16. Performance notes

- **LCP is the hero headline** — real text, no webfont-blocking render (use `font-display: swap` with a metric-compatible fallback so the headline paints at ~880ms regardless).
- **The video is never on the critical path** (system anti-pattern §52). `preload="metadata"`, poster is a baked WebP/AVIF at ~40KB, video element mounts after first paint. At 2.31MB it is acceptable as-is, but re-encode to two sources: a ~1.1MB VP9/AV1 WebM and the existing H.264 fallback.
- **Autoplay policy:** muted + `playsinline` + `autoplay`. If autoplay is refused, the poster holds and the play control appears. Never a black rectangle.
- **Images:** all crops exported at 2 sizes (1× / 2×) in AVIF with WebP fallback, at their *final rendered dimensions* — the Course 06 detail plates render at ~440px, so do not ship 1600px files into them.
- **Below-the-fold images lazy-load**; the featured plate (Course 04) preloads at low priority once the hero timeline completes.
- Total Home page media budget: **≤ 1.9 MB** including the video's first segment.

---

## 17. Client-supplied facts required before launch

Eleven placeholders. Anything not supplied is **removed, not invented**.

| # | Placeholder | Appears in |
|---|---|---|
| 1 | `[[CLIENT: CITY, ST]]` | Hero technical strip, Course 04 featured overlay |
| 2 | `[[CLIENT: PHONE]]` | Course 07, footer, mobile bottom bar |
| 3 | `[[CLIENT: EMAIL]]` | Footer |
| 4 | `[[CLIENT: SERVICE AREA]]` | Course 07 conditions strip |
| 5 | `[[CLIENT: TYPICAL REPLY TIME]]` | Course 07 conditions strip |
| 6 | `[[CLIENT: YEAR]]` | Footer legal line |
| 7 | `[[CLIENT: LICENCE / LEGAL LINE]]` | Footer legal line |
| 8 | `[[CLIENT: INSTAGRAM HANDLE]]` | Footer link |
| 9 | Project locations for the 4 selected projects | Course 04 |
| 10 | Confirmation that the 4 selected projects may be published | Course 04 |
| 11 | Whether the spec lines in §9.4 and §11.6 are accurate to the actual work | Every caption on the page |

**Item 11 matters most.** The captions are the page's entire craftsmanship argument. A caption that says "rowlock cap" over a photograph of a soldier cap destroys more credibility than having no caption at all. Every spec line in this document is a reading of the photograph and **must be confirmed by the mason before it ships.**

---

## 18. Amendments to the visual design system

To be folded into `brix-visual-design-system.md` at its next version bump:

1. **§5.4 T8 replaced.** "Letterbox Band — the video, 2.4:1" becomes **T8′ Vertical Plate — the video, 9:16, maximum 720px CSS width.** The source is portrait; the letterbox treatment is impossible.
2. **§5.6 distribution map revised** per §14 above. Image 11 cannot take the featured T2 slot; image 10 does.
3. **§1.2 hero exception recorded.** Home's H1 is capped at 160px rather than `display-1`'s 240px maximum, because the longest word must fit the type field. This is a page-level override, not a system change.
4. **§9.7 mobile bottom bar clarified.** The bar appears only after the hero leaves the viewport, and its estimate half demotes to secondary while Course 07 is in view. Both rules exist to preserve "one primary per viewport."
5. **§4.4 centred-moment count for Home: one** (Course 07). One is left unused and should stay unused.

---

## 19. Review checklist for this page

Run before calling Home done. A "no" is a defect.

1. Does the first viewport contain exactly one primary button?
2. Is the video plate ≤720px CSS wide at every breakpoint, and is it never a background?
3. Does the joint line run continuously from the hero's plate edge into Course 02's image edge?
4. Do all eight images carry a mono spec caption naming a bond pattern and a detail?
5. Is red under 5% in every viewport, including Course 07 (measured: ~1.7%)?
6. Are there exactly two scrubbed ScrollTriggers at most at any scroll position?
7. Is there exactly one container break per course — not zero, not two?
8. Does each course butt against its neighbour with a joint, with no section having a soft or faded ending?
9. Is there exactly one centred moment on the page?
10. With `prefers-reduced-motion: reduce` and JavaScript disabled, is the page still complete, legible and navigable?
11. On a 360px screen in daylight, is the phone number reachable within one thumb movement from any scroll position?
12. Has every `[[CLIENT: …]]` been filled with a supplied fact or removed entirely — with nothing guessed?

---

## 20. What was considered and rejected

Recorded so these do not get re-proposed later.

- **Video masked inside the headline letterforms.** Striking, but a 576px source inside 160px letterforms reads soft, it makes the LCP element a canvas or a mask instead of text, and it is the most-copied "premium" effect of the last three years. Rejected on quality and on originality.
- **Full-bleed 16:9 video hero.** Impossible at acceptable sharpness (§0.1).
- **A hero that expands the video to full bleed on scroll.** One scrubbed trigger, easy to build, but it either upscales the source past 2× or crops the porch down to a horizontal sliver. Rejected on quality.
- **A horizontal scrolling work gallery.** Fights the vertical bond metaphor, is poor on touch, and hides content from search. The ledger does more with less.
- **A capabilities marquee.** Endless-scrolling text bands are the current template default and would undo the restraint the rest of the page buys.
- **A testimonials section.** No verified testimonials exist. Anti-pattern §45.
- **A statistics row (years / projects / clients).** No verified numbers exist. Anti-pattern §43. The work is the argument.
- **A visible column-grid overlay in the hero.** Considered as an "architectural" flourish; it is a wireframe cosplaying as a design. One vertical joint does the same job honestly.

---

*End of Home page specification v1.0. Companion to `brix-visual-design-system.md` v1.0. Changes require a version bump and a note of what changed and why.*
