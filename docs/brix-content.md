# BRIX — Website Content

**Version** 1.0 · **Status** Copy deck, ready for `content/` modules
**Business** BRIX Masonry & Concrete · **Positioning** Brick masonry first; concrete and block secondary
**Feeds** `content/site.ts` · `business.ts` · `pages/*.ts` · `projects.ts` · `services.ts` (§10)

---

## 0. Rules this copy was written under

### 0.1 What is not claimed

Nothing in this document asserts company history, years in business, project counts, awards, certifications, licences, insurance status, service area, customer statistics, guarantees, testimonials, project locations, or named clients. **None of that was supplied, so none of it appears.**

Where a page would conventionally carry such a claim, the copy either states something true about the trade and the material, or the element is absent. It is not padded with a softened version of an unverifiable claim — "years of experience" becomes nothing, not "extensive experience."

### 0.2 The three verified facts

```
Business name    BRIX Masonry & Concrete
Email            brixmasonrycontact@gmail.com
Phone            +1 901-295-6537
```

Plus the client-supplied tagline: *Professional Masonry & Concrete · Brick · Block · Custom Work · Free Estimates.* "Free estimates" is therefore a supplied claim and may be used; nothing else may be inferred from it.

### 0.3 Voice

Short declaratives. Trade vocabulary used correctly, never decoratively. No sentence longer than a line of display type can hold. The register is a **specification**, not a sales letter: a spec says what a thing is and stops.

Banned constructions, because they are the tells: *"With years of experience…"* · *"Your vision, our expertise"* · *"We pride ourselves on…"* · *"No job too big or small"* · *"Built to last"* · *"Quality craftsmanship you can trust"* · *"Turning dreams into reality"* · *"Attention to detail"* as a standalone claim · any sentence beginning *"At BRIX, we…"* · any use of *"solutions," "passionate," "dedicated," "committed to excellence," "unparalleled," "elevate," "seamless."*

### 0.4 The one style rule for large type

Copy set at `display-1`/`display-2` scale reads as **two or three words per line**. Every headline in this deck is written to break cleanly at those widths, and the intended break is shown with a `/`. Line breaks are content decisions here, not layout accidents.

---

## 1. Global

### 1.1 Identity

| Field | Value |
|---|---|
| Name | BRIX Masonry & Concrete |
| Short name | BRIX |
| Tagline (full) | Professional Masonry & Concrete · Brick · Block · Custom Work · Free Estimates |
| Tagline (short, for the rail and OG) | Brick · Block · Concrete |
| Meta description | Brick masonry, block and concrete work. Free estimates. |

### 1.2 Navigation

```
01  HOME
02  WORK
03  SERVICES
04  ABOUT
05  CONTACT
```

### 1.3 CTA labels — the complete sanctioned set

Six labels. Nothing else appears on a button anywhere on the site.

| Label | Tier | Where |
|---|---|---|
| `REQUEST AN ESTIMATE` | Primary | Home hero, Services close, Contact, footer |
| `SEND REQUEST` | Primary | Contact form submit only |
| `SEE THE WORK` | Secondary | Home, Services, About |
| `CALL 901-295-6537` | Secondary / mobile bar | Rail, footer, mobile action bar |
| `WHAT WE LAY` | Ghost | Home → Services |
| `NEXT PROJECT` | Ghost | Work detail → next |

Free estimates are stated as a line of copy beside the CTA, never inside the button label. `REQUEST A FREE ESTIMATE` is one word too long for a 13px tracked button and reads as a coupon.

### 1.4 Recurring micro-copy

| Slot | Copy |
|---|---|
| Estimate note (under primary CTAs) | Estimates are free. |
| Phone label | Call |
| Email label | Email |
| Instagram link | + Instagram |
| Scroll cue | SCROLL |
| Section eyebrow format | `+ 03 / CAPABILITIES` |
| Image caption format | `TITLE` over `BOND / DETAIL` |
| Course counter | `03 / 08` |

---

## 2. HOME

Eight courses. Each carries an eyebrow, a headline, and at most two lines of support.

### 2.1 Hero headline — six options

All are two lines unless noted. The `/` is the break.

