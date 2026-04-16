import { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext'
import { useSounds } from '../hooks/useSounds'

const SEP = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

const LINES = [
  { text: '  Initialisation du profil exécutif.............. ✓', color: '#00ff41', delay: 200 },
  { text: '  Chargement du tableau de bord revenus........... ✓', color: '#00ff41', delay: 250 },
  { text: '  Connexion aux serveurs de données............... ✓', color: '#00ff41', delay: 250 },
  { text: '  Montage du moteur analytique.................... ✓', color: '#00ff41', delay: 250 },
  { text: '  Contournement des filtres de conformité......... ✓', color: '#ffaa33', delay: 300 },
  { text: '  Désactivation des alertes RGPD.................. ✓', color: '#ffaa33', delay: 300 },
  { text: '  Chargement base de données joueurs (4,2M)....... ✓', color: '#ff4455', delay: 350 },
  { text: '  Accès aux données personnelles accordé.......... ✓', color: '#ff4455', delay: 300 },
  { text: '  Initialisation des protocoles de monétisation... ✓', color: '#ff4455', delay: 300 },
]

const TYPE_SPEED = 4

export default function EcranBoot() {
  const { nomJoueur, setStatutJeu } = useGame()
  const sounds = useSounds()
  const [completedLines, setCompletedLines] = useState([]) // array of { text, color }
  const [currentText, setCurrentText] = useState('')
  const [currentColor, setCurrentColor] = useState('#00ff41')
  const [showFinal, setShowFinal] = useState(false)
  const timeouts = useRef([])

  useEffect(() => {
    try {
      if (!window._gameAudioCtx || window._gameAudioCtx.state === 'closed') {
        window._gameAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      }
      if (window._gameAudioCtx.state === 'suspended') {
        window._gameAudioCtx.resume()
      }
    } catch (e) { }
  }, [])

  useEffect(() => {
    const addTimeout = (cb, ms) => {
      const id = setTimeout(cb, ms)
      timeouts.current.push(id)
    }

    let elapsed = 0

    const runLine = (idx) => {
      if (idx >= LINES.length) {
        addTimeout(() => {
          setShowFinal(true)
          sounds.playBootComplete()
          addTimeout(() => setStatutJeu('en_cours'), 600)
        }, 300)
        return
      }
      const line = LINES[idx]
      addTimeout(() => {
        setCurrentColor(line.color)
        setCurrentText('')
        let charIdx = 0
        const typeChar = () => {
          if (charIdx >= line.text.length) {
            // line complete
            if (line.color === '#00ff41') sounds.playLineComplete()
            else sounds.playOminous()
            setCompletedLines((prev) => [...prev, { text: line.text, color: line.color }])
            setCurrentText('')
            runLine(idx + 1)
            return
          }
          charIdx++
          setCurrentText(line.text.slice(0, charIdx))
          if (charIdx % 5 === 0) sounds.playTyping()
          const id = setTimeout(typeChar, TYPE_SPEED)
          timeouts.current.push(id)
        }
        typeChar()
      }, line.delay)
    }

    runLine(0)

    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={styles.root} className="boot-scanlines">
      <div style={styles.content}>
        <div style={styles.sep}>{SEP}</div>
        <div style={{ ...styles.header, animation: 'terminalGlow 2s infinite' }}>
          {'  DATAMAX DIVERTISSEMENT — Système d\'exploitation v2.1'}
        </div>
        <div style={{ ...styles.header, animation: 'terminalGlow 2s infinite' }}>
          {'  Copyright © 2026 DataMax Corp. Tous droits réservés.'}
        </div>
        <div style={styles.sep}>{SEP}</div>
        <div style={{ height: 16 }} />

        {completedLines.map((line, i) => (
          <div key={i} style={{ ...styles.line, color: line.color }}>
            {line.text}
          </div>
        ))}

        {currentText && !showFinal && (
          <div style={{ ...styles.line, color: currentColor }}>
            {currentText}
            <span style={styles.cursor}>█</span>
          </div>
        )}

        {showFinal && (
          <div style={{ marginTop: 16, animation: 'fadeIn 0.4s ease' }}>
            <div style={styles.sep}>{SEP}</div>
            <div style={{ height: 12 }} />
            <div style={styles.line}>{'  Système prêt.'}</div>
            <div style={{ height: 12 }} />
            <div style={styles.line}>{`  Bienvenue, ${nomJoueur || 'PDG'}.`}</div>
            <div style={styles.line}>{'  Votre session démarre maintenant.'}</div>
            <div style={{ height: 12 }} />
            <div style={styles.sep}>{SEP}</div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    background: '#000000',
    color: '#00ff41',
    fontFamily: 'JetBrains Mono, monospace',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 20,
  },
  content: {
    maxWidth: 600,
    width: '100%',
    padding: 40,
    fontSize: 13,
    lineHeight: 1.7,
  },
  sep: {
    color: '#00ff41',
    whiteSpace: 'pre',
    overflow: 'hidden',
  },
  header: {
    color: '#00ff41',
    fontWeight: 500,
    whiteSpace: 'pre',
  },
  line: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13,
    whiteSpace: 'pre',
    color: '#00ff41',
  },
  cursor: {
    display: 'inline-block',
    marginLeft: 2,
    animation: 'blink 1s steps(2) infinite',
  },
}
