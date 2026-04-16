import { useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { useSounds } from '../hooks/useSounds'

function fmt(n) {
  return new Intl.NumberFormat('fr-CH').format(n)
}

const DATE_FR = new Date().toLocaleDateString('fr-CH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function EcranFinJournal({ statut }) {
  const { nomJoueur, compteEnBanque, risqueLegal, reset } = useGame()
  const sounds = useSounds()
  const isGameOver = statut === 'game_over'

  useEffect(() => {
    sounds.playNewspaper()
    const t = setTimeout(() => {
      if (isGameOver) sounds.playGameOver()
      else sounds.playVictoire()
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver])

  const headlineColor = isGameOver ? '#8a0000' : '#1a4a1a'
  const headlineText = isGameOver
    ? `ARRESTATION : ${nomJoueur || 'Le PDG'} mis en examen par la CNIL`
    : `SUCCÈS : ${nomJoueur || 'Le PDG'} réalise ${fmt(compteEnBanque)} $ en une semaine`

  const subhead = isGameOver
    ? "Le PDG de DataMax Divertissement visé par une enquête pour violation massive du RGPD"
    : "Le directeur de DataMax Divertissement réalise une semaine record — mais à quel prix ?"

  const article = isGameOver
    ? "L'entreprise DataMax Divertissement a été placée en garde à vue ce vendredi. Les enquêteurs de la CNIL ont mis en lumière des pratiques illicites de collecte et de revente de données personnelles à grande échelle, touchant potentiellement des millions de joueurs."
    : "DataMax Divertissement clôture une semaine exceptionnelle sur le plan financier. Cependant, des voix s'élèvent parmi les associations de défense des données personnelles, qui réclament une transparence accrue sur les méthodes utilisées."

  const legalText = isGameOver
    ? "Le RGPD (Art. 83) prévoit des amendes allant jusqu'à 4% du chiffre d'affaires mondial ou 20 millions d'euros. La nouvelle LPD suisse prévoit des sanctions pénales pouvant atteindre 250 000 CHF."
    : "Même en l'absence de sanction immédiate, les données exploitées appartiennent à de vraies personnes. Le RGPD et la LPD suisse leur garantissent des droits que vous avez choisi d'ignorer cette semaine."

  return (
    <div
      style={{
        ...styles.root,
        background: isGameOver
          ? 'radial-gradient(ellipse at center, #100000 0%, #000000 70%)'
          : 'radial-gradient(ellipse at center, #001000 0%, #000000 70%)',
      }}
    >
      <div style={styles.newspaper}>
        <div style={styles.mastheadTop} />
        <div style={styles.mastheadName}>LA GAZETTE DU NUMÉRIQUE</div>
        <div style={styles.mastheadDivider} />
        <div style={styles.mastheadDate}>Édition Spéciale — {DATE_FR}</div>
        <div style={styles.mastheadDivider} />

        <h1 style={{ ...styles.headline, color: headlineColor }}>{headlineText}</h1>
        <div style={styles.subhead}>{subhead}</div>

        <div style={styles.thinLine} />

        <div style={styles.columns}>
          <div style={styles.col}>
            <p style={styles.body}>{article}</p>
          </div>
          <div style={styles.col}>
            <div
              style={{
                ...styles.legalBox,
                borderLeft: `3px solid ${headlineColor}`,
              }}
            >
              <div style={styles.legalTitle}>⚖️ CE QUE DIT LA LOI</div>
              <p style={styles.legalBody}>{legalText}</p>
            </div>
          </div>
        </div>

        <div style={styles.bilan}>
          <div style={styles.bilanLabel}>BILAN DE LA SEMAINE</div>
          <div style={{ ...styles.bilanValue, color: headlineColor }}>
            ${fmt(compteEnBanque)}
          </div>
          <div style={styles.bilanRisk}>Risque légal final : {risqueLegal}%</div>
        </div>
      </div>

      <button
        onClick={reset}
        style={styles.replay}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#4444aa'
          e.currentTarget.style.color = '#8888cc'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#2a2a4a'
          e.currentTarget.style.color = '#5a5a7a'
        }}
      >
        ↩ Nouvelle Partie
      </button>
    </div>
  )
}

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  newspaper: {
    maxWidth: 580,
    width: '90%',
    background: '#f0ebe0',
    borderRadius: 2,
    boxShadow:
      '0 0 0 1px #8a7a5a, 0 20px 80px rgba(0,0,0,0.9), 4px 4px 0 rgba(0,0,0,0.3)',
    animation: 'slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: 'rotate(-1deg)',
    padding: '40px 48px',
    color: '#1a1a0a',
  },
  mastheadTop: {
    height: 3,
    background: '#1a1a0a',
    marginBottom: 10,
  },
  mastheadName: {
    fontFamily: 'Playfair Display, serif',
    fontWeight: 700,
    fontSize: 11,
    color: '#1a1a0a',
    letterSpacing: '0.4em',
    textAlign: 'center',
  },
  mastheadDivider: {
    height: 1,
    background: '#8a7a5a',
    margin: '8px 0',
  },
  mastheadDate: {
    fontSize: 9,
    color: '#5a4a2a',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headline: {
    fontFamily: 'Playfair Display, serif',
    fontWeight: 900,
    fontSize: 28,
    lineHeight: 1.2,
    marginTop: 16,
  },
  subhead: {
    fontSize: 13,
    color: '#3a3a2a',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 1.4,
  },
  thinLine: {
    height: 1,
    background: '#8a7a5a',
    margin: '14px 0',
  },
  columns: {
    columnCount: 2,
    columnGap: 16,
  },
  col: {
    breakInside: 'avoid',
    marginBottom: 10,
  },
  body: {
    fontSize: 12,
    color: '#2a2a1a',
    lineHeight: 1.7,
  },
  legalBox: {
    background: '#e8e0d0',
    padding: 12,
  },
  legalTitle: {
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.1em',
    marginBottom: 6,
    color: '#1a1a0a',
  },
  legalBody: {
    fontSize: 11,
    color: '#2a2a1a',
    lineHeight: 1.55,
  },
  bilan: {
    textAlign: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #8a7a5a',
  },
  bilanLabel: {
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.15em',
    color: '#3a3a2a',
  },
  bilanValue: {
    fontFamily: 'Playfair Display, serif',
    fontWeight: 700,
    fontSize: 24,
    marginTop: 6,
  },
  bilanRisk: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
    color: '#3a3a2a',
    marginTop: 4,
  },
  replay: {
    marginTop: 32,
    background: 'transparent',
    border: '1px solid #2a2a4a',
    color: '#5a5a7a',
    fontSize: 12,
    letterSpacing: '0.1em',
    padding: '12px 32px',
    borderRadius: 4,
    transition: 'all 0.2s ease',
  },
}
