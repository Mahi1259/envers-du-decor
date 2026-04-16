import { useState, useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext'

export default function EcranIntro() {
  const { setStatutJeu } = useGame()
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => setShowSkip(true), 3000)
    return () => clearTimeout(timer)
  }, [started])

  function handleStart() {
    setStarted(true)
    requestAnimationFrame(() => {
      const v = videoRef.current
      if (!v) return
      v.muted = false
      v.volume = 1
      v.play().catch(() => {})
    })
  }

  function goToNext() {
    setFadeOut(true)
    setTimeout(() => setStatutJeu('accueil'), 800)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
    >
      {started && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onEnded={goToNext}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(8,8,16,0.4) 0%, transparent 30%, transparent 60%, rgba(8,8,16,0.95) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 2,
          animation: started ? 'fadeIn 2s ease 4s both' : 'none',
          opacity: started ? undefined : 0,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: 11,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.5em',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          DataMax Divertissement
        </p>
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontWeight: 700,
            fontSize: 54,
            color: '#ffffff',
            letterSpacing: '0.05em',
            marginBottom: 16,
            textShadow: '0 0 40px rgba(102,102,221,0.9), 0 0 80px rgba(102,102,221,0.4)',
          }}
        >
          L'Envers du Décor
        </h1>
      </div>

      {!started && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #14142a 0%, #050510 70%, #000 100%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            DataMax Divertissement
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: 700,
              fontSize: 64,
              color: '#ffffff',
              letterSpacing: '0.05em',
              textShadow: '0 0 40px rgba(102,102,221,0.9), 0 0 80px rgba(102,102,221,0.4)',
              margin: 0,
            }}
          >
            L'Envers du Décor
          </h1>
          <button
            onClick={handleStart}
            style={{
              marginTop: 32,
              padding: '14px 36px',
              border: '1px solid rgba(102,102,221,0.6)',
              borderRadius: 4,
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              background: 'rgba(102,102,221,0.08)',
              boxShadow: '0 0 24px rgba(102,102,221,0.25)',
              animation: 'pulse-glow 2.4s infinite',
              cursor: 'pointer',
            }}
          >
            ▶  Cliquer pour commencer
          </button>
        </div>
      )}

      {started && showSkip && (
        <button
          onClick={goToNext}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)',
            padding: '10px 24px',
            borderRadius: 4,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
            cursor: 'pointer',
            zIndex: 3,
            letterSpacing: '0.1em',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            transition: 'all 0.2s ease',
          }}
        >
          Passer l'intro →
        </button>
      )}
    </div>
  )
}
