'use client'

/**
 * Smoke test page for design tokens.
 * DELETE THIS FILE after ticket review — do not merge to main.
 */
export default function TestTokensPage() {
  return (
    <div style={{ fontFamily: 'var(--font-body)', padding: 'var(--space-8)', background: 'var(--surface-page)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-8)' }}>
        Design Token Smoke Test
      </h1>

      {/* Accent scale */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Accent scale</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {(['100', '300', '500', '700', '900'] as const).map((step) => (
            <div key={step} style={{
              width: '80px', height: '80px', borderRadius: 'var(--radius-md)',
              background: `var(--accent-${step})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
              color: Number(step) >= 500 ? 'var(--text-on-accent)' : 'var(--text-primary)',
            }}>
              {step}
            </div>
          ))}
        </div>
      </section>

      {/* Surfaces */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Surfaces</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['page', 'card', 'subtle', 'muted'].map((name) => (
            <div key={name} style={{
              width: '120px', height: '80px', borderRadius: 'var(--radius-md)',
              background: `var(--surface-${name})`,
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
            }}>
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Borders */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Borders</h2>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', border: '2px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
            border-subtle
          </div>
          <div style={{ padding: 'var(--space-4)', border: '2px solid var(--border-medium)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
            border-medium
          </div>
        </div>
      </section>

      {/* Text scale */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Text — primary, secondary, muted</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>text-primary — DM Sans base (16px)</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>text-secondary — supporting copy</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>text-muted — placeholders, hints (14px)</p>
      </section>

      {/* Type scale fixed */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Type scale — fixed</h2>
        {(['xs', 'sm', 'base', 'lg', 'xl'] as const).map((size) => (
          <p key={size} style={{ fontFamily: 'var(--font-body)', fontSize: `var(--text-${size})`, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
            --text-{size} — The quick brown fox
          </p>
        ))}
      </section>

      {/* Type scale fluid */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Type scale — fluid display</h2>
        {(['2xl', '3xl', '4xl', '5xl'] as const).map((size) => (
          <p key={size} style={{ fontFamily: 'var(--font-display)', fontSize: `var(--text-${size})`, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', lineHeight: '1.15' }}>
            --text-{size}
          </p>
        ))}
      </section>

      {/* Signal colors */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Signal colors</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['success', 'warning', 'error', 'info'].map((name) => (
            <div key={name} style={{
              padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)',
              background: `var(--signal-${name})`,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              color: 'var(--text-on-accent)',
            }}>
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Spacing scale */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Spacing scale</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
          {(['1', '2', '3', '4', '6', '8', '12', '16', '24'] as const).map((n) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ width: `var(--space-${n})`, height: `var(--space-${n})`, background: 'var(--accent-500)', borderRadius: 'var(--radius-sm)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Border radius */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Border radius</h2>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {['sm', 'md', 'lg', 'xl'].map((size) => (
            <div key={size} style={{
              width: '80px', height: '80px',
              borderRadius: `var(--radius-${size})`,
              background: 'var(--surface-muted)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)',
            }}>
              {size}
            </div>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Motion tokens</h2>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {['instant', 'micro', 'reveal', 'page'].map((speed) => (
            <div key={speed} style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)',
              transition: `background var(--motion-${speed}) var(--ease-out)`,
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-subtle)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-card)' }}
            >
              --motion-{speed} (hover me)
            </div>
          ))}
        </div>
      </section>

      {/* Font families */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Font families</h2>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
          font-display — Instrument Serif — Parat case file heading
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
          font-body — DM Sans — UI labels, body copy, navigation
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          font-mono — DM Mono — 2026-03-21 · Case #INV-0042 · NOK 1,250,000
        </p>
      </section>
    </div>
  )
}
