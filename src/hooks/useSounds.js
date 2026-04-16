let sharedCtx = null

function getCtx() {
  if (window._gameAudioCtx && window._gameAudioCtx.state !== 'closed') {
    if (window._gameAudioCtx.state === 'suspended') {
      window._gameAudioCtx.resume()
    }
    sharedCtx = window._gameAudioCtx
    return sharedCtx
  }
  sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  window._gameAudioCtx = sharedCtx
  return sharedCtx
}

function playTone(frequency, duration, volume = 0.3, type = 'sine', startDelay = 0) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = type
    const start = ctx.currentTime + startDelay
    gain.gain.setValueAtTime(0.001, start)
    gain.gain.linearRampToValueAtTime(volume, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
    osc.start(start)
    osc.stop(start + duration + 0.05)
  } catch (e) {
    console.warn('Audio error:', e)
  }
}

export function useSounds() {
  function playTyping() {
    playTone(900, 0.04, 0.12, 'square')
  }

  function playLineComplete() {
    playTone(1200, 0.1, 0.18, 'sine')
  }

  function playOminous() {
    playTone(160, 0.3, 0.28, 'sawtooth')
    setTimeout(() => playTone(120, 0.25, 0.2, 'sawtooth'), 100)
  }

  function playBootComplete() {
    try {
      const ctx = getCtx()
      ;[523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const start = ctx.currentTime + i * 0.14
        gain.gain.setValueAtTime(0.001, start)
        gain.gain.linearRampToValueAtTime(0.22, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4)
        osc.start(start)
        osc.stop(start + 0.45)
      })
    } catch (e) {}
  }

  function playPurchase() {
    try {
      const ctx = getCtx()
      ;[880, 1100, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const start = ctx.currentTime + i * 0.07
        gain.gain.setValueAtTime(0.001, start)
        gain.gain.linearRampToValueAtTime(0.25, start + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)
        osc.start(start)
        osc.stop(start + 0.22)
      })
    } catch (e) {}
  }

  function playToggleOn() {
    playTone(660, 0.14, 0.28, 'sine')
  }

  function playToggleOff() {
    playTone(330, 0.14, 0.28, 'sine')
  }

  function playEndDay() {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35)
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch (e) {}
  }

  function playMoneyUp() {
    try {
      const ctx = getCtx()
      ;[1047, 1175, 1319].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'triangle'
        const start = ctx.currentTime + i * 0.09
        gain.gain.setValueAtTime(0.001, start)
        gain.gain.linearRampToValueAtTime(0.2, start + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
        osc.start(start)
        osc.stop(start + 0.26)
      })
    } catch (e) {}
  }

  function playRiskUp(riskLevel) {
    const freq = riskLevel > 70 ? 140 : riskLevel > 40 ? 200 : 280
    playTone(freq, 0.3, 0.32, 'sawtooth')
  }

  function playGameOver() {
    try {
      const ctx = getCtx()
      ;[440, 370, 311, 261].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sawtooth'
        const start = ctx.currentTime + i * 0.22
        gain.gain.setValueAtTime(0.001, start)
        gain.gain.linearRampToValueAtTime(0.3, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.42)
        osc.start(start)
        osc.stop(start + 0.46)
      })
    } catch (e) {}
  }

  function playVictoire() {
    try {
      const ctx = getCtx()
      ;[523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const start = ctx.currentTime + i * 0.16
        gain.gain.setValueAtTime(0.001, start)
        gain.gain.linearRampToValueAtTime(0.25, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.44)
        osc.start(start)
        osc.stop(start + 0.48)
      })
    } catch (e) {}
  }

  function playLogin() {
    playTone(600, 0.18, 0.25, 'sine')
  }

  function playNewspaper() {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(130, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18)
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.22)
    } catch (e) {}
  }

  return {
    playTyping,
    playLineComplete,
    playOminous,
    playBootComplete,
    playPurchase,
    playToggleOn,
    playToggleOff,
    playEndDay,
    playMoneyUp,
    playRiskUp,
    playGameOver,
    playVictoire,
    playLogin,
    playNewspaper,
  }
}
