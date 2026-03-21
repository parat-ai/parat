import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const TOKENS_FILE = path.join(PROJECT_ROOT, 'src/styles/tokens.css')
const GLOBALS_FILE = path.join(PROJECT_ROOT, 'src/styles/globals.css')

function readTokens(): string {
  return fs.readFileSync(TOKENS_FILE, 'utf-8')
}

function readGlobals(): string {
  return fs.readFileSync(GLOBALS_FILE, 'utf-8')
}

describe('design tokens — file presence', () => {
  it('tokens.css exists', () => {
    expect(fs.existsSync(TOKENS_FILE)).toBe(true)
  })

  it('globals.css imports tokens.css before @tailwind directives', () => {
    const globals = readGlobals()
    const importPos = globals.indexOf("@import './tokens.css'")
    const tailwindPos = globals.indexOf('@tailwind')
    expect(importPos).toBeGreaterThan(-1)
    expect(importPos).toBeLessThan(tailwindPos)
  })
})

describe('design tokens — accent scale', () => {
  const ACCENT_STEPS = ['100', '300', '500', '700', '900']

  it.each(ACCENT_STEPS)('--accent-%s defined with HSL fallback in :root', (step) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--accent-${step}:\\s*hsl\\(`))
  })

  it.each(ACCENT_STEPS)('--accent-%s overridden with OKLCH in @supports block', (step) => {
    const tokens = readTokens()
    const supportsBlock = tokens.slice(tokens.indexOf('@supports'))
    expect(supportsBlock).toMatch(new RegExp(`--accent-${step}:\\s*oklch\\(`))
  })

  it('accent-500 OKLCH chroma does not exceed 0.11', () => {
    const tokens = readTokens()
    const match = tokens.match(/--accent-500:\s*oklch\(([^)]+)\)/)
    expect(match).not.toBeNull()
    const parts = match![1].trim().split(/\s+/)
    const chroma = parseFloat(parts[1])
    expect(chroma).toBeLessThanOrEqual(0.11)
  })
})

describe('design tokens — surfaces', () => {
  const SURFACE_TOKENS = ['page', 'card', 'subtle', 'muted']

  it.each(SURFACE_TOKENS)('--surface-%s defined with HSL fallback', (name) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--surface-${name}:\\s*hsl\\(`))
  })

  it.each(SURFACE_TOKENS)('--surface-%s overridden with OKLCH in @supports block', (name) => {
    const tokens = readTokens()
    const supportsBlock = tokens.slice(tokens.indexOf('@supports'))
    expect(supportsBlock).toMatch(new RegExp(`--surface-${name}:\\s*oklch\\(`))
  })

  it.each(SURFACE_TOKENS)('--surface-%s has dark-mode override', (name) => {
    const tokens = readTokens()
    const darkBlock = tokens.slice(tokens.lastIndexOf('@media (prefers-color-scheme: dark)'))
    expect(darkBlock).toMatch(new RegExp(`--surface-${name}:`))
  })
})

describe('design tokens — borders', () => {
  it('--border-subtle has HSL fallback and OKLCH override', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--border-subtle:\s*hsl\(/)
    const supportsBlock = tokens.slice(tokens.indexOf('@supports'))
    expect(supportsBlock).toMatch(/--border-subtle:\s*oklch\(/)
  })

  it('--border-medium has HSL fallback and OKLCH override', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--border-medium:\s*hsl\(/)
    const supportsBlock = tokens.slice(tokens.indexOf('@supports'))
    expect(supportsBlock).toMatch(/--border-medium:\s*oklch\(/)
  })
})

