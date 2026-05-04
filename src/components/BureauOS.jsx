import { useEffect, useRef, useState } from 'react'
import { Briefcase, Calendar as CalIcon, Mail, Trash2 } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useGameEngine } from '../hooks/useGameEngine'
import { useSounds } from '../hooks/useSounds'
import FenetreBusinessManager from './FenetreBusinessManager'
import FenetreMail from './FenetreMail'
import TutorialOverlay from './TutorialOverlay'

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    titre: 'Bienvenue, PDG',
    description:
      'Vous avez 5 jours (Lundi à Vendredi) pour maximiser vos profits sans vous faire arrêter par la CNIL. Voici comment fonctionne votre système.',
    highlight: null,
    position: 'center',
  },
  {
    id: 'compte',
    titre: 'Votre Compte Bancaire',
    description:
      "C'est votre solde actuel. Chaque projet actif vous rapporte de l'argent chaque jour. Votre objectif : maximiser ce chiffre.",
    highlight: 'stat-compte',
    position: 'bottom',
  },
  {
    id: 'journee',
    titre: 'Le Compteur de Journée',
    description:
      'Vous êtes ici au Jour 1 sur 5. La semaine va du Lundi au Vendredi. Chaque fin de journée, vos projets actifs calculent vos gains et votre risque avant de passer au jour suivant.',
    highlight: 'stat-journee',
    position: 'bottom',
  },
  {
    id: 'risque',
    titre: 'Jauge de Risque Légal',
    description:
      "C'est votre niveau de danger. Plus vous collectez de données illégalement, plus il monte. Si elle atteint 100%, vous êtes arrêté. Ne la laissez jamais monter trop haut.",
    highlight: 'stat-risque',
    position: 'bottom',
  },
  {
    id: 'boss_manager',
    titre: 'Boss Manager',
    description:
      "Cliquez sur cette icône pour ouvrir votre tableau de bord. Vous y trouverez les projets de collecte de données à acheter et activer. Chaque projet rapporte de l'argent mais ajoute du risque légal.",
    highlight: 'icon-boss',
    position: 'right',
  },
  {
    id: 'calendrier',
    titre: 'Le Calendrier',
    description:
      'Quand vous avez fini de configurer vos projets, cliquez sur le calendrier pour terminer la journée. Le jeu calculera vos gains, votre risque, et passera au jour suivant.',
    highlight: 'icon-calendrier',
    position: 'right',
  },
  {
    id: 'mail',
    titre: 'Boîte Mail',
    description:
      "Chaque nuit, vos activités illégales peuvent attirer des hackers. Plus vous avez de projets actifs, plus vous êtes vulnérable. Le lendemain matin, un badge rouge apparaît sur cette icône : votre argent a déjà été débité. Cliquez pour lire ce qui s'est passé.",
    highlight: 'icon-mail',
    position: 'right',
  },
  {
    id: 'corbeille',
    titre: 'La Corbeille',
    description:
      'Si vous voulez arrêter la partie à tout moment, cliquez sur la corbeille. Vous verrez votre bilan final immédiatement.',
    highlight: 'icon-corbeille',
    position: 'right',
  },
  {
    id: 'strategie',
    titre: 'Votre Stratégie',
    description:
      'Chaque jour le risque baisse naturellement de 10% si vous restez discret. Utilisez cela à votre avantage : activez beaucoup un jour, reposez-vous le lendemain. Survivez 5 jours et vous gagnez.',
    highlight: null,
    position: 'center',
  },
  {
    id: 'ready',
    titre: 'Vous êtes prêt',
    description:
      'Votre première semaine commence. Les données de 4,2 millions de joueurs vous attendent. Bonne chance.',
    highlight: null,
    position: 'center',
  },
]

function fmt(n) {
  return new Intl.NumberFormat('fr-CH').format(n)
}

const RISK_COLOR = (r) => (r >= 70 ? '#ff4455' : r >= 40 ? '#ffaa33' : '#44dd88')

function getDesktopBackground(risk) {
  if (risk >= 70) {
    return `
      radial-gradient(ellipse at 30% 40%, rgba(120,20,20,0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 70% 60%, rgba(100,10,30,0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, rgba(80,10,10,0.4) 0%, transparent 60%),
      linear-gradient(180deg, #140808 0%, #0a0404 100%)
    `
  }
  if (risk >= 40) {
    return `
      radial-gradient(ellipse at 30% 40%, rgba(100,40,20,0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 70% 60%, rgba(80,30,20,0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, rgba(60,20,10,0.3) 0%, transparent 60%),
      linear-gradient(180deg, #120a06 0%, #0a0804 100%)
    `
  }
  return `
    radial-gradient(ellipse at 30% 40%, rgba(60,60,160,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(100,50,150,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(30,30,80,0.3) 0%, transparent 60%),
    linear-gradient(180deg, #0e0e1e 0%, #080812 100%)
  `
}