| # | Headline | Character | Notes |
|---|---|---|---|
| **A** | **STRUCTURE / IN BRICK** | Architectural, brick-forward | **Recommended.** Two words per line, sets at `wdth 62` without breaking, names the material in the first viewport, and reads as a statement of category rather than a slogan. |
| B | PERMANENT / BY TRADE | Material, absolute | The strongest-sounding of the six, but it does not name brick — it needs the sub-line to carry positioning. Use if the technical strip is doing that work. |
| C | BRICKWORK / THAT HOLDS / THE LINE | Craft, three lines | Closest to the brief's example. Three lines at `display-1` occupies most of a 900px viewport; use only if the video plate moves below the fold on desktop. |
| D | LAID / TO THE LINE | Trade vocabulary | Correct and specific — masons lay to a line. Slightly inside-baseball for a first viewport. |
| E | PLUMB / LEVEL / TRUE | Trade, three lines | Excellent typographically, three short words at massive scale. Says nothing about brick. Best as a Course 02 statement rather than the hero. |
| F | BRICK / BLOCK / CONCRETE | Plain, descriptive | Maximum clarity, minimum voice. The safe option if the client wants the services named in the largest type on the site. |

**Recommended set:** hero **A**, with **E** relocated to Course 02 as the argument statement.

### 2.2 Hero supporting copy

Sub-line, one sentence, sits under the headline at `body-lg`:

> Brick masonry, block and concrete. Laid straight, jointed clean, finished square.

Alternate, shorter:

> Brick first. Block and concrete where the job calls for it.

**Technical strip** (mono, under the sub-line — the work-order line):

```
BRICK / BLOCK / CONCRETE        FREE ESTIMATES        901-295-6537
```

**Hero CTA:** `REQUEST AN ESTIMATE` · secondary `SEE THE WORK` · note *Estimates are free.*

### 2.3 Course 02 — The Argument

```
Eyebrow    + 02 / MATERIAL
Headline   PLUMB / LEVEL / TRUE
```

Support (two lines maximum, cols 8–11):

> Paint fades. Framing moves. Brick stays where it is set.
>
> That is the whole reason to build in masonry, and it is the standard the work is held to.

CTA: `WHAT WE LAY` (ghost, to Services)

**Alternate statement** if the client prefers plainer language: *BRICK / OUTLASTS / THE HOUSE* — with support: "Masonry is the part of a build nobody redoes. It is worth laying correctly the first time."

### 2.4 Course 03 — What We Lay

```
Eyebrow    + 03 / CAPABILITIES
Headline   WHAT WE LAY
```

Six cells, one course. Each is an index, a name, and a two-line spec:

| # | Name | Spec line |
|---|---|---|
| 01 | BRICK | Veneer, columns, mailboxes |
| 02 | BLOCK | Footings, retaining, structural |
| 03 | STONE | Veneer, pillars, caps |
| 04 | CONCRETE | Slabs, drives, flatwork |
| 05 | OUTDOOR | Fire pits, patios, knee walls |
| 06 | CUSTOM | Arches, detail work, one-offs |

No supporting paragraph. The band is the content — six words and twelve spec words is the entire section, and that restraint is what makes it read as a capability list rather than a services pitch.

### 2.5 Course 04 — Selected

```
Eyebrow    + 04 / SELECTED
Headline   RECENT / WORK
Support    A record of the work, photographed on site.
```

Featured plate caption:

```
COVERED PATIO, BRICK AND SLAB
RUNNING BOND / POURED SLAB
```

Three ledger rows follow (titles and specs in §3.3). CTA: `SEE THE WORK`.

### 2.6 Course 05 — Method

```
Eyebrow    + 05 / METHOD
Headline   HOW THE / WORK RUNS
```

Four steps. Each is a numbered title and one sentence — never more.

| # | Step | Copy |
|---|---|---|
| 01 | ESTIMATE | You describe the job. We look at it, measure it, and quote it. No charge. |
| 02 | LAYOUT | Lines, levels and material set before a single unit is laid. |
| 03 | LAY | The work goes in — footing, course, joint, cap, in that order. |
| 04 | FINISH | Joints tooled, site cleared, work left as it will stand. |

