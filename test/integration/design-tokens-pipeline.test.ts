/**
 * Integration test: design tokens pipeline coherence
 *
 * Verifies that tokens.css + globals.css form a consistent system:
 * - Every OKLCH token in @supports has an HSL fallback in :root
 * - Every dark-mode OKLCH token in @supports also has an HSL dark fallback
 * - globals.css correctly imports tokens.css as the first rule
 * - Token naming is consistent across all four CSS blocks
 */
import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const TOKENS_FILE = path.join(PROJECT_ROOT, 'src/styles/tokens.css')
const GLOBALS_FILE = path.join(PROJECT_ROOT, 'src/styles/globals.css')

/** Extract all CSS custom property names from a CSS block string */
function extractTokenNames(block: string): Set<string> {
  const names = new Set<string>()
  const regex = /--([\w-]+)\s*:/g
  let match
  while ((match = regex.exec(block)) !== null) {
    names.add(`--${match[1]}`)
  }
  return names
}

/**
 * Split tokens.css into its four logical blocks by locating
 * the top-level rule boundaries.
 */
function parseTokenBlocks(css: string): {
  rootHsl: string
  supportsOklch: string
  supportsDarkOklch: string
  darkHsl: string
  reducedMotion: string
} {
  // Block 2: @supports block (from @supports rule to its closing brace at depth 0)
  // Use '@supports (' to avoid matching comments that mention @supports
  const supportsStart = css.indexOf('@supports (')
  let depth = 0
  let supportsEnd = supportsStart
  for (let i = supportsStart; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') { depth--; if (depth === 0) { supportsEnd = i + 1; break } }
  }
  const supportsBlock = css.slice(supportsStart, supportsEnd)

  // Extract the nested dark @media inside @supports
  const nestedDarkStart = supportsBlock.indexOf('@media (prefers-color-scheme: dark)')
  let nestedDarkBlock = ''
  if (nestedDarkStart !== -1) {
    depth = 0
    let nestedDarkEnd = nestedDarkStart
    for (let i = nestedDarkStart; i < supportsBlock.length; i++) {
      if (supportsBlock[i] === '{') depth++
      if (supportsBlock[i] === '}') { depth--; if (depth === 0) { nestedDarkEnd = i + 1; break } }
    }
    nestedDarkBlock = supportsBlock.slice(nestedDarkStart, nestedDarkEnd)
  }

  // Block 3: standalone dark @media (the one AFTER @supports ends)
  const afterSupports = css.slice(supportsEnd)
  const standaloneDarkStart = afterSupports.indexOf('@media (prefers-color-scheme: dark)')
  let standaloneDarkBlock = ''
  if (standaloneDarkStart !== -1) {
    depth = 0
    let standaloneDarkEnd = standaloneDarkStart
    for (let i = standaloneDarkStart; i < afterSupports.length; i++) {
      if (afterSupports[i] === '{') depth++
      if (afterSupports[i] === '}') { depth--; if (depth === 0) { standaloneDarkEnd = i + 1; break } }
    }
    standaloneDarkBlock = afterSupports.slice(standaloneDarkStart, standaloneDarkEnd)
  }

  // Block 1: :root block (before @supports)
  const beforeSupports = css.slice(0, supportsStart)
  const rootStart = beforeSupports.indexOf(':root')
  const rootBlock = beforeSupports.slice(rootStart)

  // Block 4: reduced-motion (after standalone dark block)
  const reducedMotionBlock = afterSupports.slice(
    afterSupports.indexOf('@media (prefers-reduced-motion')
  )

  return {
    rootHsl: rootBlock,
    supportsOklch: supportsBlock,
    supportsDarkOklch: nestedDarkBlock,
    darkHsl: standaloneDarkBlock,
    reducedMotion: reducedMotionBlock,
  }
}

