# Parat — Brand Specification v0.1
*March 2026 — Working document*

---

## 1. Brand Essence

### What Parat is

A preparation platform for people about to hire a lawyer. It takes an overwhelming, disorganised legal situation and turns it into a structured, lawyer-ready case file — before the first consultation.

### The one feeling

**Calm.**

Not power. Not speed. Not delight. Calm. The person arriving at Parat is in the worst stretch of their adult life — an investor suing them, a marriage ending, a landlord threatening eviction. They are not looking for excitement. They are looking for someone or something that can make this feel manageable.

Every design decision flows from this. Whitespace is not aesthetic preference — it is the product working. A restrained palette is not conservatism — it is respect for the user's headspace.

### What Parat is not

- Not a law firm
- Not a chatbot
- Not another AI assistant
- Not a document management tool for lawyers
- Not a product for developers or technical users

### The positioning sentence

*Parat helps you understand your legal situation and walk into your first lawyer meeting prepared — so you spend less time explaining and more time deciding.*

### Brand personality

| Dimension | Parat is | Parat is not |
|---|---|---|
| Tone | Calm, direct, honest | Alarming, aggressive, corporate |
| Register | Adult to adult | Expert to layperson |
| Confidence | Quietly assured | Boastful |
| Warmth | Present but measured | Cheerful or playful |
| Precision | High — specific claims only | Vague benefit statements |

---

## 2. Voice and Copy Principles

### The rules

**Short sentences.** Legal situations are already complex. The copy does not add to that. If a sentence can be cut in two, cut it.

**No AI-tell words.** Seamless, robust, leverage, empower, game-changing, transformative, intuitive, unlock, harness — none of these. They are invisible because overuse has made them meaningless.

**No exclamation points.** Ever. The product deals with serious situations. Exclamation points read as tone-deaf.

**Specific over vague.** "Reduces your first lawyer consultation by up to 60 minutes" not "saves you time." Numbers are earned, not invented — if there is no data yet, omit the number rather than fabricate it.

**Recommend, never replace.** Every piece of copy that touches legal analysis carries an implicit or explicit reminder that Parat is a preparation tool, not legal counsel. This is a legal necessity and also an honest positioning.

### Headline principles

Hero headline: one claim, 6–10 words, no jargon.
- ✅ "Walk into your first lawyer meeting prepared."
- ✅ "Your case, organised. Before the first consultation."
- ❌ "AI-powered legal preparation for modern disputes"
- ❌ "Empowering individuals with intelligent case management"

Section headings: describe what happens, not what the product does.
- ✅ "You upload your documents. We build the timeline."
- ❌ "Powerful document processing features"

### Tagline candidates

*Møt advokaten din forberedt.* (Norwegian — "Meet your lawyer prepared.")
*Ready before the first meeting.*
*From chaos to case file.*
*Prepared. Not panicked.*

**Recommended:** *Ready before the first meeting.* — Works in English globally, echoes the name, zero jargon.

---

## 3. Color System

### Philosophy

One accent. One neutral scale. Signal colors for state only. The accent is warm — the only warm thing in the legal tech landscape — because the user needs to feel like they are being helped by something human, not processed by software.

### Accent

**Muted teal — OKLCH(56% 0.11 168)**

This hue sits between green and cyan on the OKLCH wheel. It reads as calm, grounded, and trustworthy — not clinical, not cold, not the AI default purple-indigo range. It is distinctive in the legal tech category where every competitor uses cool blues and corporate grays.

```css
/* Accent scale */
--accent-100: oklch(94% 0.04 168);   /* tints, highlights */
--accent-300: oklch(75% 0.09 168);   /* hover states */
--accent-500: oklch(56% 0.11 168);   /* PRIMARY — buttons, links, active states */
--accent-700: oklch(40% 0.09 168);   /* pressed states */
--accent-900: oklch(24% 0.06 168);   /* deep emphasis */

/* HSL fallbacks */
--accent-100: hsl(168, 45%, 93%);
--accent-300: hsl(168, 38%, 68%);
--accent-500: hsl(168, 34%, 44%);
--accent-700: hsl(168, 30%, 30%);
--accent-900: hsl(168, 24%, 16%);
```

**Chroma ceiling:** Maximum C = 0.11. This palette is deliberately desaturated. It should never feel vivid or energetic — calm is the goal.

### Neutral scale — light mode (primary)

Parat is a light-mode product. The user is filling in documents, reading case briefs, and sharing outputs with lawyers. Dark mode is supported but secondary.

