import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const light = {
  bg: '#f8f9fa', surface: '#ffffff', border: '#e5e7eb',
  text: '#1a1a1a', muted: '#6b7280', accent: '#6366f1',
  accentBg: '#eef2ff', pill: '#f3f4f6', pillText: '#374151',
  inputBg: '#ffffff', navBg: '#ffffff',
}
const dark = {
  bg: '#0f1117', surface: '#1a1d27', border: '#2d3148',
  text: '#e8e8e8', muted: '#8b92a8', accent: '#818cf8',
  accentBg: '#1e2035', pill: '#13162a', pillText: '#a5b4fc',
  inputBg: '#1a1d27', navBg: '#1a1d27',
}

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const c = isDark ? dark : light

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError('Could not connect to the agent. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const s = {
    app: { minHeight: '100vh', background: c.bg, color: c.text, transition: 'background 0.2s, color 0.2s' },
    nav: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px', borderBottom: `1px solid ${c.border}`,
      background: c.navBg, position: 'sticky', top: 0, zIndex: 10,
    },
    logo: { fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px' },
    logoSpan: { color: c.accent },
    toggle: {
      width: '42px', height: '22px', borderRadius: '11px', border: 'none',
      background: isDark ? c.accent : '#d1d5db', cursor: 'pointer',
      display: 'flex', alignItems: 'center', padding: '3px',
      transition: 'background 0.2s',
    },
    thumb: {
      width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
      transform: isDark ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform 0.2s',
    },
    container: { maxWidth: '740px', margin: '0 auto', padding: '48px 24px' },
    hero: { textAlign: 'center', marginBottom: '36px' },
    h1: { fontSize: '26px', fontWeight: '700', marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: c.muted },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
      background: c.accentBg, color: c.accent,
      marginBottom: '16px', fontWeight: '500',
    },
    searchRow: { display: 'flex', gap: '10px', marginBottom: '32px' },
    input: {
      flex: 1, padding: '13px 18px', borderRadius: '12px',
      border: `1.5px solid ${c.border}`, fontSize: '15px',
      background: c.inputBg, color: c.text, outline: 'none',
      transition: 'border 0.15s',
    },
    btn: {
      padding: '13px 24px', background: c.accent, color: '#fff',
      border: 'none', borderRadius: '12px', fontSize: '15px',
      fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
      opacity: loading ? 0.7 : 1,
    },
    card: {
      background: c.surface, border: `1px solid ${c.border}`,
      borderRadius: '14px', padding: '22px', marginBottom: '14px',
    },
    cardLabel: {
      fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px',
      textTransform: 'uppercase', color: c.accent, marginBottom: '12px',
    },
    answerText: { fontSize: '15px', lineHeight: '1.75', color: c.text },
    sourcesWrap: { display: 'flex', flexDirection: 'column', gap: '8px' },
    sourcePill: {
      display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '13px', padding: '8px 12px', borderRadius: '8px',
      background: c.pill, color: c.pillText,
      border: `1px solid ${c.border}`, textDecoration: 'none',
      wordBreak: 'break-all',
    },
    dot: { width: '7px', height: '7px', borderRadius: '50%', background: c.accent, flexShrink: 0 },
    errorBox: {
      padding: '14px 18px', borderRadius: '10px',
      background: '#fef2f2', border: '1px solid #fecaca',
      color: '#dc2626', fontSize: '14px',
    },
    skeleton: {
      background: isDark ? '#2a2f45' : '#f0f0f0',
      borderRadius: '8px', marginBottom: '10px',
      animation: 'pulse 1.5s infinite',
    },
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <div style={s.logo}>slooze<span style={s.logoSpan}>AI</span></div>
        <button style={s.toggle} onClick={() => setIsDark(!isDark)}>
          <div style={s.thumb} />
        </button>
      </nav>

      <div style={s.container}>
        <div style={s.hero}>
          <div style={s.badge}>
            <span>⚡</span> Challenge A — Web Search Agent
          </div>
          <h1 style={s.h1}>Ask anything. Get real answers.</h1>
          <p style={s.subtitle}>Powered by Tavily Search + Google Gemini ADK</p>
        </div>

        <div style={s.searchRow}>
          <input
            style={s.input}
            placeholder="e.g. What are the latest specs in MacBook this year?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={e => e.target.style.borderColor = c.accent}
            onBlur={e => e.target.style.borderColor = c.border}
          />
          <button style={s.btn} onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        {loading && (
          <>
            <div style={{ ...s.card }}>
              <div style={{ ...s.skeleton, height: '12px', width: '60px' }} />
              <div style={{ ...s.skeleton, height: '14px', width: '100%' }} />
              <div style={{ ...s.skeleton, height: '14px', width: '85%' }} />
              <div style={{ ...s.skeleton, height: '14px', width: '70%' }} />
            </div>
            <div style={{ ...s.card }}>
              <div style={{ ...s.skeleton, height: '12px', width: '60px' }} />
              <div style={{ ...s.skeleton, height: '36px', width: '100%' }} />
              <div style={{ ...s.skeleton, height: '36px', width: '100%' }} />
            </div>
          </>
        )}

        {result && !loading && (
          <>
            <div style={s.card}>
              <div style={s.cardLabel}>Answer</div>
              <div style={s.answerText} className="md-answer"><ReactMarkdown>{result.answer}</ReactMarkdown></div>
            </div>
            <div style={s.card}>
              <div style={s.cardLabel}>Sources ({result.sources.length})</div>
              <div style={s.sourcesWrap}>
                {result.sources.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" style={s.sourcePill}>
                    <div style={s.dot} />
                    {src}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {!result && !loading && !error && (
          <div style={{ textAlign: 'center', color: c.muted, padding: '48px 0', fontSize: '15px' }}>
            Type a question above and press Search or Enter
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
