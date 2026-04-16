import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { useGameEngine } from '../hooks/useGameEngine'
import ProjectCard from './ui/ProjectCard'
import ModaleInfo from './ui/ModaleInfo'

function fmt(n) {
  return new Intl.NumberFormat('fr-CH').format(n)
}

export default function FenetreBusinessManager({ onClose }) {
  const { compteEnBanque } = useGame()
  const { projets } = useGameEngine()
  const [infoProjet, setInfoProjet] = useState(null)

  return (
    <div style={styles.overlay}>
      <div style={styles.window} onClick={(e) => e.stopPropagation()}>
        <div style={styles.titleBar}>
          <div style={styles.title}>Boss Manager — Gestion des Projets</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={styles.titleBalance}>${fmt(compteEnBanque)}</div>
            <button
              onClick={onClose}
              style={styles.closeX}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e8e8f5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a7a')}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>

        <div style={styles.toolbar}>
          <span style={styles.toolbarLeft}>{projets.length} projets disponibles</span>
          <span style={styles.toolbarRight}>Budget disponible: ${fmt(compteEnBanque)}</span>
        </div>

        <div style={styles.list}>
          {projets.map((projet) => (
            <ProjectCard
              key={projet.id}
              projet={projet}
              onInfoClick={() => setInfoProjet(projet)}
            />
          ))}
        </div>
      </div>

      {infoProjet && (
        <ModaleInfo projet={infoProjet} onClose={() => setInfoProjet(null)} />
      )}
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  window: {
    width: 720,
    maxWidth: '92vw',
    maxHeight: '88vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0d0d1a',
    border: '1px solid #2a2a4a',
    borderRadius: 10,
    boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)',
    animation: 'fadeIn 0.2s ease',
    overflow: 'hidden',
  },
  titleBar: {
    height: 44,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    background: '#080810',
    borderBottom: '1px solid #1a1a2e',
    gap: 12,
  },
  closeX: {
    width: 26,
    height: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: '#5a5a7a',
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
    padding: 0,
    borderRadius: 4,
    transition: 'color 0.15s ease',
  },
  title: {
    flex: 1,
    fontWeight: 500,
    fontSize: 13,
    color: '#5a5a7a',
  },
  titleBalance: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
    color: '#44dd88',
  },
  toolbar: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    background: '#0a0a16',
    borderBottom: '1px solid #1a1a2e',
  },
  toolbarLeft: { fontSize: 11, color: '#4a4a6a' },
  toolbarRight: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#44dd88' },
  list: {
    flex: 1,
    overflow: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
}
