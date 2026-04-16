import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useSounds } from '../hooks/useSounds'

export default function EcranAccueil() {
  const { setNomJoueur, setStatutJeu } = useGame()
  const sounds = useSounds()
  const [nom, setNom] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nom.trim()) return
    try {
      if (!window._gameAudioCtx) {
        window._gameAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      }
      window._gameAudioCtx.resume()
    } catch (err) {}
    sounds.playLogin()
    setNomJoueur(nom.trim())
    setStatutJeu('boot')
  }

  return (
    <div style={styles.root}>
      <div style={styles.gridOverlay} />
      <div style={styles.scanline} />

      <div style={styles.card}>
        <div style={styles.brandRow}>
          <ShieldAlert
            size={32}
            color="#6666dd"
            style={{ animation: 'pulse-glow-icon 3s infinite' }}
          />
          <div style={styles.brandText}>
            <div style={styles.brandName}>DATAMAX</div>
            <div style={styles.brandSub}>DIVERTISSEMENT</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.statusRow}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>SYSTÈME EN LIGNE</span>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={styles.formLabel}>ACCÈS DIRECTION</div>
          <div style={styles.formSubtitle}>Portail PDG — Confidentiel</div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={styles.inputLabel}>IDENTIFIANT EXÉCUTIF</div>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Entrez votre identifiant..."
            style={{
              ...styles.input,
              borderColor: focused ? '#6666dd' : '#2a2a4a',
              boxShadow: focused ? '0 0 0 3px rgba(102,102,221,0.15)' : 'none',
            }}
          />

          <button
            type="submit"
            disabled={!nom.trim()}
            style={{
              ...styles.button,
              opacity: nom.trim() ? 1 : 0.35,
              cursor: nom.trim() ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (!nom.trim()) return
              e.currentTarget.style.background = 'linear-gradient(135deg, #3a3a8a, #2a2a6a)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(68,68,187,0.4)'
              e.currentTarget.style.color = '#e8e8ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #2a2a6a, #1a1a4a)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.color = '#aaaaee'
            }}
          >
            SE CONNECTER →
          </button>
        </form>

        <div style={styles.divider} />

        <div style={styles.footer}>© 2026 DataMax Corp</div>
        <div style={styles.footer}>Accès non autorisé formellement interdit.</div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    background: '#080810',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(102,102,221,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(102,102,221,0.06) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    background: 'linear-gradient(180deg, transparent, rgba(102,102,221,0.4), transparent)',
    opacity: 0.04,
    pointerEvents: 'none',
    animation: 'scanline 8s linear infinite',
  },
  card: {
    width: 400,
    background: '#0d0d1a',
    border: '1px solid #2a2a4a',
    borderRadius: 8,
    boxShadow: '0 0 60px rgba(68,68,187,0.12), 0 20px 40px rgba(0,0,0,0.6)',
    padding: '48px 40px',
    animation: 'fadeIn 0.6s ease',
    position: 'relative',
    zIndex: 1,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  brandText: { display: 'flex', flexDirection: 'column' },
  brandName: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: 22,
    color: '#e8e8f5',
    letterSpacing: '0.3em',
    lineHeight: 1.1,
  },
  brandSub: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 300,
    fontSize: 10,
    color: '#4a4a6a',
    letterSpacing: '0.5em',
    marginTop: 2,
  },
  divider: {
    height: 1,
    background: '#1a1a2e',
    margin: '24px 0',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#44dd88',
    boxShadow: '0 0 6px #44dd88',
    animation: 'blink 2s infinite',
  },
  statusText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#44dd88',
    letterSpacing: '0.15em',
  },
  formLabel: {
    fontWeight: 500,
    fontSize: 11,
    color: '#4a4a6a',
    letterSpacing: '0.2em',
  },
  formSubtitle: {
    fontWeight: 300,
    fontSize: 13,
    color: '#7a7a9a',
    marginTop: 4,
  },
  inputLabel: {
    fontWeight: 500,
    fontSize: 10,
    color: '#4a4a6a',
    letterSpacing: '0.15em',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    background: '#080810',
    border: '1px solid #2a2a4a',
    color: '#e8e8f5',
    padding: '14px 16px',
    fontSize: 14,
    borderRadius: 4,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  button: {
    width: '100%',
    padding: '14px',
    marginTop: 20,
    background: 'linear-gradient(135deg, #2a2a6a, #1a1a4a)',
    border: '1px solid #4444aa',
    color: '#aaaaee',
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: '0.2em',
    borderRadius: 4,
    transition: 'all 0.2s ease',
  },
  footer: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#2a2a4a',
    textAlign: 'center',
    marginTop: 4,
  },
}
