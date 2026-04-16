import { useEffect, useRef, useState } from 'react'
import { Briefcase, Calendar as CalIcon, Trash2 } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useGameEngine } from '../hooks/useGameEngine'
import { useSounds } from '../hooks/useSounds'
import FenetreBusinessManager from './FenetreBusinessManager'

function fmt(n) {
  return new Intl.NumberFormat('fr-CH').format(n)
}

const RISK_COLOR = (r) => (r >= 70 ? '#ff4455' : r >= 40 ? '#ffaa33' : '#44dd88')

export default function BureauOS() {
  const { nomJoueur, nomJour, jourCode, jourActuel, compteEnBanque, risqueLegal, abandonner } =
    useGame()
  const { handleNextDay } = useGameEngine()
  const sounds = useSounds()
  const [windowOpen, setWindowOpen] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [moneyAnim, setMoneyAnim] = useState(false)
  const prevBank = useRef(compteEnBanque)
  const prevRisk = useRef(risqueLegal)

  useEffect(() => {
    if (compteEnBanque !== prevBank.current) {
      setMoneyAnim(true)
      if (compteEnBanque > prevBank.current) sounds.playMoneyUp()
      const t = setTimeout(() => setMoneyAnim(false), 600)
      prevBank.current = compteEnBanque
      return () => clearTimeout(t)
    }
  }, [compteEnBanque, sounds])

  useEffect(() => {
    if (risqueLegal !== prevRisk.current) {
      if (risqueLegal > prevRisk.current) sounds.playRiskUp(risqueLegal)
      prevRisk.current = risqueLegal
    }
  }, [risqueLegal, sounds])

  const onEndDay = () => {
    sounds.playEndDay()
    handleNextDay()
  }

  const riskColor = RISK_COLOR(risqueLegal)
  const riskHigh = risqueLegal >= 70

  return (
    <div style={styles.root}>
      <div style={styles.menuBar}>
        <div style={styles.menuLeft}>🛡️ DataMax OS</div>
        <div style={styles.menuRight}>
          <span>{nomJoueur}</span>
          <span>{nomJour}</span>
          <span>18:15</span>
        </div>
      </div>

      <div style={styles.desktop}>
        <div style={styles.statusRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>COMPTE</div>
            <div
              key={moneyAnim ? 'a' : 'b'}
              style={{
                ...styles.statValue,
                color: '#44dd88',
                animation: moneyAnim ? 'moneyPop 0.6s ease' : 'none',
              }}
            >
              ${fmt(compteEnBanque)}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>JOURNÉE</div>
            <div style={{ ...styles.statValue, fontFamily: 'Inter', fontWeight: 600, fontSize: 20 }}>
              {nomJour}
            </div>
            <div style={styles.statSub}>Jour {Math.min(jourActuel, 5)} / 5</div>
          </div>

          <div
            style={{
              ...styles.statCard,
              animation: riskHigh ? 'pulse-red 1.6s infinite' : 'none',
              borderColor: riskHigh ? '#aa1122' : '#1a1a2e',
            }}
          >
            <div style={styles.statLabel}>RISQUE LÉGAL</div>
            <div style={{ ...styles.statValue, color: riskColor }}>{risqueLegal}%</div>
            <div style={styles.riskBarBg}>
              <div
                style={{
                  ...styles.riskBarFill,
                  width: `${risqueLegal}%`,
                  background: riskColor,
                }}
              />
            </div>
          </div>
        </div>

        <div style={styles.iconColumn}>
          <DesktopIcon
            label="Boss Manager"
            iconBg="linear-gradient(135deg, #3a3aaa, #2a2a6a)"
            iconBorder="#5555cc"
            iconColor="#c0c0ff"
            Icon={Briefcase}
            labelColor="#b0b0cc"
            onClick={() => setWindowOpen(true)}
          />

          <DesktopIcon
            label={
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#66dd88' }}>{jourCode}</span>
                <span style={{ fontWeight: 500, fontSize: 10, color: '#66dd88' }}>Terminer</span>
              </span>
            }
            iconBg="linear-gradient(135deg, #3a6a3a, #2a4a2a)"
            iconBorder="#55aa55"
            iconColor="#b4ffb4"
            Icon={CalIcon}
            hoverShadow="0 0 16px rgba(68,221,136,0.35)"
            labelColor="#66dd88"
            onClick={onEndDay}
          />

          <DesktopIcon
            label="Abandonner"
            iconBg="linear-gradient(135deg, #6a3a3a, #4a2a2a)"
            iconBorder="#aa5555"
            iconColor="#ffb4b4"
            Icon={Trash2}
            hoverShadow="0 0 16px rgba(255,68,85,0.35)"
            labelColor="#ff6677"
            onClick={() => setConfirmQuit(true)}
          />
        </div>
      </div>

      <div style={styles.taskbar}>
        <span style={styles.taskbarText}>DataMax OS v2.1</span>
        <span style={styles.taskbarText}>🔐 Chiffrement actif</span>
      </div>

      {windowOpen && <FenetreBusinessManager onClose={() => setWindowOpen(false)} />}

      {confirmQuit && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalText}>
              Terminer la semaine prématurément ? Vous verrez votre bilan actuel.
            </div>
            <div style={styles.modalButtons}>
              <button
                style={styles.modalCancel}
                onClick={() => setConfirmQuit(false)}
              >
                Annuler
              </button>
              <button
                style={styles.modalConfirm}
                onClick={() => {
                  setConfirmQuit(false)
                  abandonner()
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DesktopIcon({ label, iconBg, iconBorder, iconColor, Icon, onClick, hoverShadow, labelColor }) {
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)
  const scale = pressed ? 0.95 : hover ? 1.08 : 1
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: 96,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        padding: 6,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: iconBg,
          border: `1px solid ${iconBorder}`,
          boxShadow: hover && hoverShadow ? hoverShadow : '0 4px 12px rgba(0,0,50,0.6)',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transition: 'all 0.15s ease',
        }}
      >
        <Icon size={30} color={iconColor} />
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 11,
          color: hover ? '#ffffff' : labelColor || '#b0b0cc',
          textAlign: 'center',
          transition: 'color 0.15s ease',
        }}
      >
        {label}
      </div>
    </button>
  )
}

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#080810',
  },
  menuBar: {
    height: 28,
    background: 'rgba(12,12,22,0.98)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid #2a2a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 14px',
    zIndex: 5,
  },
  menuLeft: { fontWeight: 500, fontSize: 11, color: '#8888aa' },
  menuRight: {
    display: 'flex',
    gap: 16,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    color: '#8888aa',
  },
  desktop: {
    flex: 1,
    position: 'relative',
    background:
      'radial-gradient(ellipse at 30% 40%, rgba(60,60,160,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(100,50,150,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(30,30,80,0.3) 0%, transparent 60%), linear-gradient(180deg, #0e0e1e 0%, #080812 100%)',
    overflow: 'hidden',
  },
  statusRow: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 14,
    zIndex: 2,
  },
  statCard: {
    background: '#141428',
    border: '1px solid #3a3a5a',
    borderRadius: 8,
    padding: '14px 26px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    minWidth: 160,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease',
  },
  statLabel: {
    fontWeight: 600,
    fontSize: 9,
    color: '#8888aa',
    letterSpacing: '0.2em',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 700,
    fontSize: 22,
  },
  statSub: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    color: '#4a4a6a',
    marginTop: 2,
  },
  riskBarBg: {
    width: '100%',
    height: 3,
    background: '#1a1a2e',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    transition: 'width 0.4s ease, background 0.4s ease',
    borderRadius: 2,
  },
  iconColumn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'row',
    gap: 60,
    alignItems: 'flex-start',
  },
  taskbar: {
    height: 36,
    background: 'rgba(12,12,22,0.98)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderTop: '1px solid #2a2a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 5,
  },
  taskbarText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#8888aa',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    width: 380,
    background: '#0d0d1a',
    border: '1px solid #2a2a4a',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
    animation: 'fadeIn 0.2s ease',
  },
  modalText: {
    fontSize: 13,
    color: '#e8e8f5',
    lineHeight: 1.5,
    marginBottom: 20,
  },
  modalButtons: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
  },
  modalCancel: {
    padding: '8px 18px',
    borderRadius: 4,
    border: '1px solid #2a2a4a',
    background: 'transparent',
    color: '#7a7a9a',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.05em',
    cursor: 'pointer',
  },
  modalConfirm: {
    padding: '8px 18px',
    borderRadius: 4,
    border: '1px solid #aa1122',
    background: 'rgba(170,17,34,0.2)',
    color: '#ff4455',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.05em',
    cursor: 'pointer',
  },
}
