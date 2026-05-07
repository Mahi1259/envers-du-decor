import { useState } from 'react'
import { useGame } from '../context/GameContext'
import CloseButton from './ui/CloseButton'

function fmt(n) {
  return new Intl.NumberFormat('fr-CH').format(n)
}

export default function FenetreMail({ onClose }) {
  const { inbox, mailsLus, setMailsLus } = useGame()
  const [selectedMail, setSelectedMail] = useState(
    inbox.length > 0 ? inbox[inbox.length - 1] : null
  )

  const isUnread = (mail) => !mailsLus.includes(mail.instanceId ?? mail.id)

  const selectMail = (mail) => {
    setSelectedMail(mail)
    const mailKey = mail.instanceId ?? mail.id
    if (!mailsLus.includes(mailKey)) {
      setMailsLus((prev) => [...prev, mailKey])
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.window}>
        <div style={styles.titleBar}>
          <span style={styles.titleText}>
            Boîte de réception - DataMax OS
          </span>
          <CloseButton onClick={onClose} size={28} />
        </div>

        <div style={styles.body}>
          <div style={styles.listPanel}>
            <div style={styles.listHeader}>
              {inbox.length} message{inbox.length !== 1 ? 's' : ''}
            </div>

            {inbox.length === 0 ? (
              <div style={styles.emptyState}>Aucun message</div>
            ) : (
              [...inbox].reverse().map((mail) => {
                const mailKey = mail.instanceId ?? mail.id
                const selectedKey =
                  selectedMail?.instanceId ?? selectedMail?.id
                const isSelected = selectedKey === mailKey
                return (
                <div
                  key={mailKey}
                  style={{
                    ...styles.mailRow,
                    background: isSelected
                      ? 'rgba(102,102,221,0.1)'
                      : 'transparent',
                    borderLeft: isSelected
                      ? '3px solid #6666dd'
                      : '3px solid transparent',
                  }}
                  onClick={() => selectMail(mail)}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: isUnread(mail) ? '#6666dd' : 'transparent',
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: isUnread(mail) ? 700 : 400,
                        color: isUnread(mail) ? '#e8e8f5' : '#7a7a9a',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mail.expediteur}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: mail.perteArgent > 0 ? '#ff8844' : '#5a5a7a',
                        fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mail.objet}
                    </div>

                    {(mail.perteArgent > 0 || mail.malusRisque > 0) && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        {mail.perteArgent > 0 && (
                          <span style={styles.badgeRed}>
                            -{fmt(mail.perteArgent)} CHF
                          </span>
                        )}
                        {mail.malusRisque > 0 && (
                          <span style={styles.badgeOrange}>
                            +{mail.malusRisque}% risque
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                )
              })
            )}
          </div>

          <div style={styles.contentPanel}>
            {!selectedMail ? (
              <div style={styles.noSelection}>Sélectionnez un message</div>
            ) : (
              <>
                <div style={styles.emailHeader}>
                  <h3 style={styles.emailSubject}>{selectedMail.objet}</h3>
                  <div style={styles.emailMeta}>
                    <div style={styles.avatar}>
                      {selectedMail.expediteur.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.senderName}>{selectedMail.expediteur}</div>
                      <div style={styles.senderEmail}>
                        {selectedMail.expediteur
                          .toLowerCase()
                          .replace(/ /g, '.')}
                        @datamax-internal.corp
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.emailBody}>
                  <p style={styles.emailText}>{selectedMail.contenu}</p>
                </div>

                {(selectedMail.perteArgent > 0 ||
                  selectedMail.malusRisque > 0) && (
                  <div style={styles.impactBox}>
                    <div style={styles.impactTitle}>
                      IMPACT FINANCIER : DÉJÀ APPLIQUÉ
                    </div>
                    <div style={styles.impactRow}>
                      {selectedMail.perteArgent > 0 && (
                        <div style={styles.impactItem}>
                          <div style={styles.impactLabel}>Pertes</div>
                          <div
                            style={{ ...styles.impactValue, color: '#ff4455' }}
                          >
                            -{fmt(selectedMail.perteArgent)} CHF
                          </div>
                        </div>
                      )}
                      {selectedMail.malusRisque > 0 && (
                        <div style={styles.impactItem}>
                          <div style={styles.impactLabel}>Risque ajouté</div>
                          <div
                            style={{ ...styles.impactValue, color: '#ffaa33' }}
                          >
                            +{selectedMail.malusRisque}%
                          </div>
                        </div>
                      )}
                      <div style={styles.impactItem}>
                        <div style={styles.impactLabel}>Statut</div>
                        <div
                          style={{
                            fontSize: 11,
                            color: '#ff8844',
                            marginTop: 4,
                          }}
                        >
                          Débité avant ouverture
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMail.perteArgent === 0 &&
                  selectedMail.malusRisque === 0 && (
                    <div style={styles.infoBox}>
                      <div style={styles.infoTitle}>MESSAGE INFORMATIF</div>
                      <p style={styles.infoText}>
                        Ce message ne génère aucun impact financier ou légal.
                        Il s'agit d'une note de sensibilisation interne.
                      </p>
                    </div>
                  )}
              </>
            )}
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
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 24,
  },
  window: {
    background: '#0d0d1a',
    border: '1px solid #2a2a4a',
    borderRadius: 10,
    width: '100%',
    maxWidth: 920,
    height: '75vh',
    minHeight: 480,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
    animation: 'fadeIn 0.2s ease',
  },
  titleBar: {
    background: '#080810',
    borderBottom: '1px solid #1a1a2e',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  titleText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    color: '#6a6a8a',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  listPanel: {
    width: 280,
    borderRight: '1px solid #1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0,
  },
  listHeader: {
    padding: '8px 14px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#3a3a5a',
    borderBottom: '1px solid #1a1a2e',
    background: '#080810',
  },
  mailRow: {
    display: 'flex',
    gap: 8,
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #0d0d1a',
    transition: 'background 0.15s',
  },
  emptyState: {
    padding: 20,
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    color: '#3a3a5a',
    textAlign: 'center',
  },
  badgeRed: {
    fontSize: 9,
    background: 'rgba(255,68,85,0.15)',
    color: '#ff6655',
    padding: '2px 5px',
    borderRadius: 3,
    fontFamily: 'JetBrains Mono, monospace',
  },
  badgeOrange: {
    fontSize: 9,
    background: 'rgba(255,170,51,0.15)',
    color: '#ffaa33',
    padding: '2px 5px',
    borderRadius: 3,
    fontFamily: 'JetBrains Mono, monospace',
  },
  contentPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  noSelection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    color: '#3a3a5a',
  },
  emailHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #1a1a2e',
    flexShrink: 0,
  },
  emailSubject: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 15,
    color: '#e8e8f5',
    margin: '0 0 12px',
    lineHeight: 1.4,
  },
  emailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#1a1a3a',
    border: '1px solid #3333aa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    color: '#6666dd',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    flexShrink: 0,
  },
  senderName: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    color: '#aaaacc',
  },
  senderEmail: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#3a3a5a',
    marginTop: 2,
  },
  emailBody: {
    padding: '16px 20px',
    overflowY: 'auto',
    flex: 1,
  },
  emailText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    color: '#9a9ab0',
    lineHeight: 1.9,
    margin: 0,
  },
  impactBox: {
    margin: '0 20px 16px',
    background: 'rgba(255,68,85,0.06)',
    border: '1px solid #440011',
    borderRadius: 6,
    padding: '12px 16px',
    flexShrink: 0,
  },
  impactTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 9,
    color: '#aa3333',
    letterSpacing: '0.15em',
    marginBottom: 10,
  },
  impactRow: {
    display: 'flex',
    gap: 24,
  },
  impactItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  impactLabel: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 10,
    color: '#5a3a3a',
    marginBottom: 3,
  },
  impactValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 700,
    fontSize: 18,
  },
  infoBox: {
    margin: '0 20px 16px',
    background: 'rgba(102,102,221,0.05)',
    borderLeft: '3px solid #3333aa',
    padding: '10px 14px',
    borderRadius: '0 4px 4px 0',
    flexShrink: 0,
  },
  infoTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 9,
    color: '#6666dd',
    letterSpacing: '0.1em',
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 11,
    color: '#6a6a9a',
    lineHeight: 1.6,
    margin: 0,
  },
}