Support line under the headline:

> Four stages. The order does not change, because masonry does not allow it to.

### 2.7 Course 06 — Material

```
Eyebrow    + 06 / DETAIL
Headline   THE JOINT / IS THE WORK
```

Support:

> Anyone can stack units. The joint is where the difference shows — width, depth, tooling, consistency across a whole elevation.

Two plates, brick and stone, with their captions (§3.3).

**Alternate headline:** `CLOSE / ENOUGH / ISN'T` — sharper, slightly combative; use only if the client's voice supports it.

### 2.8 Course 07 — The Estimate

```
Eyebrow    + 07 / ESTIMATE
Headline   TELL US / THE JOB
```

Support:

> Send the details and a photo if you have one. We will come back with a number.
>
> Estimates are free.

Alternate contact block:

```
Call     901-295-6537
Email    brixmasonrycontact@gmail.com
```

**Conditions strip** (mono, under the form) — written to hold true without a supplied service area:

```
FREE ESTIMATES        BRICK · BLOCK · STONE · CONCRETE        [[CLIENT: SERVICE AREA]]
```

If the service area is never supplied, the third cell is removed and the strip runs two cells. It is not replaced with a vague substitute like "local area."

### 2.9 Course 08 — Footer

See §8.
---

## 3. WORK

### 3.1 Page intro

```
Eyebrow    + 02 / WORK
Headline   THE / RECORD
```

Support (cols 8–11, two lines):

> Photographs from site, not a portfolio shoot. Cropped to the work and captioned with what it is.

Alternate, shorter: *Work as it was left. Photographed on site.*

**This intro is doing real strategic work.** The images are phone photographs, and saying so plainly converts the site's biggest apparent weakness into its credibility. It is also entirely factual — no claim is made beyond "these are photographs of the work."

### 3.2 Project titles — the naming rule

Every title **describes what is in the frame**: element, material, and nothing else. No project names, no client names, no street or neighbourhood, no year, no cost, no duration.

`STONE COLUMN PORCH ENTRY` — a description of the photograph.
~~`The Henderson Residence`~~ — invented, and forbidden.

### 3.3 The eleven records

Titles are final. **Spec lines ship in the "default" column; the "verified" column is an upgrade to be filled in only after each bond pattern is confirmed against the photograph** (§9.2).

| # | Title | Category | Spec line (default — ships now) | Spec line (after verification) |
|---|---|---|---|---|
| 001 | STONE COLUMN PORCH ENTRY | STONE | STONE VENEER / COLUMN AND CAP | `[bond] / COLUMN AND CAP` |
| 002 | BRICK MAILBOX AND PLANTER | BRICK | BRICK / MAILBOX AND PLANTER | `RUNNING BOND / SOLDIER COURSE` |
| 003 | ARCHED BRICK MAILBOX | BRICK | BRICK / ARCH AND INSET PANEL | `[bond] / HERRINGBONE INSET` |
| 004 | RED BRICK MAILBOX COLUMN | BRICK | BRICK / COLUMN AND CAP | `RUNNING BOND / ROWLOCK CAP` |
| 005 | BLOCK FIRE PIT AND RAISED BEDS | BLOCK | BLOCK / FIRE PIT AND BEDS | `[bond] / CAPPED COURSE` |
| 006 | STONE PILLAR WITH ADDRESS PLAQUE | STONE | STONE / PILLAR AND PLAQUE | `[bond] / SET PLAQUE` |
| 007 | ARCHED BRICK MAILBOX, IN PROGRESS | BRICK | BRICK / ARCH, SITE CONDITION | `[bond] / ARCH, SITE CONDITION` |
| 008 | LIMEWASHED ARCHED MAILBOX | BRICK | BRICK, LIMEWASHED / ARCH | `[bond] / LIMEWASH FINISH` |
| 009 | BRICK VENEER ELEVATION | BRICK | BRICK VENEER / FULL ELEVATION | `RUNNING BOND / FULL ELEVATION` |
| 010 | COVERED PORCH, BRICK KNEE WALL | BRICK | BRICK / KNEE WALL AND COLUMNS | `[bond] / ROWLOCK CAP` |
| 011 | COVERED PATIO, BRICK AND SLAB | BRICK / CONCRETE | BRICK AND CONCRETE / PATIO SLAB | `[bond] / POURED SLAB` |

