import { useState } from 'react'

export default function CloseButton({ onClick, size = 32 }) {
  const [hovered, setHovered] = useState(false)
  const fontSize = Math.round(size * 0.75)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: 0,
        background: 'transparent',
        border: 'none',
        padding: 0,
        color: hovered ? '#ff6677' : '#ff4455',
        fontSize,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
        transform: hovered ? 'scale(1.15)' : 'scale(1)',
        textShadow: hovered
          ? '0 0 12px rgba(255,68,85,0.95), 0 0 24px rgba(255,68,85,0.6)'
          : '0 0 8px rgba(255,68,85,0.7), 0 0 16px rgba(255,68,85,0.35)',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1,
      }}
      title="Fermer"
    >
      ×
    </button>
  )
}