describe('design tokens — text', () => {
  const TEXT_TOKENS = ['primary', 'secondary', 'muted', 'on-accent']

  it.each(TEXT_TOKENS)('--text-%s has HSL fallback', (name) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--text-${name}:\\s*hsl\\(`))
  })

  it.each(TEXT_TOKENS)('--text-%s overridden with OKLCH in @supports block', (name) => {
    const tokens = readTokens()
    const supportsBlock = tokens.slice(tokens.indexOf('@supports'))
    expect(supportsBlock).toMatch(new RegExp(`--text-${name}:\\s*oklch\\(`))
  })
})

describe('design tokens — signal colors', () => {
  const SIGNAL_TOKENS = ['success', 'warning', 'error', 'info']

  it.each(SIGNAL_TOKENS)('--signal-%s has HSL fallback', (name) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--signal-${name}:\\s*hsl\\(`))
  })

  it.each(SIGNAL_TOKENS)('--signal-%s has OKLCH value in @supports block', (name) => {
    const tokens = readTokens()
    const supportsBlock = tokens.slice(tokens.indexOf('@supports'))
    expect(supportsBlock).toMatch(new RegExp(`--signal-${name}:\\s*oklch\\(`))
  })
})

describe('design tokens — font families', () => {
  it('--font-display references instrument-serif var with serif fallback', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--font-display:.*instrument-serif.*serif/)
  })

  it('--font-body references dm-sans var with sans-serif fallback', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--font-body:.*dm-sans.*sans-serif/)
  })

  it('--font-mono references dm-mono var with monospace fallback', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--font-mono:.*dm-mono.*monospace/)
  })
})

describe('design tokens — type scale fixed', () => {
  const FIXED_SIZES = ['xs', 'sm', 'base', 'lg', 'xl']

  it.each(FIXED_SIZES)('--text-%s defined with rem value', (size) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--text-${size}:\\s*[\\d.]+rem`))
  })
})

describe('design tokens — type scale fluid', () => {
  const FLUID_SIZES = ['2xl', '3xl', '4xl', '5xl']

  it.each(FLUID_SIZES)('--text-%s defined with clamp()', (size) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--text-${size}:\\s*clamp\\(`))
  })
})

describe('design tokens — spacing scale', () => {
  const SPACING_STEPS = ['1', '2', '3', '4', '6', '8', '12', '16', '24']

  it.each(SPACING_STEPS)('--space-%s defined with px value', (n) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--space-${n}:\\s*\\d+px`))
  })
})

describe('design tokens — border radius', () => {
  const RADIUS_SIZES = ['sm', 'md', 'lg', 'xl']

  it.each(RADIUS_SIZES)('--radius-%s defined with px value', (size) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--radius-${size}:\\s*\\d+px`))
  })
})

describe('design tokens — motion', () => {
  const MOTION_SPEEDS = ['instant', 'micro', 'reveal', 'page']

  it.each(MOTION_SPEEDS)('--motion-%s defined in ms', (speed) => {
    const tokens = readTokens()
    expect(tokens).toMatch(new RegExp(`--motion-${speed}:\\s*\\d+ms`))
  })

  it('--ease-out defined as cubic-bezier', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--ease-out:\s*cubic-bezier\(/)
  })

  it('--ease-in defined as cubic-bezier', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/--ease-in:\s*cubic-bezier\(/)
  })
})

describe('design tokens — reduced motion', () => {
  it('prefers-reduced-motion block sets animation-duration to 0.01ms', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/prefers-reduced-motion:\s*reduce/)
    expect(tokens).toMatch(/animation-duration:\s*0\.01ms/)
  })

  it('prefers-reduced-motion block sets transition-duration to 0.01ms', () => {
    const tokens = readTokens()
    expect(tokens).toMatch(/transition-duration:\s*0\.01ms/)
  })
})

describe('design tokens — dark mode structure', () => {
  it('has @supports block with nested dark @media', () => {
    const tokens = readTokens()
    const supportsIdx = tokens.indexOf('@supports')
    const supportsBlock = tokens.slice(supportsIdx)
    expect(supportsBlock).toMatch(/@media \(prefers-color-scheme: dark\)/)
  })

  it('has standalone dark @media block for HSL fallbacks', () => {
    const tokens = readTokens()
    const darkMatches = tokens.match(/@media \(prefers-color-scheme: dark\)/g)
    expect(darkMatches).not.toBeNull()
    expect(darkMatches!.length).toBeGreaterThanOrEqual(2)
  })
})