**Seven of eleven records are brick-led**, which delivers the brick-first positioning through evidence rather than assertion. That ratio is the strongest positioning tool available and it costs no copy at all.

### 3.4 Ledger row format

```
004    RED BRICK MAILBOX COLUMN    BRICK    →
```

Index · title · category · apex. No dates, no locations, no "view project" label — the row is the link.

### 3.5 Project detail page

```
Eyebrow    + 004
Headline   RED BRICK / MAILBOX COLUMN
Spec       BRICK / COLUMN AND CAP
```

Body — **two sentences maximum**, describing only what is visible:

> Brick column with a capped top and a set mailbox surround. Laid in full brick with a finished joint on every exposed face.

**No project detail page carries a client, a location, a date, a budget, a duration, or a scope-of-works narrative.** If the client later supplies those per project, the field exists in the data structure (§10.4) and the template renders it. Until then the page is a plate, a title, a spec and two sentences — which is a legitimate architectural-monograph format, not a placeholder.

CTA: `NEXT PROJECT` · secondary `REQUEST AN ESTIMATE`

### 3.6 Empty and edge copy

| State | Copy |
|---|---|
| Project not found | `NOT / FOUND` · "That project is not here. The full record is on the work page." · CTA `SEE THE WORK` |
| 404 (site) | `NO / SUCH / PAGE` · "The page is not here. Start again from the front." · CTA `HOME` |

---

## 4. SERVICES

### 4.1 Page intro

```
Eyebrow    + 03 / SERVICES
Headline   WHAT WE / BUILD IN
```

Support:

> Brick first. Block, stone and concrete where the job calls for them.

This sentence is the positioning statement for the whole site. It names brick as the primary trade and the rest as secondary without diminishing them, and it does it in eleven words.

### 4.2 The Elevation — six services, bottom-up

The Services page builds a wall section as you scroll (architecture §12), so the services are ordered by **construction sequence**, not by importance. Brick sits at the centre of the wall, which is where brick actually sits.

| Course | # | Service | One-line statement | Detail |
|---|---|---|---|---|
| 1 (base) | 01 | CONCRETE | Flatwork and footings. | Slabs, driveways, walkways, patios, and the footings everything else is laid on. Formed, poured, and finished level. |
| 2 | 02 | BLOCK | Structure below the finish. | Footings, foundation courses, retaining walls and structural block. The part of the job that is covered up and has to be right. |
| 3 | 03 | BRICK | The primary trade. | Veneer, columns, mailboxes, knee walls, arches and elevations. Laid to a line, jointed consistently, capped square. |
| 4 | 04 | STONE | Veneer and set pieces. | Stone veneer, pillars, caps and plaque settings. Fitted and pointed by hand. |
| 5 | 05 | OUTDOOR | Structures that live outside. | Fire pits, patios, knee walls, planters and raised beds. Built in the same materials as the house they sit beside. |
| 6 (cap) | 06 | CUSTOM | One-offs and detail work. | Arches, inset patterns, limewash finishes, matched repairs and anything drawn rather than ordered. |

**Brick is course 03 — the centre of the elevation, the largest course in the drawing, and the only service whose statement declares its own status** ("The primary trade"). Position, scale and copy all carry the same message.

### 4.3 Service copy rules

- Each service is **one statement line plus one detail sentence.** Never a paragraph, never a bullet list of twenty keywords.
- Every capability named is evidenced by a photograph in the set, with one exception: **matched repairs** under CUSTOM. Flagged for client confirmation (§9.1).
- No pricing, no timelines, no "starting from," no process promises beyond the four stages already stated on Home.

### 4.4 Services page close

```
Headline   NOT / ON THE LIST
Support    If it is masonry or concrete, ask. The estimate is free either way.
CTA        REQUEST AN ESTIMATE
```

This replaces the usual "custom solutions for every need" filler with a sentence that actually invites a phone call.
---

## 5. ABOUT

### 5.1 The problem this page has