export default function BureauOS() {
  const {
    nomJoueur,
    nomJour,
    jourCode,
    jourActuel,
    compteEnBanque,
    risqueLegal,
    abandonner,
    tutorialActive,
    tutorialStep,
    setTutorialActive,
    setTutorialStep,
    inbox,
    mailsLus,
    setNouveauMail,
  } = useGame()
  const { handleNextDay } = useGameEngine()
  const sounds = useSounds()
  const [windowOpen, setWindowOpen] = useState(false)
  const [mailOpen, setMailOpen] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const unreadCount = inbox.filter(
    (m) => !mailsLus.includes(m.instanceId ?? m.id)
  ).length
  const [moneyAnim, setMoneyAnim] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [shownNotifs, setShownNotifs] = useState(new Set())
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

  useEffect(() => {
    const notifConfig = [
      {
        id: 'notif_50',
        threshold: 50,
        titre: 'SURVEILLANCE PRÉLIMINAIRE',
        message:
          'La CNIL a ouvert une enquête préliminaire sur DataMax Divertissement. Des activités suspectes ont été détectées.',
        niveau: 'warning',
      },
      {
        id: 'notif_70',
        threshold: 70,
        titre: 'ENQUÊTE ESCALADÉE',
        message:
          'La CNIL a escaladé son enquête. Des inspecteurs ont été dépêchés. Une action immédiate est recommandée.',
        niveau: 'danger',
      },
      {
        id: 'notif_90',
        threshold: 90,
        titre: "MANDAT D'ARRÊT ÉMIS",
        message:
          "Un mandat d'arrêt a été émis contre le PDG de DataMax. Un seul faux pas et tout est terminé.",
        niveau: 'critical',
      },
    ]

    notifConfig.forEach((config) => {
      if (risqueLegal >= config.threshold && !shownNotifs.has(config.id)) {
        setShownNotifs((prev) => new Set([...prev, config.id]))
        const uid = config.id + '_' + Date.now()
        const newNotif = { ...config, id: uid }
        setNotifications((prev) => [...prev, newNotif])
      }
    })
  }, [risqueLegal, shownNotifs])

  const onEndDay = () => {
    sounds.playEndDay()
    handleNextDay()
  }

  const handleTutorialNext = () => {
    if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
      setTutorialActive(false)
    } else {
      setTutorialStep(tutorialStep + 1)
    }
  }

  const handleTutorialSkip = () => {
    setTutorialActive(false)
    setTutorialStep(0)
  }

  const riskColor = RISK_COLOR(risqueLegal)
  const riskHigh = risqueLegal >= 70
  const riskExtreme = risqueLegal >= 80

  const riskCardAnimation = riskExtreme
    ? 'riskShake 0.5s ease infinite, riskPulse 1s ease infinite'
    : riskHigh
      ? 'pulse-red 1.6s infinite'
      : 'none'

  const riskCardShadow = riskExtreme
    ? '0 0 20px rgba(255,68,85,0.4), 0 0 40px rgba(255,68,85,0.2)'
    : risqueLegal >= 40
      ? '0 0 12px rgba(255,170,51,0.2)'
      : '0 4px 20px rgba(0,0,0,0.4)'

  return (
    <div style={styles.root}>
      <div style={styles.menuBar}>
        <div style={styles.menuLeft}>DataMax OS</div>
        <div style={styles.menuRight}>
          <span>{nomJoueur}</span>
          <span>{nomJour}</span>
          <span>18:15</span>
        </div>
      </div>

      <div
        style={{
          ...styles.desktop,
          background: getDesktopBackground(risqueLegal),
          transition: 'background 2s ease',
        }}
      >
        <div style={styles.statusRow}>
          <div id="stat-compte" style={styles.statCard}>
            <div style={styles.statLabel}>COMPTE</div>
            <div
              key={moneyAnim ? 'a' : 'b'}
              style={{
                ...styles.statValue,
                color: '#44dd88',
                animation: moneyAnim ? 'moneyPop 0.6s ease' : 'none',
              }}
            >
              {fmt(compteEnBanque)} CHF
            </div>
          </div>

          <div id="stat-journee" style={styles.statCard}>
            <div style={styles.statLabel}>JOURNÉE</div>
            <div style={{ ...styles.statValue, fontFamily: 'Inter', fontWeight: 600, fontSize: 20 }}>
              {nomJour}
            </div>
            <div style={styles.statSub}>Jour {Math.min(jourActuel, 5)} / 5</div>
          </div>

          <div
            id="stat-risque"
            style={{
              ...styles.statCard,
              animation: riskCardAnimation,
              borderColor: riskHigh ? '#aa1122' : risqueLegal >= 40 ? '#6a4a22' : '#3a3a5a',
              boxShadow: riskCardShadow,
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
          <div id="icon-boss" style={{ position: 'relative' }}>
            <DesktopIcon
              label="Boss Manager"
              iconBg="linear-gradient(135deg, #3a3aaa, #2a2a6a)"
              iconBorder="#5555cc"
              iconColor="#c0c0ff"
              Icon={Briefcase}
              labelColor="#b0b0cc"
              onClick={() => setWindowOpen(true)}
            />
          </div>

          <div id="icon-calendrier" style={{ position: 'relative' }}>
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
          </div>

          <div id="icon-mail" style={{ position: 'relative' }}>
            <DesktopIcon
              label="Mails"
              iconBg={
                unreadCount > 0
                  ? 'linear-gradient(135deg, #aa2233, #661122)'
                  : 'linear-gradient(135deg, #3a3a6a, #2a2a4a)'
              }
              iconBorder={unreadCount > 0 ? '#cc4455' : '#5555aa'}
              iconColor="#e8e8f5"
              Icon={Mail}
              hoverShadow={
                unreadCount > 0
                  ? '0 0 16px rgba(255,68,85,0.4)'
                  : '0 0 16px rgba(102,102,221,0.35)'
              }
              labelColor={unreadCount > 0 ? '#ff6677' : '#b0b0cc'}
              onClick={() => {
                setMailOpen(true)
                setNouveauMail(false)
              }}
            />
            {unreadCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 12,
                  minWidth: 20,
                  height: 20,
                  padding: '0 6px',
                  background: '#ff4455',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#ffffff',
                  border: '2px solid #0a0a14',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 0 8px rgba(255,68,85,0.5)',
                  pointerEvents: 'none',
                }}
              >
                {unreadCount}
              </div>
            )}
          </div>

          <div id="icon-corbeille" style={{ position: 'relative' }}>
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
      </div>

      <div style={styles.taskbar}>
        <span style={styles.taskbarText}>DataMax OS v2.1</span>
        <span style={styles.taskbarText}>Chiffrement actif</span>
      </div>

      {windowOpen && <FenetreBusinessManager onClose={() => setWindowOpen(false)} />}

      {mailOpen && <FenetreMail onClose={() => setMailOpen(false)} />}

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

      <NotificationContainer
        notifications={notifications}
        onDismiss={(id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      />

      {tutorialActive && (
        <TutorialOverlay
          step={TUTORIAL_STEPS[tutorialStep]}
          stepIndex={tutorialStep}
          totalSteps={TUTORIAL_STEPS.length}
          onNext={handleTutorialNext}
          onSkip={handleTutorialSkip}
        />
      )}
    </div>
  )
}

