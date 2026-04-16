import { useState, useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext'

export default function EcranIntro() {
  const { setStatutJeu } = useGame()
  const videoRef = useRef(null)
  const [showSkip, setShowSkip] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    const tryPlay = v.play()
    if (tryPlay && typeof tryPlay.catch === 'function') {
      tryPlay.catch(() => {
        v.muted = true
        setMuted(true)
        v.play().catch(() => {})
      })
    }
  }, [])

  useEffect(() => {
    if (!muted) return
    const unmute = () => {
      const v = videoRef.current
      if (v) {
        v.muted = false
        v.volume = 1
      }
      setMuted(false)
    }
    window.addEventListener('click', unmute, { once: true })
    window.addEventListener('keydown', unmute, { once: true })
    window.addEventListener('touchstart', unmute, { once: true })
    window.addEventListener('pointerdown', unmute, { once: true })
    return () => {
      window.removeEventListener('click', unmute)
      window.removeEventListener('keydown', unmute)
      window.removeEventListener('touchstart', unmute)
      window.removeEventListener('pointerdown', unmute)
    }
  }, [muted])

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
          animation: 'fadeIn 2s ease 4s both',
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

      {showSkip && (
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
