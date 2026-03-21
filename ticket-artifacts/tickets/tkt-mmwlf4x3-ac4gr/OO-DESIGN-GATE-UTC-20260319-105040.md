# OO Design Gate — tkt-mmwlf4x3-ac4gr

**Approved:** OO-DESIGN-APPROVED
**Timestamp:** 2026-03-19T10:50:40Z

## Design Goal
Define the complete Parat design token system as CSS custom properties with
correct browser fallback behavior: HSL declared first in :root, OKLCH values
override inside @supports. Dark mode and reduced motion handled explicitly.
All surface semantic tokens resolved for both light and dark contexts.

## Constraints
- Fallback strategy: HSL in :root (all browsers), OKLCH in @supports block
- Accent chroma ceiling: max C=0.11
- No custom Tailwind theme values — CSS custom properties only
- prefers-reduced-motion: all durations → 0.01ms
- Dark mode is secondary (light mode primary per brand spec)
- Ticket 1 (scaffold) is a prerequisite — layout.tsx and globals.css must exist before this ticket is executed

## Existing Code to Reuse
- src/styles/globals.css (created in ticket 1, prerequisite)
  - Modify: add @import './tokens.css' BEFORE @tailwind directives (@import must precede all other rules per CSS spec)
- src/app/layout.tsx (created in ticket 1, prerequisite)
  - Verify: Instrument Serif, DM Sans, DM Mono preconnect links present

## Components
- TokenFile: src/styles/tokens.css — sole owner of all design tokens, structured in four CSS blocks (see layout below)
- GlobalsImport: src/styles/globals.css modification — @import './tokens.css' placed at top of file, before @tailwind base/components/utilities
- SmokeTestPage: src/app/test-tokens/page.tsx — temporary visual verification page (deleted after ticket review, not merged to main)

## Interfaces
(CSS only)

Token naming convention:
- --{category}-{variant}    --accent-500, --surface-card, --text-primary
- --space-{n}               --space-4, --space-12
- --radius-{size}           --radius-md
- --motion-{speed}          --motion-reveal
- --font-{role}             --font-display
- --text-{size}             --text-base, --text-3xl

Fallback mechanism (applied to every OKLCH token):
- Block 1 — :root { HSL values } ← all browsers
- Block 2 — @supports (color: oklch(0% 0 0)) {
  - :root { OKLCH overrides } ← OKLCH-capable browsers
  - @media (prefers-color-scheme: dark) { :root { OKLCH dark overrides } } ← dark + OKLCH
  - }
- Block 3 — @media (prefers-color-scheme: dark) { :root { HSL dark values } } ← dark, non-OKLCH browsers
- Block 4 — @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms; transition-duration: 0.01ms; } }

Surface semantic token dark-mode resolution:
- --surface-subtle dark: oklch(18% 0.008 168) ≈ brand spec surface-elevated
  - sidebar needs to read as elevated above the page, same role as light mode
- --surface-muted dark: oklch(22% 0.008 168) ≈ brand spec surface-overlay
  - muted fills need to feel raised; no other candidate in dark spec
- --border-medium dark: oklch(30% 0.008 168)
  - brand spec defines border-subtle at 26%; medium interpolated one step above
- All other dark tokens per brand spec section 3 verbatim

Token groups to define (both HSL and OKLCH forms where applicable):
- AccentScale: --accent-100/300/500/700/900
- SurfaceLight: --surface-page/card/subtle/muted
- BorderLight: --border-subtle/medium
- TextLight: --text-primary/secondary/muted/on-accent
- SignalColors: --signal-success/warning/error/info
- FontFamilies: --font-display/body/mono
- TypeScaleFixed: --text-xs/sm/base/lg/xl (rem values, no fallback needed)
- TypeScaleFluid: --text-2xl/3xl/4xl/5xl (clamp() values, no fallback needed)
- SpacingScale: --space-1/2/3/4/6/8/12/16/24 (px values, no fallback needed)
- RadiusScale: --radius-sm/md/lg/xl (px values, no fallback needed)
- MotionScale: --motion-instant/micro/reveal/page + --ease-out/ease-in

## Dependencies
- src/styles/tokens.css → (no dependencies)
- src/styles/globals.css → src/styles/tokens.css (one @import line)
- src/app/layout.tsx → src/styles/globals.css (already wired, ticket 1)
- src/app/test-tokens/page.tsx → CSS vars via className (smoke test only)
- All src/components/**/*.tsx → var(--token-name) only, no raw values

## Call Graph
- Browser: layout.tsx → globals.css → @import tokens.css → :root vars available
- SmokeTestPage: renders one element per token group, visually verifiable
- Deletion: test-tokens/page.tsx removed after PLANNER/reviewer sign-off

## Data Ownership
- All tokens declared on :root (light mode defaults, HSL + OKLCH)
- Dark overrides on :root inside media + supports blocks
- Reduced motion override on * inside media block

## File/Class Layout
- src/styles/tokens.css: sole token file — 4 structured CSS blocks
- src/styles/globals.css: modified — @import './tokens.css' added at top of file
- src/app/test-tokens/page.tsx: temporary smoke-test page (delete post-review)
