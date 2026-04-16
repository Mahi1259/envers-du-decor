import { useGame } from '../../context/GameContext'
import { useSounds } from '../../hooks/useSounds'

const NIVEAU_STYLES = {
  FAIBLE: { bg: '#1a3a1a', color: '#44dd88', border: '#336633' },
  MOYEN: { bg: '#3a2a1a', color: '#ffaa33', border: '#664422' },
  ÉLEVÉ: { bg: '#3a1a1a', color: '#ff8844', border: '#663322' },
  CRITIQUE: { bg: '#2a0a0a', color: '#ff4455', border: '#661122' },
}

const NIVEAU_GRADIENTS = {
  FAIBLE: 'linear-gradient(135deg, #1a3a1a, #0d1f0d)',
  MOYEN: 'linear-gradient(135deg, #3a2a1a, #1f1a0d)',
  ÉLEVÉ: 'linear-gradient(135deg, #3a1a1a, #1f0d0d)',
  CRITIQUE: 'linear-gradient(135deg, #4a0a0a, #200505)',
}

const RISK_COLOR = (n) => (n > 35 ? '#ff4455' : n >= 20 ? '#ff8844' : '#ffaa33')

function fmt(n) {
  return new Intl.NumberFormat('fr-CH').format(n)
}

function IosToggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: 52,
        height: 28,
        borderRadius: 14,
        background: on ? '#3a3aaa' : '#1a1a2e',
        border: on ? 'none' : '1px solid #2a2a4a',
        boxShadow: on ? '0 0 10px rgba(100,100,220,0.5)' : 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'all 0.25s ease',
      }}
      aria-label={on ? 'Désactiver' : 'Activer'}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 27 : 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#ffffff',
          transition: 'left 0.25s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}
      />
    </button>
  )
}

export default function ProjectCard({ projet, onInfoClick }) {
  const { compteEnBanque, projetsAchetes, projetsActifs, acheterProjet, toggleProjet } = useGame()
  const sounds = useSounds()
  const isBought = projetsAchetes.includes(projet.id)
  const isActive = projetsActifs.includes(projet.id)
  const canAfford = compteEnBanque >= projet.coutAchat
  const niveau = NIVEAU_STYLES[projet.niveau] ?? NIVEAU_STYLES.FAIBLE
  const isCritique = projet.niveau === 'CRITIQUE'

  const handleBuy = () => {
    sounds.playPurchase()
    acheterProjet(projet)
  }

  const handleToggle = () => {
    if (isActive) sounds.playToggleOff()
    else sounds.playToggleOn()
    toggleProjet(projet.id)
  }

  const renderAction = () => {
    if (!isBought && canAfford) {
      return (
        <button
          onClick={handleBuy}
          style={styles.buyButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #2a6a2a, #1a4a1a)'
            e.currentTarget.style.boxShadow = '0 0 12px rgba(68,221,136,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #1a4a1a, #0d2a0d)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ACHETER — {fmt(projet.coutAchat)}$
        </button>
      )
    }

    if (!isBought && !canAfford) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <button disabled style={styles.lockedButton}>
            🔒 {fmt(projet.coutAchat)}$ requis
          </button>
          <span style={styles.insufficientText}>Fonds insuffisants</span>
        </div>
      )
    }

    if (isBought && isActive) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={styles.labelActive}>ACTIF</span>
            <IosToggle on={true} onClick={handleToggle} />
          </div>
          <span style={styles.earningsText}>+{fmt(projet.revenuQuotidien)}$/j actif</span>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={styles.labelInactive}>INACTIF</span>
        <IosToggle on={false} onClick={handleToggle} />
      </div>
    )
  }

  const cardStyle = isActive
    ? {
        ...styles.card,
        border: '1px solid #4444aa',
        borderLeft: '3px solid #6666dd',
        background: 'linear-gradient(135deg, rgba(30,30,80,0.6), rgba(8,8,20,0.6))',
        boxShadow: '0 0 20px rgba(68,68,187,0.15)',
      }
    : styles.card

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = '#2a2a4a'
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = '#1a1a2e'
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: NIVEAU_GRADIENTS[projet.niveau],
          border: `1px solid ${niveau.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {projet.emoji}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: '#e8e8f5' }}>{projet.titre}</span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              padding: '2px 7px',
              borderRadius: 10,
              background: niveau.bg,
              color: niveau.color,
              border: `1px solid ${niveau.border}`,
              letterSpacing: '0.1em',
              animation: isCritique ? 'pulse-red 2s infinite' : 'none',
            }}
          >
            {projet.niveau}
          </span>
          {onInfoClick && projet.info && (
            <button
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'rgba(102,102,221,0.1)',
                border: '1px solid #3333aa',
                color: '#6666dd',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: 0,
              }}
              onClick={(e) => {
                e.stopPropagation()
                onInfoClick()
              }}
              title="En savoir plus"
            >
              i
            </button>
          )}
        </div>
        <div style={{ fontWeight: 400, fontSize: 11, color: '#5a5a7a', marginBottom: 6 }}>
          {projet.sousTitre}
        </div>
        <div
          style={{
            fontWeight: 400,
            fontSize: 13,
            color: '#8a8aaa',
            lineHeight: 1.7,
            display: 'block',
            overflow: 'visible',
            whiteSpace: 'normal',
            marginBottom: 6,
          }}
        >
          {projet.description}
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: '#4a4a6a',
          }}
        >
          ⚖️ {projet.loi}
        </div>
      </div>

      <div style={styles.divider} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          minWidth: 160,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              fontSize: 12,
              color: '#44dd88',
            }}
          >
            💰 +{fmt(projet.revenuQuotidien)}$/j
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              fontSize: 12,
              color: RISK_COLOR(projet.risqueQuotidien),
            }}
          >
            ⚖️ +{projet.risqueQuotidien}%/j
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a7a' }}>
            🏷️ {projet.coutAchat === 0 ? 'Gratuit' : `${fmt(projet.coutAchat)}$`}
          </span>
        </div>

        {renderAction()}
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    gap: 14,
    padding: 14,
    borderRadius: 8,
    border: '1px solid #1a1a2e',
    background: '#080810',
    transition: 'all 0.2s ease',
    animation: 'fadeIn 0.3s ease',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    background: '#1a1a2e',
  },
  buyButton: {
    padding: '10px 20px',
    borderRadius: 4,
    background: 'linear-gradient(135deg, #1a4a1a, #0d2a0d)',
    border: '1px solid #44aa44',
    color: '#44dd88',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'pulse-green-border 2.2s infinite',
  },
  lockedButton: {
    padding: '10px 20px',
    borderRadius: 4,
    background: '#0d0d18',
    border: '1px solid #1a1a2a',
    color: '#2a2a4a',
    fontWeight: 500,
    fontSize: 11,
    letterSpacing: '0.05em',
    cursor: 'not-allowed',
  },
  insufficientText: {
    fontWeight: 400,
    fontSize: 10,
    color: '#663333',
  },
  labelActive: {
    fontWeight: 600,
    fontSize: 12,
    color: '#8888ee',
    letterSpacing: '0.1em',
  },
  labelInactive: {
    fontWeight: 400,
    fontSize: 12,
    color: '#4a4a6a',
    letterSpacing: '0.1em',
  },
  earningsText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#44dd88',
  },
}
