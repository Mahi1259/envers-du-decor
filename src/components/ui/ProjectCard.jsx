import { useGame } from '../../context/GameContext'
import { useSounds } from '../../hooks/useSounds'

const NIVEAU_STYLES = {
  FAIBLE: { bg: '#1f242c', color: '#8a9aae', border: '#343b46' },
  MOYEN: { bg: '#241f18', color: '#b4a47e', border: '#3a3225' },
  ÉLEVÉ: { bg: '#241c18', color: '#b88770', border: '#3a2c25' },
  CRITIQUE: { bg: '#281818', color: '#c46868', border: '#402626' },
}

const NIVEAU_GRADIENTS = {
  FAIBLE: 'linear-gradient(135deg, #1f242c, #12161c)',
  MOYEN: 'linear-gradient(135deg, #241f18, #15110d)',
  ÉLEVÉ: 'linear-gradient(135deg, #241c18, #15100d)',
  CRITIQUE: 'linear-gradient(135deg, #281818, #160c0c)',
}

const RISK_COLOR = (n) => (n > 35 ? '#c46868' : n >= 20 ? '#b88770' : '#b4a47e')

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
        background: on ? '#4d4d77' : '#22222e',
        border: on ? '1px solid #6a6a88' : '1px solid #34343e',
        boxShadow: 'none',
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
            e.currentTarget.style.background = 'linear-gradient(135deg, #2e4530, #1f2e1c)'
            e.currentTarget.style.borderColor = '#6fa078'
            e.currentTarget.style.color = '#c4dcc4'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #1f2e1c, #162216)'
            e.currentTarget.style.borderColor = '#5a8260'
            e.currentTarget.style.color = '#a5c8a5'
          }}
        >
          ACHETER - {fmt(projet.coutAchat)} CHF
        </button>
      )
    }

    if (!isBought && !canAfford) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <button disabled style={styles.lockedButton}>
            {fmt(projet.coutAchat)} CHF requis
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
          <span style={styles.earningsText}>+{fmt(projet.revenuQuotidien)} CHF/j actif</span>
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
      border: '1px solid #2e2e3c',
      borderLeft: '2px solid #5a5a7a',
      background: 'linear-gradient(135deg, rgba(28,28,40,0.55), rgba(10,10,15,0.55))',
      boxShadow: 'none',
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
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          fontSize: 18,
          color: niveau.color,
          flexShrink: 0,
        }}
      >
        {projet.niveau.charAt(0)}
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
              animation: 'none',
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
                background: 'transparent',
                border: '1px solid #44444f',
                color: '#9a9aac',
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
          {projet.loi}
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
              color: '#95bc9c',
            }}
          >
            +{fmt(projet.revenuQuotidien)} CHF/j
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              fontSize: 12,
              color: RISK_COLOR(projet.risqueQuotidien),
            }}
          >
            +{projet.risqueQuotidien}% risque/j
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a7a' }}>
            {projet.coutAchat === 0 ? 'Gratuit' : `${fmt(projet.coutAchat)} CHF`}
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
    background: 'linear-gradient(135deg, #1f2e1c, #162216)',
    border: '1px solid #5a8260',
    color: '#a5c8a5',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
    color: '#aaaad0',
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
    color: '#95bc9c',
  },
}