An About page conventionally runs on history, headcount, years, and a founder story — **every one of which is unavailable.** Writing around that with vague warmth ("we've been passionate about masonry for as long as we can remember") is worse than saying nothing, because it reads as evasion to exactly the audience this site is for.

So the page is not about the company's past. **It is about the work and the standard**, which is verifiable, and about the photographs, which are honest. That is a stronger About page than most contractors have, and it does not require a single unverifiable sentence.

### 5.2 Page intro

```
Eyebrow    + 04 / ABOUT
Headline   MASONRY / IS A TRADE
```

Support:

> It is learned by laying, and it shows in the joint. That is the entire pitch.

### 5.3 Statement block

```
Headline   THE PART / NOBODY / REDOES
```

Body — three short paragraphs, none longer than two sentences:

> Most of a house can be changed. Paint, fixtures, cabinets, floors — all of it comes out eventually.
>
> Masonry does not. A brick column, a footing, a veneer elevation: those get built once, and whatever was done that day is what stands there afterwards.
>
> That is why the work gets laid out before it gets laid, and why the joint gets as much attention as the face.

### 5.4 The honesty block — the page's strongest move

Uses image 07 (the arched mailbox with the rubble pile beside it) at full-bleed.

```
Headline   PHOTOGRAPHED / ON SITE
```

Body:

> These are not staged photographs. They were taken on the job, on a phone, with the site still around them.
>
> Real work looks like this. A clean shot of a finished wall tells you less than an honest one.

Caption on the plate:

```
ARCHED BRICK MAILBOX, IN PROGRESS
BRICK / ARCH, SITE CONDITION
```

### 5.5 Standard block

```
Headline   HOW IT / GETS LEFT
```

Four short lines, mono-numbered, no supporting prose:

```
01   Laid to a line.
02   Jointed consistently across the whole face.
03   Capped and finished square.
04   Site cleared before we leave.
```

### 5.6 About close

```
Headline   BRICK / FIRST
Support    Block, stone and concrete as the job requires.
CTA        SEE THE WORK  ·  REQUEST AN ESTIMATE
```

---

## 6. CONTACT

### 6.1 Page intro

```
Eyebrow    + 05 / CONTACT
Headline   TELL US / THE JOB
```

Support:

> Describe what you want built. A photo of the spot helps. We come back with a number.
>
> Estimates are free.

### 6.2 Direct contact block

```
CALL       901-295-6537
EMAIL      brixmasonrycontact@gmail.com
```

Labelled in mono, values at `h2`. Both are real links (`tel:` and `mailto:`). **No contact form is presented as the only route** — a contractor's customer frequently wants to call, and burying the number below a five-field form loses that job.

### 6.3 What to include prompt

Sits beside the form as a mono list, not as placeholder text:

```
USEFUL TO INCLUDE
+  What you want built
+  Rough size or dimensions
+  A photo of the location
+  When you would like it done
```

### 6.4 Conditions strip

```
FREE ESTIMATES        BRICK · BLOCK · STONE · CONCRETE        [[CLIENT: SERVICE AREA]]
```

Third cell removed entirely if the service area is never supplied.

---

## 7. FORMS

### 7.1 Field set

Five fields, numbered in the work-order convention. Required fields carry a red `+`, never an asterisk.

| # | Label | Placeholder | Helper | Required |
|---|---|---|---|---|
| 01 | NAME | Your name | — | + |
| 02 | EMAIL | you@email.com | — | + |
| 03 | PHONE | 901-000-0000 | Fastest way to reach you | — |
| 04 | PROJECT TYPE | *(chips, no placeholder)* | Select one | + |
| 05 | THE JOB | What you want built, and where | A photo helps — you can send one by email | + |

**Project type chips:** `BRICK` · `BLOCK` · `STONE` · `CONCRETE` · `OUTDOOR` · `CUSTOM`

Chip order matches the Services elevation, so the two pages teach the same vocabulary.

### 7.2 Placeholder rules

Placeholders **describe the expected answer**, never repeat the label. `Your name`, not `Name`. They are hints, not labels — labels sit above the field permanently (design system §7.8), so a placeholder is free to be more specific than the label.

