import { useGame } from '../context/GameContext'
import projets from '../data/projets.json'

export function useGameEngine() {
  const game = useGame()

  const projetsActifsObjs = projets.filter((p) => game.projetsActifs.includes(p.id))
  const revenuQuotidien = projetsActifsObjs.reduce((s, p) => s + p.revenuQuotidien, 0)
  const risqueQuotidien = projetsActifsObjs.reduce((s, p) => s + p.risqueQuotidien, 0)

  const handleNextDay = () => game.passerAuJourSuivant(projets)

  return {
    projets,
    revenuQuotidien,
    risqueQuotidien,
    handleNextDay,
  }
}
