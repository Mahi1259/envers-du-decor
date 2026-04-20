import { createContext, useContext, useState, useMemo } from 'react'

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

  const passerAuJourSuivant = (projets) => {
    setEtat((s) => {
      const actifs = projets.filter((p) => s.projetsActifs.includes(p.id))
      const revenu = actifs.reduce((sum, p) => sum + p.revenuQuotidien, 0)
      const risque = actifs.reduce((sum, p) => sum + p.risqueQuotidien, 0)
      const newBank = s.compteEnBanque + revenu
      const newRisk = Math.max(0, Math.min(100, s.risqueLegal + risque - 10))
      const newDay = s.jourActuel + 1
      let newStatut = s.statutJeu
      if (newRisk >= 100) newStatut = 'game_over'
      else if (newDay > 5) newStatut = 'victoire'
      return {
        ...s,
        compteEnBanque: newBank,
        risqueLegal: newRisk,
        jourActuel: newDay,
        statutJeu: newStatut,
      }
    })
  }

  const abandonner = () => setEtat((s) => ({ ...s, statutJeu: 'game_over' }))

  const reset = () => setEtat(ETAT_INITIAL)

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
    acheterProjet,
    toggleProjet,
    passerAuJourSuivant,
    abandonner,
    reset,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