### 7.3 Validation messages

Written as statements of what is missing, not as accusations. No exclamation marks, no "oops," no "please." Set in mono, preceded by a red apex glyph, in off-white — never red text (design system §2.4).

| Field | Condition | Message |
|---|---|---|
| NAME | empty | A name is needed. |
| EMAIL | empty | An email address is needed. |
| EMAIL | malformed | That address is not complete. |
| PHONE | malformed | That number is not complete. |
| PROJECT TYPE | none selected | Select a project type. |
| THE JOB | empty | Describe the job. |
| THE JOB | under 20 characters | A little more detail helps the estimate. |
| Form | submit failed | That did not send. Call 901-295-6537 or email brixmasonrycontact@gmail.com. |
| Form | rate-limited | Too many attempts. Try again shortly. |

The submit-failure message **gives the two working alternatives inline.** A failed contact form on a contractor site is a lost job; the recovery path has to be in the message itself, not on a page the visitor has to find.

### 7.4 Submit states

| State | Button label | Status text |
|---|---|---|
| Idle | `SEND REQUEST` | Estimates are free. |
| Sending | `SENDING` | — |
| Sent | `REQUEST RECEIVED` | We will be in touch. |
| Error | `SEND REQUEST` | *(see the failure message above)* |

**"We will be in touch"** and nothing more. No response-time promise — that would be an unsupplied guarantee.

### 7.5 Accessibility copy

| Slot | Copy |
|---|---|
| Skip link | Skip to content |
| Menu trigger, closed | Open menu |
| Menu trigger, open | Close menu |
| Form progress (live region) | 3 of 4 required fields complete |
| Required marker (screen reader) | required |
| Video (decorative) | *(aria-hidden — no alt text)* |
| Play control | Play video |
| Instagram link | BRIX on Instagram |

---

## 8. FOOTER

### 8.1 Upper course

```
Headline   READY TO / GET A NUMBER
CTA        REQUEST AN ESTIMATE          (note: Estimates are free.)

CALL       901-295-6537
EMAIL      brixmasonrycontact@gmail.com
INSTAGRAM  + Instagram
```

Minimal nav repeat: `HOME · WORK · SERVICES · ABOUT · CONTACT`

### 8.2 The monument

```
BRIX
```

Set at viewport width on the 2px red foundation rule. **No tagline underneath it, no descriptor, no "Masonry & Concrete" repeated at small size.** The wordmark carries the page; adding words beneath it is the one move that would flatten the site's strongest visual moment.

### 8.3 Legal strip

```
BRIX MASONRY & CONCRETE        © 2026        BRICK · BLOCK · CONCRETE
```

Mono, `ink-600`. The year is generated, not typed.

**No privacy-policy or terms link ships until one exists.** A link to a page that has not been written is worse than no link. If the contact form stores submissions, a one-paragraph privacy note becomes required — flagged in §9.1.

---

## 9. What still needs the client

### 9.1 Confirm before launch

| # | Item | Blocks | If never supplied |
|---|---|---|---|
| 1 | Service area | Conditions strip, JSON-LD `areaServed`, local SEO | Third cell of the conditions strip removed; `areaServed` omitted from structured data |
| 2 | Business address | JSON-LD `address`, footer | Omitted entirely — never approximated |
| 3 | Business hours | JSON-LD `openingHours` | Omitted |
| 4 | Instagram handle | Footer link, JSON-LD `sameAs` | Link removed |
| 5 | "Matched repairs" under CUSTOM | Services course 06 detail | Phrase removed from the detail sentence |
| 6 | Licence / insurance status | Nothing currently — **not claimed anywhere** | Stays absent. Only add if documented. |
| 7 | Privacy note | Footer link | Required only if form submissions are stored |
| 8 | Response-time expectation | "We will be in touch" could become specific | Stays as written |

**Nothing on this list blocks the build.** Every item degrades to absence, which is the rule from the Home spec: anything not supplied is removed, not invented.

### 9.2 Verify before launch

**The eleven spec lines.** Each names a material and an element, which is verifiable from the photograph. The bond-pattern upgrade column in §3.3 must be confirmed against each image by someone who can read a bond — **a wrong bond pattern on a masonry site is a worse credibility failure than no bond pattern at all**, because the audience that notices is exactly the audience being courted.