```css
/* Light mode — warm off-white base, not pure white */
--surface-page:      oklch(98%  0.005 168);  /* #F8FAFA — page background */
--surface-card:      oklch(100% 0.000 168);  /* #FFFFFF — cards, panels */
--surface-subtle:    oklch(96%  0.008 168);  /* #F1F5F4 — subtle fills */
--surface-muted:     oklch(91%  0.010 168);  /* #E5ECEB — borders, dividers */

--border-subtle:     oklch(88%  0.012 168);  /* default border */
--border-medium:     oklch(80%  0.014 168);  /* emphasized border */

--text-primary:      oklch(18%  0.012 168);  /* #1C2422 — near-black, not pure */
--text-secondary:    oklch(44%  0.010 168);  /* #5A706C — supporting text */
--text-muted:        oklch(62%  0.008 168);  /* #879D99 — placeholders, hints */
--text-on-accent:    oklch(98%  0.004 168);  /* text on accent backgrounds */
```

### Neutral scale — dark mode

```css
--surface-page:      oklch(11%  0.010 168);  /* NOT pure black */
--surface-card:      oklch(14%  0.010 168);
--surface-elevated:  oklch(18%  0.008 168);
--surface-overlay:   oklch(22%  0.008 168);
--border-subtle:     oklch(26%  0.008 168);
--text-primary:      oklch(92%  0.006 168);  /* NOT pure white */
--text-secondary:    oklch(62%  0.008 168);
--text-muted:        oklch(44%  0.006 168);
```

### Signal colors

```css
--signal-success: oklch(56% 0.14 145);   /* green */
--signal-warning: oklch(68% 0.13  75);   /* amber */
--signal-error:   oklch(54% 0.16  25);   /* red */
--signal-info:    oklch(56% 0.11 168);   /* same as accent — intentional */

/* HSL fallbacks */
--signal-success: hsl(142, 48%, 40%);
--signal-warning: hsl( 38, 72%, 44%);
--signal-error:   hsl(  4, 60%, 48%);
```

### Accent usage budget

Accent occupies less than 5% of visible pixels on any screen.

```
USE ACCENT FOR:
✅ Primary CTA button (one per viewport)
✅ Active navigation state
✅ Focus rings
✅ Progress indicators and completion states
✅ Key proof figures (one per section maximum)
✅ Hover states on links

NEVER USE ACCENT FOR:
❌ Section fills or large backgrounds
❌ Body text
❌ Decorative borders on cards
❌ Icons that don't indicate interaction
❌ Multiple elements competing per viewport
```

### What the palette should feel like

Squint test: a warm off-white page, deep charcoal text, a single restrained teal thread running through interactive elements. Nothing competes. Nothing shouts. The eye goes to the teal because nothing else wants the attention.

---

## 4. Typography

### Philosophy

Two fonts. The serif carries the brand personality — warmth, seriousness, human intelligence. The sans carries the product information — clean, readable, zero friction. Monospace for all data, case numbers, dates, references. These roles never cross.

### Font selection

| Role | Font | Source | Why |
|---|---|---|---|
| Display | **Instrument Serif** | Google Fonts | Warm, editorial, slightly formal — feels like a well-designed legal document, not a tech product |
| Body / UI | **DM Sans** | Google Fonts | Clean, readable, neutral — disappears when it should, clear when it must |
| Mono | **DM Mono** | Google Fonts | Cohesive with DM Sans, excellent for case IDs, dates, and legal references |

**Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
--font-display: 'Instrument Serif', Georgia, serif;
--font-body:    'DM Sans', system-ui, sans-serif;
--font-mono:    'DM Mono', 'Courier New', monospace;
```

### Type scale

**Body and UI — fixed scale (1.25 ratio, 16px base):**
```css
--text-xs:   0.75rem;    /* 12px — timestamps, metadata, fine print */
--text-sm:   0.875rem;   /* 14px — secondary labels, captions */
--text-base: 1rem;       /* 16px — body copy, UI labels */
--text-lg:   1.125rem;   /* 18px — lead text, card headings */
--text-xl:   1.25rem;    /* 20px — section subheadings */
```

**Display — fluid scale with clamp():**
```css
--text-2xl: clamp(1.5rem,   2.5vw, 1.875rem);  /* 24–30px — section headings */
--text-3xl: clamp(1.875rem, 3.5vw, 2.375rem);  /* 30–38px — page headings */
--text-4xl: clamp(2.25rem,  4.5vw, 3.0rem);    /* 36–48px — major headings */
--text-5xl: clamp(2.75rem,  6.0vw, 3.75rem);   /* 44–60px — hero headline */
```

### Typographic rules

```css
/* Display headings — Instrument Serif */
.display { font-family: var(--font-display); }

