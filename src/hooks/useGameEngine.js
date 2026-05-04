import { useGame } from '../context/GameContext'
import projets from '../data/projets.json'
import mails from '../data/mails.json'

export function useGameEngine() {
  const game = useGame()

  const projetsActifsObjs = projets.filter((p) => game.projetsActifs.includes(p.id))
  const revenuQuotidien = projetsActifsObjs.reduce((s, p) => s + p.revenuQuotidien, 0)
  const risqueQuotidien = projetsActifsObjs.reduce((s, p) => s + p.risqueQuotidien, 0)

  const handleNextDay = () => {
    const actifs = game.projetsActifs
    const hackMails = []
    const newHackedProjects = []

    actifs.forEach((projetId) => {
      if (game.projetsHackes.includes(projetId)) return

      const linked = mails.filter((m) => m.projetLie === projetId)
      if (linked.length === 0) return

      const picked = linked[Math.floor(Math.random() * linked.length)]
      hackMails.push({
        ...picked,
        instanceId: picked.id + '_' + Date.now() + '_' + projetId,
      })
      newHackedProjects.push(projetId)
    })

    game.passerAuJourSuivant(projets, hackMails, newHackedProjects)
  }

  return {
    projets,
    revenuQuotidien,
    risqueQuotidien,
    handleNextDay,
  }
}
