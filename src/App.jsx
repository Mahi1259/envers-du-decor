import { GameProvider, useGame } from './context/GameContext'
import EcranIntro from './components/EcranIntro'
import EcranAccueil from './components/EcranAccueil'
import EcranBoot from './components/EcranBoot'
import BureauOS from './components/BureauOS'
import EcranFinJournal from './components/EcranFinJournal'

function GameRouter() {
  const { statutJeu } = useGame()
  const screens = {
    intro: <EcranIntro />,
    accueil: <EcranAccueil />,
    boot: <EcranBoot />,
    en_cours: <BureauOS />,
    game_over: <EcranFinJournal statut="game_over" />,
    victoire: <EcranFinJournal statut="victoire" />,
  }
  return screens[statutJeu] ?? <EcranIntro />
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  )
}
