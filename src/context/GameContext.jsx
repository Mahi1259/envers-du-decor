import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import mailsData from '../data/mails.json'

const GameContext = createContext(null)

const NOMS_JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const CODES_JOURS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN']

const ETAT_INITIAL = {
  nomJoueur: '',
  jourActuel: 1,
  compteEnBanque: 10000,
  risqueLegal: 0,
  projetsAchetes: [],
  projetsActifs: [],
  projetsUtilises: [],
  tutorialActive: true,
  tutorialStep: 0,
  statutJeu: 'intro',
  inbox: [],
  mailsLus: [],
  nouveauMail: false,
  projetsHackes: [],
}

export function GameProvider({ children }) {
  const [etat, setEtat] = useState(ETAT_INITIAL)

  const setNomJoueur = (nom) => setEtat((s) => ({ ...s, nomJoueur: nom }))

  const setStatutJeu = (statut) => setEtat((s) => ({ ...s, statutJeu: statut }))

  const setTutorialActive = (active) =>
    setEtat((s) => ({ ...s, tutorialActive: active }))

  const setTutorialStep = (step) =>
    setEtat((s) => ({
      ...s,
      tutorialStep: typeof step === 'function' ? step(s.tutorialStep) : step,
    }))

  const setNouveauMail = (val) =>
    setEtat((s) => ({ ...s, nouveauMail: !!val }))

  const setMailsLus = (updater) =>
    setEtat((s) => ({
      ...s,
      mailsLus:
        typeof updater === 'function' ? updater(s.mailsLus) : updater,
    }))

  const acheterProjet = (projet) => {
    setEtat((s) => {
      if (s.projetsAchetes.includes(projet.id)) return s
      if (s.compteEnBanque < projet.coutAchat) return s
      return {
        ...s,
        compteEnBanque: s.compteEnBanque - projet.coutAchat,
        projetsAchetes: [...s.projetsAchetes, projet.id],
      }
    })
  }

  const toggleProjet = (projetId) => {
    setEtat((s) => {
      if (!s.projetsAchetes.includes(projetId)) return s
      const actif = s.projetsActifs.includes(projetId)
      const nextActifs = actif
        ? s.projetsActifs.filter((id) => id !== projetId)
        : [...s.projetsActifs, projetId]
      const nextUtilises =
        !actif && !s.projetsUtilises.includes(projetId)
          ? [...s.projetsUtilises, projetId]
          : s.projetsUtilises
      return {
        ...s,
        projetsActifs: nextActifs,
        projetsUtilises: nextUtilises,
      }
    })
  }

  const passerAuJourSuivant = (
    projets,
    hackMails = [],
    newHackedProjects = []
  ) => {
    setEtat((s) => {
      const actifs = projets.filter((p) => s.projetsActifs.includes(p.id))
      const revenu = actifs.reduce((sum, p) => sum + p.revenuQuotidien, 0)
      const risque = actifs.reduce((sum, p) => sum + p.risqueQuotidien, 0)

      const totalPerte = hackMails.reduce(
        (sum, m) => sum + (m.perteArgent || 0),
        0
      )
      const totalMalus = hackMails.reduce(
        (sum, m) => sum + (m.malusRisque || 0),
        0
      )

      const baseRisk =
        actifs.length === 0
          ? 0
          : Math.max(0, Math.min(100, s.risqueLegal + risque - 15))

      const newBank = s.compteEnBanque + revenu - totalPerte
      const newRisk = Math.max(0, Math.min(100, baseRisk + totalMalus))
      const newDay = s.jourActuel + 1

      let newStatut = s.statutJeu
      if (newRisk >= 100) newStatut = 'game_over'
      else if (newDay > 5) newStatut = 'victoire'

      const nextInbox =
        hackMails.length > 0 ? [...s.inbox, ...hackMails] : s.inbox
      const nextNouveau = hackMails.length > 0 ? true : s.nouveauMail
      const nextHackes =
        newHackedProjects.length > 0
          ? [...s.projetsHackes, ...newHackedProjects]
          : s.projetsHackes

      return {
        ...s,
        compteEnBanque: newBank,
        risqueLegal: newRisk,
        jourActuel: newDay,
        statutJeu: newStatut,
        inbox: nextInbox,
        nouveauMail: nextNouveau,
        projetsHackes: nextHackes,
      }
    })
  }

  const abandonner = () => setEtat((s) => ({ ...s, statutJeu: 'game_over' }))

  const reset = () =>
    setEtat((s) => ({
      ...ETAT_INITIAL,
      nomJoueur: s.nomJoueur,
      tutorialActive: false,
      statutJeu: 'en_cours',
    }))

  const quitter = () => setEtat(ETAT_INITIAL)

  useEffect(() => {
    if (etat.statutJeu === 'en_cours' && etat.inbox.length === 0) {
      const intro = mailsData.find((m) => m.id === 'intro_sous_traitance')
      if (intro) {
        setEtat((s) => ({
          ...s,
          inbox: [{ ...intro, instanceId: intro.id + '_day0' }],
          nouveauMail: true,
        }))
      }
    }
  }, [etat.statutJeu, etat.inbox.length])

  const derived = useMemo(() => {
    const idx = Math.min(etat.jourActuel - 1, 4)
    return {
      nomJour: NOMS_JOURS[idx] ?? 'Vendredi',
      jourCode: CODES_JOURS[idx] ?? 'VEN',
    }
  }, [etat.jourActuel])

  const value = {
    ...etat,
    ...derived,
    setNomJoueur,
    setStatutJeu,
    setTutorialActive,
    setTutorialStep,
    setNouveauMail,
    setMailsLus,
    acheterProjet,
    toggleProjet,
    passerAuJourSuivant,
    abandonner,
    reset,
    quitter,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
