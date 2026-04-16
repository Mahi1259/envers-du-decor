export default function ModaleInfo({ projet, onClose }) {
  const { info, titre, emoji } = projet

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.emoji}>{emoji}</span>
            <span style={styles.headerTitle}>{titre}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.section}>
            <div style={styles.sectionLabel}>📖 EXPLICATION</div>
            <div style={styles.explicationBox}>
              <p style={styles.explicationText}>{info.explication}</p>
            </div>
          </div>

          <div style={styles.section}>
            <div style={{ ...styles.sectionLabel, color: '#ffaa33' }}>⚖️ CAS RÉELS</div>
            <div style={styles.exemplesBox}>
              {info.exemples.map((ex, i) => (
                <div key={i} style={styles.exempleRow}>
                  <span style={styles.exempleDot}>●</span>
                  <span style={styles.exempleText}>{ex}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <div style={{ ...styles.sectionLabel, color: '#ff4455' }}>🚨 CONSÉQUENCE LÉGALE</div>
            <div style={styles.consequenceBox}>
              <p style={styles.consequenceText}>{info.consequence}</p>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>
            Source: RGPD, LPD suisse, jurisprudence CNIL 2022–2026
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 24,
  },
  modal: {
    background: '#0d0d1a',
    border: '1px solid #3a3a6a',
    borderRadius: 10,
    width: '100%',
    maxWidth: 620,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 30px 100px rgba(0,0,0,0.9)',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease',
  },
  header: {
    background: '#080812',
    borderBottom: '1px solid #1a1a2e',
    borderRadius: '10px 10px 0 0',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  emoji: { fontSize: 22 },
  headerTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 15,
    color: '#e8e8f5',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#5a5a7a',
    cursor: 'pointer',
    fontSize: 16,
    padding: '4px 8px',
    borderRadius: 4,
    fontFamily: 'Inter, sans-serif',
  },
  body: {
    overflowY: 'auto',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  section: { display: 'flex', flexDirection: 'column', gap: 10 },
  sectionLabel: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 10,
    color: '#6666dd',
    letterSpacing: '0.15em',
  },
  explicationBox: {
    background: 'rgba(102,102,221,0.05)',
    borderLeft: '3px solid #3333aa',
    padding: 16,
    borderRadius: '0 4px 4px 0',
  },
  explicationText: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: 13,
    color: '#b0b0cc',
    lineHeight: 1.8,
    margin: 0,
  },
  exemplesBox: {
    background: 'rgba(255,170,51,0.05)',
    borderLeft: '3px solid #664422',
    padding: 16,
    borderRadius: '0 4px 4px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  exempleRow: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  exempleDot: { color: '#ffaa33', fontSize: 8, marginTop: 5, flexShrink: 0 },
  exempleText: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: 13,
    color: '#9a8a6a',
    lineHeight: 1.6,
  },
  consequenceBox: {
    background: 'rgba(255,68,85,0.08)',
    border: '1px solid #440011',
    borderRadius: 4,
    padding: 14,
  },
  consequenceText: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 13,
    color: '#cc3344',
    lineHeight: 1.6,
    margin: 0,
  },
  footer: {
    borderTop: '1px solid #1a1a2e',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    background: '#080812',
  },
  footerText: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: 10,
    color: '#3a3a5a',
  },
  fermerBtn: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    color: '#7a7a9a',
    padding: '8px 20px',
    borderRadius: 4,
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    cursor: 'pointer',
  },
}