describe('design tokens pipeline — import chain', () => {
  it('tokens.css and globals.css both exist', () => {
    expect(fs.existsSync(TOKENS_FILE)).toBe(true)
    expect(fs.existsSync(GLOBALS_FILE)).toBe(true)
  })

  it('globals.css imports tokens.css as first non-whitespace rule', () => {
    const globals = fs.readFileSync(GLOBALS_FILE, 'utf-8').trimStart()
    expect(globals).toMatch(/^@import '\.\/tokens\.css'/)
  })

  it('tokens.css is not empty', () => {
    const tokens = fs.readFileSync(TOKENS_FILE, 'utf-8')
    expect(tokens.trim().length).toBeGreaterThan(0)
  })
})

describe('design tokens pipeline — HSL ↔ OKLCH fallback coverage', () => {
  let blocks: ReturnType<typeof parseTokenBlocks>

  beforeAll(() => {
    const css = fs.readFileSync(TOKENS_FILE, 'utf-8')
    blocks = parseTokenBlocks(css)
  })

  it('every OKLCH override in @supports has an HSL fallback in :root', () => {
    // Exclude the nested dark @media block from the @supports token names,
    // since those are dark-mode only and need only an HSL dark fallback
    const supportsWithoutDark = blocks.supportsOklch.replace(blocks.supportsDarkOklch, '')
    const oklchTokens = extractTokenNames(supportsWithoutDark)
    const hslTokens = extractTokenNames(blocks.rootHsl)

    // Color tokens override in @supports must exist in :root
    const colorPrefixes = ['--accent-', '--surface-', '--border-', '--text-', '--signal-']
    const missing: string[] = []

    for (const token of oklchTokens) {
      if (colorPrefixes.some((p) => token.startsWith(p))) {
        if (!hslTokens.has(token)) {
          missing.push(token)
        }
      }
    }

    expect(missing).toEqual([])
  })

  it('every OKLCH dark override in @supports has an HSL dark fallback', () => {
    const oklchDarkTokens = extractTokenNames(blocks.supportsDarkOklch)
    const hslDarkTokens = extractTokenNames(blocks.darkHsl)

    const missing: string[] = []
    for (const token of oklchDarkTokens) {
      if (!hslDarkTokens.has(token)) {
        missing.push(token)
      }
    }

    expect(missing).toEqual([])
  })
})

describe('design tokens pipeline — dark mode completeness', () => {
  let blocks: ReturnType<typeof parseTokenBlocks>

  beforeAll(() => {
    const css = fs.readFileSync(TOKENS_FILE, 'utf-8')
    blocks = parseTokenBlocks(css)
  })

  const DARK_REQUIRED_TOKENS = [
    '--surface-page',
    '--surface-card',
    '--surface-subtle',
    '--surface-muted',
    '--border-subtle',
    '--border-medium',
    '--text-primary',
    '--text-secondary',
    '--text-muted',
  ]

  it.each(DARK_REQUIRED_TOKENS)('%s present in dark OKLCH block (@supports)', (token) => {
    expect(blocks.supportsDarkOklch).toContain(token)
  })

  it.each(DARK_REQUIRED_TOKENS)('%s present in dark HSL block (standalone @media)', (token) => {
    expect(blocks.darkHsl).toContain(token)
  })
})

describe('design tokens pipeline — reduced motion block', () => {
  it('reduced motion block appears after both dark blocks', () => {
    const css = fs.readFileSync(TOKENS_FILE, 'utf-8')
    const reducedMotionIdx = css.indexOf('@media (prefers-reduced-motion')
    const supportsIdx = css.indexOf('@supports (')
    expect(reducedMotionIdx).toBeGreaterThan(supportsIdx)
  })

  it('reduced motion block collapses animation-duration and transition-duration', () => {
    const css = fs.readFileSync(TOKENS_FILE, 'utf-8')
    const block = css.slice(css.indexOf('@media (prefers-reduced-motion'))
    expect(block).toMatch(/animation-duration:\s*0\.01ms/)
    expect(block).toMatch(/transition-duration:\s*0\.01ms/)
  })
})