h1 {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: 1.15;
  letter-spacing: -0.02em;
  max-width: 18ch;
  color: var(--text-primary);
}

h2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: 1.25;
  letter-spacing: -0.015em;
  max-width: 28ch;
}

h3 {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* Body text */
p {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 62ch;
}

/* All numeric data */
.data, .case-id, .date, .amount, table td {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

/* UI labels */
.label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--text-secondary);
}

/* All-caps category labels */
.label-caps {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
```

### The serif/sans tension

The most distinctive typographic decision is using Instrument Serif for headings in a product context. This is intentional and specific to Parat. It signals: *this is serious, this is human, this is for adults navigating hard situations.* Every other product in this space uses sans-serif throughout. The serif is the brand fingerprint.

In the application UI, the serif appears only on major section headings and case titles — not on UI labels, navigation, or data tables. The contrast between the serif case title and the DM Sans interface around it creates a clear hierarchy that also communicates: *your case is the primary object here, the interface is secondary.*

---

## 5. Layout and Spacing

### Spacing scale

```css
/* Only these values for all margin, padding, gap */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

### Border radius

```css
--radius-sm: 6px;    /* inputs, tags, small badges */
--radius-md: 10px;   /* buttons, small cards */
--radius-lg: 16px;   /* main cards, panels */
--radius-xl: 24px;   /* large containers — use sparingly */
```

### The whitespace principle

Parat is a product where the user is processing difficult information. Cramped layouts increase cognitive load. Every section, card, and panel breathes.

Minimum padding inside cards: `--space-6` (24px) on all sides.
Section vertical rhythm: `--space-24` (96px) between major sections on marketing pages.
Line height on all body text: minimum 1.6.

---

## 6. Logo Direction

### Concept

The Parat logotype uses Instrument Serif for the wordmark — the same font as the product's display headings, reinforcing the brand signature. All lowercase. The single word carries the brand: short, pronounceable in any language, meaning "ready."

**Wordmark:** `parat` — Instrument Serif, regular weight, tracked at -0.02em.

**Mark:** A minimal geometric mark — an abstract interpretation of a checkmark or completion indicator, but restrained. Not a checkmark (too generic), not a gavel (too literally legal). Consider: a simple angular form suggesting a document corner fold, or a pair of clean lines suggesting structure being imposed on chaos.

Recommended exploration: a single diagonal line intersecting a horizontal — abstract, suggests preparation and direction simultaneously. Rendered in the accent teal at 2px stroke weight on a transparent ground.

### Color variants

| Variant | When to use |
|---|---|
| Dark wordmark + teal mark | Light backgrounds — primary |
| Light wordmark + teal mark | Dark backgrounds |
| Single-color dark | Monochrome contexts, print |
| Single-color light | Reversed monochrome |

### What to avoid

- No gradient on the logo
- No drop shadow
- No heavy or bold weight on the wordmark — Instrument Serif Regular only
- No all-caps
- Minimum clear space: equal to the height of the `p` on all sides

---

## 7. UI Application

### Marketing site

**Structure:** Maximum 5 sections above footer. No exceptions.

Recommended section order:
1. **Hero** — one claim, one action, no decoration
2. **Proof strip** — 3–4 specific numbers or facts (not invented yet — scaffold with honest placeholders)
3. **Mechanism** — "Here is how it works" — the three-step process
4. **Evidence** — who it is for, a real scenario
5. **Invitation** — CTA, pricing note, reassurance

**Hero composition:**
- Instrument Serif headline, left-aligned, max 18ch
- DM Sans subheadline, max 52ch, --text-secondary
- Single primary CTA button — teal background, white text, --radius-md
- No hero image or illustration — whitespace and typography only
- No video autoplay

This is the asymmetric, typography-led hero that nobody in legal tech is using. It is the visual signature made explicit.

### Application UI

**Navigation model:** Sidebar (left, 240px fixed) + top bar for workspace context.

The sidebar carries case navigation — the case hierarchy mirrors the data model: Case → Claims → Threads. The sidebar is the product's skeleton; it should feel permanent and stable.

**Color application in app:**
- `--surface-page` as the outer background
- `--surface-card` for all content panels and cards
- `--surface-subtle` for the sidebar background — slightly distinguished from the main canvas
- Accent appears on: active nav item, primary action buttons, progress indicators, completion states, focus rings
- No accent on decorative elements

**Case title treatment:**
The case title in the application — e.g., "Intrava AS — investor dispute" — renders in Instrument Serif, --text-2xl, --text-primary. This is the only serif element in the app UI. It anchors the case as the primary object. Everything else is DM Sans.

**Data and timeline display:**
All dates, reference numbers, case IDs, and legal citations use DM Mono with `font-variant-numeric: tabular-nums`. Never a proportional font on structured data.

---

## 8. Motion

### Principles

Three animation moments maximum per page. The rest is instant.

```css
--motion-instant: 100ms;  /* hover colour changes, focus rings */
--motion-micro:   150ms;  /* toggles, button press */
--motion-reveal:  240ms;  /* panel open, modal enter */
--motion-page:    300ms;  /* route transitions */

/* Easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* elements entering */
--ease-in:  cubic-bezier(0.4, 0, 1, 1);       /* elements leaving */
```

### What animates and what does not

```
ANIMATES:
✅ Sidebar panel expand/collapse — --motion-reveal, slide
✅ Case brief generation progress — linear fill, accent color
✅ New fact added to thread — brief fade-in, --motion-micro
✅ Status badge state change — --motion-micro, cross-fade
✅ Modal/overlay enter — --motion-reveal, fade + 4px translate

DOES NOT ANIMATE:
❌ Page headers
❌ Navigation items on load
❌ Cards on scroll
❌ Background elements
❌ Typography
```

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms; transition-duration: 0.01ms; }
}
```

---

## 9. Iconography

### Style system

```
viewBox:        0 0 24 24
stroke-width:   1.5
stroke-linecap: round
stroke-linejoin: round
fill:           none
color:          currentColor
safe area:      3–21 (never outside this boundary)
```

Consistent with the product's aesthetic: thin, refined, not bold or chunky. These are icons for an adult product, not a consumer app.

### Core icon set required at MVP

| Icon | Concept | Notes |
|---|---|---|
| `case` | Folder with a subtle legal mark | Primary nav item |
| `claim` | Speech bubble with line — allegation concept | Claims section |
| `timeline` | Horizontal line with dots | Timeline thread |
| `evidence` | Document with magnifier | Evidence thread |
| `argument` | Two lines with balance point | Arguments thread |
| `open-question` | Circle with question mark | Open questions |
| `insurance` | Shield with document | Insurance track |
| `upload` | Arrow into tray | Document upload |
| `brief` | Document with lines | Generated brief |
| `lawyer` | Person with document | Lawyer seat |
| `fact` | Pin or anchor | Individual fact |
| `verified` | Circle with check | Verified state |
| `unverified` | Circle with dash | Unverified state |
| `critical` | Triangle with exclamation | Deadline/risk flag |

All icons custom-drawn per the icons.md style system. No Lucide, no Heroicons. The custom icon set is the craft signal.

---

## 10. The Visual Signature — Summary

**Instrument Serif headings in a sans-serif product interface.**

This is the single decision that makes Parat look like Parat and nothing else. In the application, the serif appears only on the case title — the primary object — surrounded entirely by clean DM Sans interface elements. In marketing, it appears in every section heading, giving the product a warmth and seriousness that no competitor in the legal prep space has.

Paired with a muted teal accent that sits outside the AI default color range, generous whitespace that respects the user's headspace, and a copy voice that speaks adult-to-adult without exclamation points or promises it cannot keep — this is a brand that could only be Parat.

---

## 11. Brand Don'ts

- No gradient text
- No purple, indigo, or blue-purple accent
- No hero illustrations or stock photography
- No dark mode as default
- No chatbot bubble or floating help widget in marketing
- No testimonials until there are real ones
- No "Get Started" or "Learn More" as CTA copy
- No exclamation points
- No "AI-powered" in any headline — the product's intelligence is demonstrated, not asserted
- No animation on page load except the single designated hero entrance moment

---

## 12. First Implementation Priorities

When building the first version, implement in this order:

1. Design tokens as CSS custom properties — all tokens, no exceptions
2. Instrument Serif + DM Sans loaded and applied to correct roles
3. Accent teal defined and applied only to permitted elements
4. Spacing scale enforced — no arbitrary pixel values
5. Marketing page hero — typography-led, serif headline, single CTA, zero decoration
6. Application sidebar + case title with serif treatment
7. Custom icon set — minimum 8 icons for MVP screens

---

*Parat Brand Specification v0.1 — Confidential — March 2026*
*To be reviewed alongside the Product Specification before development begins.*