function NotificationContainer({ notifications, onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 48,
        right: 20,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 280,
      }}
    >
      {notifications.map((notif) => (
        <NotifCard key={notif.id} notif={notif} onDismiss={() => onDismiss(notif.id)} />
      ))}
    </div>
  )
}

function NotifCard({ notif, onDismiss }) {
  const colors = {
    warning: { border: '#aa7700', bg: 'rgba(30,20,0,0.97)', accent: '#ffaa33', bar: '#ffaa33' },
    danger: { border: '#aa3300', bg: 'rgba(30,8,0,0.97)', accent: '#ff6633', bar: '#ff6633' },
    critical: { border: '#aa0011', bg: 'rgba(30,0,5,0.97)', accent: '#ff4455', bar: '#ff4455' },
  }
  const c = colors[notif.niveau]

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px ${c.border}40`,
        animation: 'slideInRight 0.3s ease',
      }}
    >
      <div style={{ height: 2, background: c.bar, width: '100%' }} />

      <div style={{ padding: '10px 12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 8,
                  color: c.accent,
                  letterSpacing: '0.15em',
                }}
              >
                CNIL - ALERTE OFFICIELLE
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 11,
                  color: '#e8e8f5',
                  marginTop: 2,
                }}
              >
                {notif.titre}
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a4a6a',
              cursor: 'pointer',
              fontSize: 13,
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 10.5,
            color: '#9a9aaa',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {notif.message}
        </p>

        <div
          style={{
            marginTop: 7,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8.5,
            color: '#3a3a5a',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Réf: CNIL-2026-{Math.floor(Math.random() * 9000) + 1000}</span>
          <span>Chiffré</span>
        </div>
      </div>
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