Ship the default column. Upgrade after verification, one record at a time.

---

## 10. Content data structure

The copy above maps directly onto the modules defined in the architecture (§7). Shapes, not values — every string above drops into one of these.

### 10.1 `content/site.ts`

```ts
export const site = {
  name: 'BRIX Masonry & Concrete',
  shortName: 'BRIX',
  tagline: 'Professional Masonry & Concrete · Brick · Block · Custom Work · Free Estimates',
  taglineShort: 'Brick · Block · Concrete',
  description: 'Brick masonry, block and concrete work. Free estimates.',
  url: 'https://…',
  nav: [
    { index: '01', label: 'HOME',     href: '/' },
    { index: '02', label: 'WORK',     href: '/work' },
    { index: '03', label: 'SERVICES', href: '/services' },
    { index: '04', label: 'ABOUT',    href: '/about' },
    { index: '05', label: 'CONTACT',  href: '/contact' },
  ],
} as const
```

### 10.2 `content/business.ts` — the `[[CLIENT]]` surface

```ts
export const business = {
  phone:       { raw: '+19012956537', display: '901-295-6537' },
  email:       'brixmasonrycontact@gmail.com',
  instagram:   '[[CLIENT: INSTAGRAM]]',
  serviceArea: '[[CLIENT: SERVICE AREA]]',
  address:     '[[CLIENT: ADDRESS]]',
  hours:       '[[CLIENT: HOURS]]',
  freeEstimates: true,
} as const
```

Every consumer runs values through `<Fact>` (architecture §7.3), which renders nothing — not the label, not the wrapper — for an unsupplied value. **This is why the copy above never depends on a placeholder to make sense.**

### 10.3 `content/cta.ts`

```ts
export const cta = {
  estimate: 'REQUEST AN ESTIMATE',
  submit:   'SEND REQUEST',
  work:     'SEE THE WORK',
  call:     'CALL 901-295-6537',
  services: 'WHAT WE LAY',
  next:     'NEXT PROJECT',
  note:     'Estimates are free.',
} as const
```

One module, six labels, imported everywhere. Changing a CTA sitewide is a one-line edit — which is the actual test of "easy to replace later."

### 10.4 `content/projects.ts`

```ts
type Project = {
  index: string            // '004'
  slug: string             // 'red-brick-mailbox-column'
  title: string            // 'RED BRICK MAILBOX COLUMN'
  category: Category       // 'BRICK' | 'BLOCK' | 'STONE' | 'CONCRETE'
  spec: string             // 'BRICK / COLUMN AND CAP'
  specVerified?: string    // the bond-pattern upgrade, once confirmed
  body: string             // two sentences, max
  imageId: ImageId         // '04' — resolves through images.generated.ts
  // Optional, only if the client ever supplies them. Absent by default.
  completed?: string
  scope?: string[]
}
```

The optional fields exist so the template can render them the day they arrive, without a schema change or a component edit. They are `undefined` today and nothing renders.

### 10.5 `content/services.ts`

```ts
type Service = {
  index: string        // '03'
  course: number       // 3 — its position in the elevation, bottom-up
  name: string         // 'BRICK'
  statement: string    // 'The primary trade.'
  detail: string       // one sentence
  specLine: string     // 'Veneer, columns, mailboxes'
  imageId: ImageId
  primary?: boolean    // true for BRICK only — drives scale in the elevation
}
```

`primary: true` on brick is the positioning encoded as data: the Elevation component reads it to give course 03 the largest band, and the Home capability grid reads it to lead with brick. **If the client's emphasis ever changes, it is one boolean.**

### 10.6 `content/pages/*.ts`

One module per route, one export per section, typed to that section's props (architecture §2.2). A section never imports content directly — the page manifest passes it in — so replacing copy is editing one object literal, and no component changes.

### 10.7 `content/form.ts`

Labels, placeholders, helpers, chip options and every validation message from §7, in one object. The Zod schema in `lib/form/schema.ts` imports its messages from here, so the client-side error and the server-side error are the same string by construction.
