import { useEffect, useState } from 'react'

export default function TutorialOverlay({ step, stepIndex, totalSteps, onNext, onSkip }) {
  const isCenter = step.position === 'center'
  const [highlightBox, setHighlightBox] = useState(null)

  useEffect(() => {
    const update = () => {
      if (!step.highlight) {
        setHighlightBox(null)
        return
      }
      const el = document.getElementById(step.highlight)
      if (!el) {
        setHighlightBox(null)
        return
      }
      const rect = el.getBoundingClientRect()
      setHighlightBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [step])

  const progressPercent = ((stepIndex + 1) / totalSteps) * 100

  return (
    <div style={styles.overlay}>
      <div style={styles.darkOverlay} />

      {highlightBox && (
        <div
          style={{
            position: 'fixed',
            top: highlightBox.top - 8,
            left: highlightBox.left - 8,
            width: highlightBox.width + 16,
            height: highlightBox.height + 16,
            borderRadius: 12,
            border: '2px solid #6666dd',
            boxShadow:
              '0 0 0 4px rgba(102,102,221,0.2), 0 0 30px rgba(102,102,221,0.4)',
            zIndex: 1001,
            pointerEvents: 'none',
            animation: 'iconPulse 1.5s ease infinite',
          }}
        />
      )}

      <div
        style={{
          ...styles.card,
          ...(isCenter ? styles.cardCenter : styles.cardBottomRight),
        }}
      >
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressPercent}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={styles.cardBody}>
          <div style={styles.stepCounter}>
            ÉTAPE {stepIndex + 1} / {totalSteps}
          </div>

          <div style={styles.titleRow}>
            <h2 style={styles.stepTitle}>{step.titre}</h2>
          </div>

          <p style={styles.stepDescription}>{step.description}</p>

          <div style={styles.buttonRow}>
            <button style={styles.skipBtn} onClick={onSkip}>
              Passer le tutoriel
            </button>
            <button style={styles.nextBtn} onClick={onNext}>
              {stepIndex === totalSteps - 1 ? 'Commencer le jeu' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  darkOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 1000,
    pointerEvents: 'all',
  },
  card: {
    position: 'fixed',
    background: '#0d0d1a',
    border: '1px solid #3a3a6a',
    borderRadius: 12,
    width: 420,
    boxShadow:
      '0 25px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(102,102,221,0.1)',
    zIndex: 1002,
    pointerEvents: 'all',
    overflow: 'hidden',
    animation: 'tutorialCardIn 0.3s ease',
  },
  cardCenter: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  cardBottomRight: {
    bottom: 40,
    right: 40,
    top: 'auto',
    left: 'auto',
    transform: 'none',
  },
  progressTrack: {
    height: 3,
    background: '#1a1a2e',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4444bb, #6666dd)',
    borderRadius: '0 2px 2px 0',
  },
  cardBody: {
    padding: '20px 24px 24px',
  },
  stepCounter: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#4a4a6a',
    letterSpacing: '0.2em',
    marginBottom: 12,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  stepTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: 18,
    color: '#e8e8f5',
    margin: 0,
    lineHeight: 1.3,
  },
  stepDescription: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: 13,
    color: '#9a9ab0',
    lineHeight: 1.8,
    margin: '0 0 20px 0',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: '#4a4a6a',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    cursor: 'pointer',
    padding: '8px 0',
    letterSpacing: '0.05em',
    transition: 'color 0.15s ease',
    textDecoration: 'underline',
  },
  nextBtn: {
    background: 'linear-gradient(135deg, #3333aa, #5555cc)',
    border: '1px solid #5555cc',
    color: '#e8e8f5',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    padding: '10px 24px',
    borderRadius: 6,
    letterSpacing: '0.05em',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(85,85,204,0.3)',
  },
}
