import projets from '../data/projets.json'
import { useGame } from '../context/GameContext'

export default function RapportFinal({ onClose }) {
  const { projetsUtilises, nomJoueur } = useGame()

  const projetsActivés = projets.filter((p) => projetsUtilises.includes(p.id))

  const totalAmende = projetsActivés.reduce((sum, p) => sum + (p.amende || 0), 0)

  const joueursAffectes =
    projetsActivés.length > 0
      ? Math.max(...projetsActivés.map((p) => p.joueursAffectes || 0))
      : 0

  function formatAmende(amount) {
    if (amount >= 1000000000) return `€ ${(amount / 1000000000).toFixed(1)} milliard`
    if (amount >= 1000000) return `€ ${(amount / 1000000).toFixed(0)} million`
    return `€ ${amount.toLocaleString('fr-FR')}`
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.cnilBadge}>CNIL</div>
            <div>
              <div style={styles.headerTitle}>RAPPORT D'INFRACTION OFFICIEL</div>
              <div style={styles.headerSub}>
                Affaire DataMax Divertissement — PDG : {nomJoueur}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>INFRACTIONS COMMISES</div>
            <div style={{ ...styles.statValue, color: '#ff4455' }}>
              {projetsActivés.length}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>AMENDE POTENTIELLE</div>
            <div style={{ ...styles.statValue, color: '#ff8844', fontSize: 22 }}>
              {formatAmende(totalAmende)}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>JOUEURS AFFECTÉS</div>
            <div style={{ ...styles.statValue, color: '#ffaa33' }}>
              {projetsActivés.length === 0 ? '0' : joueursAffectes.toLocaleString('fr-FR')}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>DÉTAIL DES INFRACTIONS</div>

          <div style={styles.projectList}>
            {projetsActivés.length === 0 ? (
              <div style={styles.noProjects}>Aucune infraction enregistrée.</div>
            ) : (
              projetsActivés.map((p) => (
                <div key={p.id} style={styles.projectRow}>
                  <div style={styles.projectLeft}>
                    <div>
                      <div style={styles.projectName}>{p.titre}</div>
                      <div style={styles.projectLoi}>{p.loi}</div>
                    </div>
                  </div>
                  <div style={styles.projectAmende}>{formatAmende(p.amende)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {projetsActivés.length > 0 && (
          <div style={styles.totalBox}>
            <div style={styles.totalLabel}>AMENDE TOTALE ESTIMÉE (ART. 83 RGPD)</div>
            <div style={styles.totalValue}>{formatAmende(totalAmende)}</div>
            <div style={styles.totalNote}>
              Basé sur les sanctions réelles prononcées contre des entreprises ayant commis
              des infractions similaires.
            </div>
          </div>
        )}

        <div style={styles.eduNote}>
          <div style={styles.eduTitle}>CE QUE DIT LA LOI</div>
          <p style={styles.eduText}>
            Le RGPD (Art. 83) prévoit des amendes jusqu'à 4% du chiffre d'affaires mondial
            annuel ou 20 millions d'euros — le montant le plus élevé étant retenu. En Suisse,
            la LPD prévoit des sanctions pénales pouvant atteindre 250 000 CHF avec poursuites
            personnelles contre le dirigeant.
          </p>
        </div>

        <div style={styles.footer}>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,68,85,0.18)'
              e.currentTarget.style.color = '#ff6677'
              e.currentTarget.style.boxShadow =
                '0 0 24px rgba(255,68,85,0.7), inset 0 0 16px rgba(255,68,85,0.18)'
              e.currentTarget.style.textShadow =
                '0 0 12px rgba(255,68,85,1), 0 0 24px rgba(255,68,85,0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,68,85,0.08)'
              e.currentTarget.style.color = '#ff4455'
              e.currentTarget.style.boxShadow =
                '0 0 12px rgba(255,68,85,0.35), inset 0 0 10px rgba(255,68,85,0.08)'
              e.currentTarget.style.textShadow =
                '0 0 8px rgba(255,68,85,0.8), 0 0 16px rgba(255,68,85,0.4)'
            }}
          >
            Fermer le rapport
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 24,
  },
  container: {
    background: '#0a0a14',
    border: '1px solid #3a0010',
    borderRadius: 10,
    width: '100%',
    maxWidth: 680,
    maxHeight: '88vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 30px 100px rgba(0,0,0,0.95), 0 0 60px rgba(180,0,20,0.15)',
    animation: 'fadeIn 0.4s ease',
  },
  header: {
    background: '#080810',
    borderBottom: '1px solid #2a0010',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  cnilBadge: {
    background: 'rgba(200,0,30,0.15)',
    border: '1px solid #660010',
    borderRadius: 6,
    padding: '6px 10px',
    fontSize: 18,
  },
  headerTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: 13,
    color: '#e8e8f5',
    letterSpacing: '0.05em',
  },
  headerSub: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#5a5a7a',
    marginTop: 3,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#5a5a7a',
    cursor: 'pointer',
    fontSize: 16,
    padding: '4px 8px',
  },
  statsRow: {
    display: 'flex',
    gap: 1,
    background: '#050508',
    flexShrink: 0,
  },
  statCard: {
    flex: 1,
    padding: '20px 24px',
    background: '#0a0a14',
    borderRight: '1px solid #1a1a2e',
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 9,
    color: '#4a4a6a',
    letterSpacing: '0.15em',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 700,
    fontSize: 28,
  },
  section: {
    padding: '20px 20px 0',
    overflowY: 'auto',
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 10,
    color: '#6666dd',
    letterSpacing: '0.15em',
    marginBottom: 12,
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  noProjects: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    color: '#4a4a6a',
    textAlign: 'center',
    padding: '20px 0',
  },
  projectRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#080810',
    border: '1px solid #1a1a2e',
    borderRadius: 6,
    padding: '12px 16px',
  },
  projectLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  projectName: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 13,
    color: '#e8e8f5',
  },
  projectLoi: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#4a4a6a',
    marginTop: 3,
  },
  projectAmende: {
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 600,
    fontSize: 13,
    color: '#ff6644',
  },
  totalBox: {
    margin: '16px 20px 0',
    background: 'rgba(180,0,20,0.08)',
    border: '1px solid #660010',
    borderRadius: 6,
    padding: '16px 20px',
    textAlign: 'center',
    flexShrink: 0,
  },
  totalLabel: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 10,
    color: '#aa3333',
    letterSpacing: '0.15em',
    marginBottom: 8,
  },
  totalValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 700,
    fontSize: 32,
    color: '#ff4455',
    marginBottom: 8,
  },
  totalNote: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 11,
    color: '#5a3a3a',
    lineHeight: 1.6,
  },
  eduNote: {
    margin: '12px 20px 0',
    background: 'rgba(102,102,221,0.05)',
    borderLeft: '3px solid #3333aa',
    padding: '12px 16px',
    flexShrink: 0,
  },
  eduTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 10,
    color: '#6666dd',
    letterSpacing: '0.1em',
    marginBottom: 6,
  },
  eduText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    color: '#7a7a9a',
    lineHeight: 1.7,
    margin: 0,
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #1a1a2e',
    display: 'flex',
    justifyContent: 'flex-end',
    flexShrink: 0,
    background: '#080810',
  },
  closeButton: {
    background: 'rgba(255,68,85,0.08)',
    border: '1px solid rgba(255,68,85,0.55)',
    color: '#ff4455',
    padding: '10px 28px',
    borderRadius: 4,
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.1em',
    textShadow: '0 0 8px rgba(255,68,85,0.8), 0 0 16px rgba(255,68,85,0.4)',
    boxShadow: '0 0 12px rgba(255,68,85,0.35), inset 0 0 10px rgba(255,68,85,0.08)',
    transition: 'all 0.2s ease',
  },
}
